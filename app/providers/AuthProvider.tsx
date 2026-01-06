"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";

export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  isAdmin?: boolean;
  role: UserRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logout: () => void;
  user: AuthUser | null;
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

// Demo instructor credentials for testing the instructor dashboard
const DEMO_INSTRUCTOR_CREDENTIALS = {
  email: "demo@instructor.com",
  password: "demo123",
  fullName: "Demo Instructor",
};

const queryClient = new QueryClient();

// Generate a simple ID for users
const generateUserId = (email: string): string => {
  return `user_${email.replace(/[^a-z0-9]/gi, '_').substring(0, 20)}_${Date.now().toString(36)}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

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

    // Check for demo instructor credentials first
    if (
      normalizedEmail === DEMO_INSTRUCTOR_CREDENTIALS.email.toLowerCase() &&
      normalizedPassword === DEMO_INSTRUCTOR_CREDENTIALS.password
    ) {
      const userData: AuthUser = {
        id: "instructor_demo_001",
        username: DEMO_INSTRUCTOR_CREDENTIALS.fullName,
        email: DEMO_INSTRUCTOR_CREDENTIALS.email,
        isAdmin: false,
        role: "INSTRUCTOR",
      };
      setIsAuthenticated(true);
      setUser(userData);
      safeLocalStorage.setItem("triple-auth", { user: userData });
      return true;
    }

    // Check for demo student credentials (email case-insensitive, ignore whitespace)
    if (
      normalizedEmail === DEMO_STUDENT_CREDENTIALS.email.toLowerCase() &&
      normalizedPassword === DEMO_STUDENT_CREDENTIALS.password
    ) {
      const userData: AuthUser = {
        id: "student_demo_001",
        username: DEMO_STUDENT_CREDENTIALS.fullName,
        email: DEMO_STUDENT_CREDENTIALS.email,
        isAdmin: false,
        role: "STUDENT",
      };
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
      const userData: AuthUser = {
        id: foundUser.id || generateUserId(normalizedEmail),
        username: String(foundUser.fullName || ""),
        email: normalizedEmail,
        isAdmin: false,
        role: (foundUser.role as UserRole) || "STUDENT",
      };
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
      const userData: AuthUser = {
        id: "admin_001",
        username,
        isAdmin: true,
        role: "ADMIN",
      };
      setIsAuthenticated(true);
      setUser(userData);
      safeLocalStorage.setItem("triple-auth", { user: userData });
      return true;
    }

    return false;
  };

  const registerUser = (userData: Record<string, unknown>) => {
    const registeredUsers = safeLocalStorage.getItem("registeredUsers", []);
    const email = String(userData.email || "").trim().toLowerCase();
    const userId = generateUserId(email);
    const newUser = {
      ...userData,
      id: userId,
      role: "STUDENT",
      registeredAt: new Date().toISOString(),
    };
    registeredUsers.push(newUser);
    safeLocalStorage.setItem("registeredUsers", registeredUsers);

    // Auto-login the user
    const userAuthData: AuthUser = {
      id: userId,
      username: String((userData as any).fullName ?? ""),
      email,
      isAdmin: false,
      role: "STUDENT",
    };
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
