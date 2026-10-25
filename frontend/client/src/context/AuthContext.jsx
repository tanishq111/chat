import { createContext, useState ,useEffect} from 'react';
import { login, register  } from '../api/client.js';
import { getMe ,logout } from '../api/auth.js';


export const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
         getMe().then(response => {
             setUser(response.data.user);
         }).catch(() => {
             setUser(null);
         }).finally(() => {
             setLoading(false);
         });
    }, []);

    const loginUser = async (userData) => {
        setLoading(true);
        const response = await login(userData);
        setUser(response.data.user);
        setLoading(false);
    };

    const registerUser = async (userData) => {
        setLoading(true);
        await register(userData);
        setLoading(false);
    };

    const logoutUser = async () => {
        await logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}
