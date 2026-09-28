import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('portfolio_admin_token'));
  const [user, setUser] = useState(() => {
    return localStorage.getItem('portfolio_admin_token') ? { role: 'ADMIN' } : null;
  });

  const login = async (username, password) => {
    try {
      const res = await authApi.login({ username, password });
      const jwtToken = res.data.token;
      localStorage.setItem('portfolio_admin_token', jwtToken);
      setToken(jwtToken);
      setUser({ role: 'ADMIN' });
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.message || err.error || 'Authentication failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('portfolio_admin_token');
    setToken(null);
    setUser(null);
    window.location.href = '/admin/login';
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
