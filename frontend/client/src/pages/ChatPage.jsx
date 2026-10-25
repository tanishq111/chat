import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import '../styles/chat.css';

const ChatPage = () => {
  const { conversationId } = useParams();

  return (
    <div className="chat-shell">
      <Sidebar activeId={conversationId} />
      {conversationId ? (
        <ChatWindow  key={conversationId} conversationId={conversationId} />
      ) : (
        <div className="chat-empty">Pick a conversation to start chatting</div>
      )}
    </div>
  );
};

export default ChatPage;