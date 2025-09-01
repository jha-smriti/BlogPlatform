// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch user info on mount
  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        withCredentials: true,
      });
      setUsername(res.data.username);
    } catch {
      setUsername('');
    }
  };

  // Fetch unread notification count
  const refreshUnread = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications/unread-count', {
        withCredentials: true,
      });
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  // Initial fetch + polling every 10s (if logged in)
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (username) {
      refreshUnread();
      const interval = setInterval(refreshUnread, 20000);
      return () => clearInterval(interval);
    }
  }, [username]);

  // Login
  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    }, {
      withCredentials: true,
    });
    setUsername(res.data.username);
    refreshUnread();
  };

  // Logout
  const logout = async () => {
    await axios.post('http://localhost:5000/api/auth/logout', {}, {
      withCredentials: true,
    });
    setUsername('');
    setUnreadCount(0);
    window.location.href = '/'; // force refresh and redirect
  };

  return (
    <AuthContext.Provider value={{
      username,
      setUsername,
      login,
      logout,
      unreadCount,
      refreshUnread,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
