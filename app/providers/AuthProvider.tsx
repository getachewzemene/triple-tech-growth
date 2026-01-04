"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logout: () => void;
  user: { username: string; isAdmin?: boolean } | null;
  registerUser: (userData: Record<string, unknown>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple auth credentials (in a real app, this would be handled by a backend)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "triple123",
};

// Demo student credentials for testing the student dashboard
const DEMO_STUDENT_CREDENTIALS = {
  email: "demo@student.com",
  password: "demo123",
  fullName: "Demo Student",
};

const queryClient = new QueryClient();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    isAdmin?: boolean;
  } | null>(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedAuth = safeLocalStorage.getItem("triple-auth", null);
    if (storedAuth) {
      setIsAuthenticated(true);
      setUser(storedAuth.user);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPassword = String(password).trim();

    // Check for demo student credentials first (email case-insensitive, ignore whitespace)
    if (
      normalizedEmail === DEMO_STUDENT_CREDENTIALS.email.toLowerCase() &&
      normalizedPassword === DEMO_STUDENT_CREDENTIALS.password
    ) {
      const userData = { username: DEMO_STUDENT_CREDENTIALS.fullName, isAdmin: false };
      setIsAuthenticated(true);
      setUser(userData);
      safeLocalStorage.setItem("triple-auth", { user: userData });
      return true;
    }

    // Check if it's a registered user
    const registeredUsers = safeLocalStorage.getItem("registeredUsers", []);
    const foundUser = registeredUsers.find(
      (u: Record<string, any>) =>
        String(u.email || "").trim().toLowerCase() === normalizedEmail &&
        String(u.password || "").trim() === normalizedPassword,
    );

    if (foundUser) {
      const userData = { username: String(foundUser.fullName || ""), isAdmin: false };
      setIsAuthenticated(true);
      setUser(userData);
      safeLocalStorage.setItem("triple-auth", { user: userData });
      return true;
    }

    return false;
  };

  const loginAdmin = (username: string, password: string): boolean => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const userData = { username, isAdmin: true };
      setIsAuthenticated(true);
      setUser(userData);
      safeLocalStorage.setItem("triple-auth", { user: userData });
      return true;
    }

    return false;
  };

  const registerUser = (userData: Record<string, unknown>) => {
    const registeredUsers = safeLocalStorage.getItem("registeredUsers", []);
    registeredUsers.push({
      ...userData,
      registeredAt: new Date().toISOString(),
    });
    safeLocalStorage.setItem("registeredUsers", registeredUsers);

    // Auto-login the user
    const userAuthData = { username: String((userData as any).fullName ?? ""), isAdmin: false };
    setIsAuthenticated(true);
    setUser(userAuthData);
    safeLocalStorage.setItem("triple-auth", { user: userAuthData });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    safeLocalStorage.removeItem("triple-auth");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          login,
          loginAdmin,
          logout,
          user,
          registerUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
