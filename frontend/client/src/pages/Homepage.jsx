import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const HomePage = () => {

  const { user, loading } = useContext(AuthContext);
  return (
    <div>
      {loading && <p>Loading...</p> }
      {!loading && user && <h1>Welcome {user.username}</h1>}
      {!loading && !user && <h1>Please log in</h1>}
    </div>
  );
};

export default HomePage;