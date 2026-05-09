import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decoded);
        }
      } catch (error) {
        console.error('Invalid token', error);
        logout();
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  // Socket.io initialization
  useEffect(() => {
    if (user) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling']
      });
      
      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        newSocket.emit('join', user.userId);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
      };
    }
  }, [user]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    socket,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

