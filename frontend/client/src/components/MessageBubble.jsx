const MessageBubble = ({ message, mine }) => {
  return (
    <div className={`bubble ${mine ? 'mine' : 'theirs'} ${message.status ?? ''}`}>
      <p>{message.text}</p>
      <time>{new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit' })}</time>
    </div>
  );
};

export default MessageBubble;