import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { searchUsers, createConversation } from "../api/chat";

 const UserSearch = () => {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const debounced = useDebounce(term, 300);
  const navigate = useNavigate();

  useEffect(() => {
    if (debounced.trim().length < 2) return setResults([]);
    searchUsers(debounced).then((res) => setResults(res.data.users));
  }, [debounced]);

  const start = async (userId) => {
    const res = await createConversation(userId);
    setTerm('');
    setResults([]);
    navigate(`/chat/${res.data.conversation._id}`);
  };

  return (
    <div className="user-search">
      <input value={term} onChange={(e) => setTerm(e.target.value)}
             placeholder="Search people…" />
      {results.map((u) => (
        <button key={u._id} onClick={() => start(u._id)}>{u.username}</button>
      ))}
    </div>
  );
};
export default UserSearch;  