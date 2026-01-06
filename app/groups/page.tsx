"use client";

import React from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/app/providers/AuthModalProvider";
import StudentHeader from "@/components/StudentHeader";
import Footer from "@/components/Footer";
import GroupChatManager from "@/components/chat/GroupChatManager";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUsers, FaLock } from "react-icons/fa";

export default function GroupsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  const handleCreateGroup = async (
    name: string,
    description: string,
    memberIds: string[]
  ) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "GROUP",
          name,
          participantIds: [user?.id, ...memberIds],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create group");
      }

      // In production, refresh the groups list
      console.log("Group created successfully");
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  const handleSelectGroup = (group: { id: string }) => {
    router.push(`/messages?conv=${group.id}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <StudentHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-96">
            <CardContent className="p-6 text-center">
              <FaLock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">Study Groups</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to access study groups and chat with other students.
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
        <GroupChatManager
          currentUserId={user.id}
          onCreateGroup={handleCreateGroup}
          onSelectGroup={handleSelectGroup}
        />
      </div>
      <Footer />
    </div>
  );
}
