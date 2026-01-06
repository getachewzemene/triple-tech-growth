"use client";

import React from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/app/providers/AuthModalProvider";
import StudentHeader from "@/components/StudentHeader";
import Footer from "@/components/Footer";
import ChatWindow from "@/components/chat/ChatWindow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaComments, FaLock } from "react-icons/fa";

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <StudentHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-96">
            <CardContent className="p-6 text-center">
              <FaLock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">Messages</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to access your messages and chat with other students and instructors.
              </p>
              <Button onClick={() => (openAuthModal ? openAuthModal("login") : router.push("/admin/login"))}>
                Sign In / Sign Up
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <div className="container mx-auto px-4 py-20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Chat with instructors, study groups, and fellow students
          </p>
        </div>
        
        <ChatWindow
          currentUserId={user.id || "current_user"}
          currentUserName={user.username || "User"}
          onSendMessage={(conversationId, content) => {
            // In production, this would call the API to send the message
            console.log("Send message:", { conversationId, content });
          }}
        />
      </div>
      <Footer />
    </div>
  );
}
