"use client";

import React, { createContext, useContext, useState } from "react";
import UserAuthModal from "@/components/UserAuthModal";

interface AuthModalContextValue {
  openAuthModal: (defaultTab?: "login" | "signup") => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | undefined>(
  undefined,
);

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"login" | "signup">("login");

  const openAuthModal = (tab: "login" | "signup" = "login") => {
    setDefaultTab(tab);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
      <UserAuthModal
        isOpen={isOpen}
        onClose={() => {
          closeAuthModal();
        }}
      />
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
};
