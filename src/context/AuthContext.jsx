// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('userData');
  });

  const [userRole, setUserRole] = useState(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        return parsed.role || parsed.desg || null; // Handle different property names if needed
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Store complete user data for component access
  const [userData, setUserData] = useState(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const login = (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log("UserData: ", userData);
    setIsAuthenticated(true);
    setUserRole(userData.role || userData.desg);
    setUserData(userData);
  };

  const logout = () => {
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};