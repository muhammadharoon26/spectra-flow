import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // CSRF Protection
  const csrf = async () => {
    await api.get('/sanctum/csrf-cookie', { baseURL: 'http://localhost:8000' });
  };

  const getUser = async () => {
    try {
      const { data } = await api.get('/user');
      console.log('User fetched:', data);
      setUser(data);
    } catch (error) {
      console.log('User fetch failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    await csrf();
    await api.post('/login', { email, password });
    await getUser();
  };

  const register = async ({ name, email, password, password_confirmation }) => {
    await csrf();
    await api.post('/register', { name, email, password, password_confirmation });
    await getUser();
  };

  const logout = async () => {
    await api.post('/logout');
    setUser(null);
  };

  useEffect(() => {
    // Check if user is logged in on refresh
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
