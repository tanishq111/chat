import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { getMessages, sendMessage } from "../api/chat";
import MessageList from './MessageList';
import MessageInput from './MessageInput';

// The same _id arrives twice: from the POST response and from the socket echo.
const upsert = (list, msg) => {
  const i = list.findIndex((m) => m._id === msg._id);
  if (i === -1) return [...list, msg];
  const next = [...list];
  next[i] = msg;
  return next;
};

const ChatWindow = ({ conversationId }) => {
  const { user } = useContext(AuthContext);
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    getMessages(conversationId, { limit: 20 }).then((res) => {
      const { messages, hasMore, nextCursor } = res.data;
      setMessages(messages);
      setHasMore(hasMore);
      setCursor(nextCursor);
    });
  }, [conversationId]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const join = () => socket.emit('conversation:join', conversationId, (ack) => {
      if (!ack?.ok) console.error('join failed:', ack?.error);
    });

    join();
    socket.on('connect', join); // a reconnect is a new connection, so room membership is lost

    return () => {
      socket.off('connect', join);
      socket.emit('conversation:leave', conversationId);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    if (!socket) return;

    const onNew = (msg) => {
      if (msg.conversationId !== conversationId) return;
      setMessages((prev) => upsert(prev, msg));
    };

    socket.on('message:new', onNew);
    return () => socket.off('message:new', onNew);
  }, [socket, conversationId]);

  useEffect(() => {
    if (!socket) return;

    const onStart = ({ conversationId: id, userId, username }) => {
      if (id !== conversationId) return;
      setTypingUsers((prev) =>
        prev.some((u) => u.userId === userId) ? prev : [...prev, { userId, username }]);
    };

    const onStop = ({ conversationId: id, userId }) => {
      if (id !== conversationId) return;
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    };

    socket.on('typing:start', onStart);
    socket.on('typing:stop', onStop);

    return () => {
      socket.off('typing:start', onStart);
      socket.off('typing:stop', onStop);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    setTypingUsers([]);
  }, [conversationId]);

  const handleSend = async (text) => {
    const temp = {
      _id: `temp-${crypto.randomUUID()}`,
      conversationId,
      sender: { _id: user.id, username: user.username },
      text,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, temp]);

    try {
      const res = await sendMessage(conversationId, text);
      // Drop the temp, then upsert: the socket echo may already have landed.
      setMessages((prev) =>
        upsert(prev.filter((m) => m._id !== temp._id), res.data.message));
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m._id === temp._id ? { ...m, status: 'failed' } : m)));
    }
  };

  const handleTyping = () => socket?.emit('typing:start', conversationId);
  const handleStopTyping = () => socket?.emit('typing:stop', conversationId);

  return (
    <section className="chat-window">
      <MessageList messages={messages} me={user} />

      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          <span>
            {typingUsers.map((u) => u.username).join(', ')}
            {typingUsers.length === 1 ? ' is' : ' are'} typing
          </span>
          <i /><i /><i />
        </div>
      )}

      <MessageInput
        onSend={handleSend}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
      />
    </section>
  );
};

export default ChatWindow;