"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBell,
  FaEnvelope,
  FaComment,
  FaBullhorn,
  FaCertificate,
  FaUserPlus,
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: string;
  type: "enrollment" | "message" | "discussion" | "announcement" | "certificate";
  title: string;
  content: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationBellProps {
  userId: string;
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationBell({ userId, onNotificationClick }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sample notifications for demo
  const sampleNotifications: Notification[] = [
    {
      id: "notif_1",
      type: "enrollment",
      title: "Enrollment Approved!",
      content: "Your enrollment in 'Video Editing Masterclass' has been approved.",
      link: "/course/course_1",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "notif_2",
      type: "message",
      title: "New Message",
      content: "Abebe Kebede sent you a message",
      link: "/messages?conv=conv_1",
      isRead: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "notif_3",
      type: "discussion",
      title: "New Reply",
      content: "Dr. Instructor replied to your discussion",
      link: "/course/course_1/discussions/disc_1",
      isRead: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "notif_4",
      type: "announcement",
      title: "Course Announcement",
      content: "New lesson uploaded in 'Digital Marketing'",
      link: "/course/course_2",
      isRead: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "notif_5",
      type: "certificate",
      title: "Certificate Earned!",
      content: "You've earned a certificate for completing 'Graphic Design'",
      link: "/certificates/cert_1",
      isRead: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ];

  useEffect(() => {
    // In production, fetch notifications from API
    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter((n) => !n.isRead).length);
  }, [userId]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <FaUserPlus className="text-green-500" />;
      case "message":
        return <FaEnvelope className="text-blue-500" />;
      case "discussion":
        return <FaComment className="text-purple-500" />;
      case "announcement":
        return <FaBullhorn className="text-orange-500" />;
      case "certificate":
        return <FaCertificate className="text-yellow-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => (notification.isRead ? prev : Math.max(0, prev - 1)));
    
    onNotificationClick?.(notification);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <FaBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-600 hover:text-blue-700"
              onClick={handleMarkAllAsRead}
            >
              <FaCheckDouble className="mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <FaBell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${
                      !notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-medium truncate ${
                              !notification.isRead ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t">
          <Button variant="ghost" className="w-full text-sm" asChild>
            <a href="/notifications">View All Notifications</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationBell;
