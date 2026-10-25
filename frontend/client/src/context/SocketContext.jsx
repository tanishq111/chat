import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext.jsx';
import { connectSocket, disconnectSocket } from '../api/socket.js';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [connected, setConnected] = useState(false);
  // State, not a ref: consumers must re-render once the socket exists.
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      setSocketInstance(null);
      setConnected(false);
      return;
    }

    const socket = connectSocket();
    setSocketInstance(socket);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onError = (err) => {
      console.error('[socket] connect_error:', err.message);
      setConnected(false);
    };

    socket.on('connect', onConnect); // listeners
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onError);

    if (socket.connected) setConnected(true);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onError);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
