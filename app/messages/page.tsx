"use client";

import React from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/app/providers/AuthModalProvider";
import StudentHeader from "@/components/StudentHeader";
import Footer from "@/components/Footer";
import ChatWindow from "@/components/chat/ChatWindow";
import NewConversationDialog from "@/components/chat/NewConversationDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaComments, FaLock } from "react-icons/fa";

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  const handleCreateConversation = async (
    type: "DIRECT" | "GROUP",
    participantIds: string[],
    name?: string,
    initialMessage?: string
  ) => {
    try {
      // Create conversation via API
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          participantIds,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const result = await response.json();

      // If there's an initial message, send it
      if (initialMessage && result.data?.id) {
        await fetch(`/api/conversations/${result.data.id}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: user?.id,
            content: initialMessage,
          }),
        });
      }

      // In production, we would refresh the conversation list here
      console.log("Conversation created:", result.data);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleSendMessage = async (conversationId: string, content: string) => {
    try {
      await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user?.id,
          content,
        }),
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

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
              <Button onClick={() => openAuthModal?.("login")}>
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground">
              Chat with instructors, study groups, and fellow students
            </p>
          </div>
          <NewConversationDialog
            currentUserId={user.id}
            onCreateConversation={handleCreateConversation}
          />
        </div>
        
        <ChatWindow
          currentUserId={user.id}
          currentUserName={user.username || "User"}
          onSendMessage={handleSendMessage}
        />
      </div>
      <Footer />
    </div>
  );
}
