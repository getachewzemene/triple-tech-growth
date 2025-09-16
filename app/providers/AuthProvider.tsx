'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logout: () => void;
  user: { username: string; isAdmin?: boolean } | null;
  registerUser: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple auth credentials (in a real app, this would be handled by a backend)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'triple123'
};

const queryClient = new QueryClient();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; isAdmin?: boolean } | null>(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedAuth = localStorage.getItem('triple-auth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsAuthenticated(true);
      setUser(authData.user);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Check if it's a registered user
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const foundUser = registeredUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { username: foundUser.fullName, isAdmin: false };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('triple-auth', JSON.stringify({ user: userData }));
      return true;
    }
    
    return false;
  };

  const loginAdmin = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const userData = { username, isAdmin: true };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('triple-auth', JSON.stringify({ user: userData }));
      return true;
    }
    
    return false;
  };

  const registerUser = (userData: any) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredUsers.push({
      ...userData,
      registeredAt: new Date().toISOString()
    });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Auto-login the user
    const userAuthData = { username: userData.fullName, isAdmin: false };
    setIsAuthenticated(true);
    setUser(userAuthData);
    localStorage.setItem('triple-auth', JSON.stringify({ user: userAuthData }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('triple-auth');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, login, loginAdmin, logout, user, registerUser }}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};