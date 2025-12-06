// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('userData');
  });

  // Get userData and userRole from localStorage
  const getUserData = () => {
    try {
      const stored = localStorage.getItem('userData');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error parsing userData:', error);
      return null;
    }
  };

  const userData = useMemo(() => getUserData(), [isAuthenticated]);
  
  // Extract userRole from userData (check both 'role' and 'desg' properties)
  const userRole = useMemo(() => {
    if (!userData) return null;
    // Check role first, then desg (designation), then default to null
    return userData.role || userData.desg?.toLowerCase() || null;
  }, [userData]);

  const login = (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log("UserData: " + userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userData, 
      userRole, 
      login, 
      logout 
    }}>
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