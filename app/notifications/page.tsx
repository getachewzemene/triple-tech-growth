"use client";

import React from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/app/providers/AuthModalProvider";
import StudentHeader from "@/components/StudentHeader";
import Footer from "@/components/Footer";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaBell, FaLock } from "react-icons/fa";

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  const handleNotificationClick = (notification: { link?: string }) => {
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          notificationIds: [notificationId],
        }),
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          markAllAsRead: true,
        }),
      });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
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
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to view your notifications.
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
        <NotificationCenter
          userId={user.id}
          onNotificationClick={handleNotificationClick}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      </div>
      <Footer />
    </div>
  );
}
