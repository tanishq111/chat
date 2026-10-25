import { useState, useRef, useEffect } from 'react';

const MessageInput = ({ onSend, onTyping, onStopTyping }) => {
  const [text, setText] = useState('');
  const stopTimer = useRef(null);
  const isTyping = useRef(false);

  useEffect(() => () => clearTimeout(stopTimer.current), []);

  const handleChange = (e) => {
    setText(e.target.value);

    if (!isTyping.current) {
      isTyping.current = true;
      onTyping?.();
    }

    clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(() => {
      isTyping.current = false;
      onStopTyping?.();
    }, 1500);
  };

  const submit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    clearTimeout(stopTimer.current);
    isTyping.current = false;
    onStopTyping?.();

    setText('');
    onSend(trimmed);
  };

  return (
    <form className="message-input" onSubmit={submit}>
      <input value={text} onChange={handleChange} placeholder="Type a message…" />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;