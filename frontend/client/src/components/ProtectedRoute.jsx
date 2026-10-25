import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <p className="route-status">Checking your session…</p>;

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
};

export default ProtectedRoute;

