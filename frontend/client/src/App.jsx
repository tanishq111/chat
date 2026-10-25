// import Card from "./components/Card";
// import { useState,useEffect } from "react";
// import { memo , useCallback , useRef } from "react";

// const users = [
//   { id: 1, name: "Tanishq", role: "Instructor", skills: ["React"], isOnline: true },
//   { id: 2, name: "Alice",   role: "Student",    skills: ["CSS"],   isOnline: false },
//   { id: 3, name: "Bob",     role: "Student",    skills: ["Node"],  isOnline: true },
//   { id: 4, name: "Charlie", role: "Student", skills: ["Python"], isOnline: false },
// ];



// // const Child = memo(({ label , cb}) => {
// //   console.log("🔵 Child rendered:", label);
// //   const start = performance.now();
// //   while(performance.now() - start < 200) {}
// //   return <p onClick={cb}>{label}</p>;
// // });

// // const Parent = () => {
// //   const [count, setCount] = useState(0);
// //   console.log("🟢 Parent rendered");
// //   const cb = useCallback(() => {
// //     console.log("Callback executed",count);
// //   }, [count]);

// //   return (
// //     <div>
// //       <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
// //       <Child label="I never change" cb={cb} />
// //       <Child label="Me neither" cb={cb} />
// //       <Child label="Same here" cb={cb} />
// //     </div>
// //   );
// // }


// const SearchBox = ({ setMessages , setQuery}) => {
//    return <input placeholder="Search..." onChange={(e) => { setMessages(prev => [...prev, e.target.value]); setQuery(e.target.value); }} />;
// }


// const MessageList = ({ messages, query }) => {

//      return (
//        <div>
//          {messages.filter(msg => msg.includes(query)).map((msg, index) => (
//            <p key={index}>{msg}</p>
//          ))}
//        </div>
//      );
// }

// // as soon as you type in the search box, the messages will be updated in the messageList component.

// import { useFetch } from "./hooks/useFetch";
// const Users = () => {
//   const { data, loading, error } = useFetch("https://jsonplaceholder.typicode.com/users");
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!data) return null;
//   return (
//     <ul>
//       {data.map(user => (
//         <li key={user.id}>{user.name}</li>
//       ))}
//     </ul>
//   );
// }
// const App = () => {
//   const [query, setQuery] = useState("");
//   const [messages, setMessages] = useState(["Hello", "World", "How are you?", "I am fine, thank you!"]);
//    return (
//      <>
//       <Users />
//      </>
//    );
// };

// export default App;






import { Route, Routes, Link } from "react-router-dom";
import HomePage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SingUpPage';
import ChatPage from './pages/ChatPage';
import './styles/auth.css';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute.jsx';


const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/chat/:conversationId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
};

export default App;