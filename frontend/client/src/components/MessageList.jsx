import MessageBubble from './MessageBubble';

const MessageList = ({ messages ,me}) => {
 return (
    <div className="message-list">
      {messages.map((m) => (
        <MessageBubble key={m._id} message={m} mine={m.sender._id === me.id} />
      ))}
    </div>
  );
};

export default MessageList;