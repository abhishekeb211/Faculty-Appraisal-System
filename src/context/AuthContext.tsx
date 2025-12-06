import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { User, UserRole } from '../types/user.types';

interface AuthContextType {
  isAuthenticated: boolean;
  userData: User | null;
  userRole: UserRole | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('userData');
  });

  // Get userData and userRole from localStorage
  const getUserData = (): User | null => {
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
  const userRole = useMemo<UserRole | null>(() => {
    if (!userData) return null;
    // Check role first, then desg (designation), then default to null
    const role = userData.role || userData.desg?.toLowerCase();
    return role as UserRole || null;
  }, [userData]);

  const login = (userData: User): void => {
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log("UserData: " + JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  const logout = (): void => {
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

