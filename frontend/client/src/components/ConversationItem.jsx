import { Link } from "react-router-dom";

 const ConversationItem = ({ conversation, me, active }) => {
  const other = conversation.participants.find((p) => p._id !== me.id);

  return (
    <li className={active ? 'conv active' : 'conv'}>
      <Link to={`/chat/${conversation._id}`}>
        <span className="conv-name">{other?.username ?? 'Unknown'}</span>
        <span className="conv-preview">
          {conversation.lastMessage?.text ?? 'No messages yet'}
        </span>
      </Link>
    </li>
  );
};
export default ConversationItem;    