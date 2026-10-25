

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { getConversations } from "../api/chat";
import UserSearch from "./UserSearch";
import ConversationItem from "./ConversationItem";

const Sidebar = ({ activeId }) => {
  const { user } = useContext(AuthContext);
  const { socket } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConversations()
      .then((res) => setConversations(res.data.conversations))
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onUpdated = ({ conversationId, lastMessage }) => {
      setConversations((prev) => {
        const i = prev.findIndex((c) => c._id === conversationId);
        if (i === -1) return prev;
        const updated = { ...prev[i], lastMessage };
        return [updated, ...prev.filter((c) => c._id !== conversationId)];
      });
    };

    socket.on('conversation:updated', onUpdated);
    return () => socket.off('conversation:updated', onUpdated);
  }, [socket]);

  if (loading) return <aside className="sidebar">Loading…</aside>;

  return (
    <aside className="sidebar">
      <UserSearch />
      <ul>
        {conversations.map((c) => (
          <ConversationItem
            key={c._id}
            conversation={c}
            me={user}
            active={c._id === activeId}
          />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
