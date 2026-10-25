import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Layout = ({ children }) => {
    const { user, logoutUser } = useContext(AuthContext);
    return (
        <>
         <nav className="app-nav">
        <Link className="app-nav__brand" to="/">
          lets<span>Chat</span>
        </Link>

        <div className="app-nav__links">
          <Link to="/">Home</Link>
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/signup">Sign Up</Link>}
          {user && <Link to="/chat">Chat</Link>}
          {user && <Link to="/logout" onClick={logoutUser}>Logout</Link>}
        </div>
        </nav>
            <div className="layout">
                {children}
            </div>
        </>
    );
};

export default Layout;