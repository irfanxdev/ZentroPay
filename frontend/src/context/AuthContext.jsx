import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await API.get('/auth/dashboard');
      setUser(res.data.user);
      setIsAuth(true);
    } catch {
      setUser(null);
      setIsAuth(false);
      localStorage.removeItem('zentropay-token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuth(true);
    if (token) {
      localStorage.setItem('zentropay-token', token);
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      setIsAuth(false);
      localStorage.removeItem('zentropay-token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
