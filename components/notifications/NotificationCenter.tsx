"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaBell,
  FaCog,
  FaEnvelope,
  FaComment,
  FaBullhorn,
  FaCertificate,
  FaUserPlus,
  FaBook,
  FaCheckDouble,
  FaFilter,
  FaTrash,
  FaStar,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NotificationType = 
  | "enrollment"
  | "message"
  | "discussion"
  | "announcement"
  | "certificate"
  | "review"
  | "course_update";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  link?: string;
  isRead: boolean;
  isPinned?: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

interface NotificationPreferences {
  email: {
    enabled: boolean;
    enrollments: boolean;
    messages: boolean;
    discussions: boolean;
    announcements: boolean;
    certificates: boolean;
    reviews: boolean;
    courseUpdates: boolean;
  };
  push: {
    enabled: boolean;
    enrollments: boolean;
    messages: boolean;
    discussions: boolean;
    announcements: boolean;
    certificates: boolean;
    reviews: boolean;
    courseUpdates: boolean;
  };
  inApp: {
    enabled: boolean;
  };
}

interface NotificationCenterProps {
  userId: string;
  notifications?: Notification[];
  preferences?: NotificationPreferences;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (notificationId: string) => void;
  onDeleteAll?: () => void;
  onTogglePin?: (notificationId: string) => void;
  onUpdatePreferences?: (preferences: NotificationPreferences) => void;
  onNotificationClick?: (notification: Notification) => void;
}

const notificationTypeConfig: Record<
  NotificationType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  enrollment: {
    icon: <FaUserPlus />,
    color: "text-green-500",
    label: "Enrollment",
  },
  message: {
    icon: <FaEnvelope />,
    color: "text-blue-500",
    label: "Message",
  },
  discussion: {
    icon: <FaComment />,
    color: "text-purple-500",
    label: "Discussion",
  },
  announcement: {
    icon: <FaBullhorn />,
    color: "text-orange-500",
    label: "Announcement",
  },
  certificate: {
    icon: <FaCertificate />,
    color: "text-yellow-500",
    label: "Certificate",
  },
  review: {
    icon: <FaStar />,
    color: "text-amber-500",
    label: "Review",
  },
  course_update: {
    icon: <FaBook />,
    color: "text-cyan-500",
    label: "Course Update",
  },
};

export function NotificationCenter({
  userId,
  notifications = [],
  preferences,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onDeleteAll,
  onTogglePin,
  onUpdatePreferences,
  onNotificationClick,
}: NotificationCenterProps) {
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | NotificationType>("all");
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  // Sample notifications for demo
  const sampleNotifications: Notification[] = notifications.length > 0 ? notifications : [
    {
      id: "notif_1",
      type: "enrollment",
      title: "Enrollment Approved!",
      content: "Your enrollment in 'Video Editing Masterclass' has been approved. You can now access the course.",
      link: "/course/course_1",
      isRead: false,
      isPinned: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "notif_2",
      type: "message",
      title: "New Message",
      content: "Abebe Kebede sent you a message in 'Web Development Study Group'",
      link: "/messages?conv=conv_2",
      isRead: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "notif_3",
      type: "discussion",
      title: "New Reply to Your Discussion",
      content: "Dr. Instructor replied to your discussion 'How to get started with the course?'",
      link: "/course/course_1/discussions/disc_1",
      isRead: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "notif_4",
      type: "announcement",
      title: "Course Announcement",
      content: "New lesson uploaded in 'Digital Marketing Essentials' - Chapter 5: Social Media Strategy",
      link: "/course/course_2",
      isRead: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "notif_5",
      type: "certificate",
      title: "Certificate Earned!",
      content: "Congratulations! You've earned a certificate for completing 'Graphic Design Fundamentals'",
      link: "/certificates/cert_1",
      isRead: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "notif_6",
      type: "review",
      title: "New Course Review",
      content: "Sara Tesfaye left a 5-star review on your course 'Web Development Masterclass'",
      link: "/instructor/courses/course_1/reviews",
      isRead: true,
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: "notif_7",
      type: "course_update",
      title: "Course Updated",
      content: "'React & Next.js Complete Guide' has been updated with new content",
      link: "/course/course_3",
      isRead: true,
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ];

  // Default preferences
  const defaultPreferences: NotificationPreferences = preferences || {
    email: {
      enabled: true,
      enrollments: true,
      messages: false,
      discussions: true,
      announcements: true,
      certificates: true,
      reviews: true,
      courseUpdates: true,
    },
    push: {
      enabled: true,
      enrollments: true,
      messages: true,
      discussions: true,
      announcements: true,
      certificates: true,
      reviews: true,
      courseUpdates: false,
    },
    inApp: {
      enabled: true,
    },
  };

  const [localPreferences, setLocalPreferences] = useState(defaultPreferences);

  // Filter notifications
  let filteredNotifications = sampleNotifications;
  if (filterType !== "all") {
    filteredNotifications = filteredNotifications.filter((n) => n.type === filterType);
  }
  if (activeTab === "unread") {
    filteredNotifications = filteredNotifications.filter((n) => !n.isRead);
  }

  // Sort: pinned first, then by date
  filteredNotifications = [...filteredNotifications].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const unreadCount = sampleNotifications.filter((n) => !n.isRead).length;

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

  const handlePreferenceChange = (
    channel: "email" | "push",
    key: keyof Omit<NotificationPreferences["email"], "enabled">,
    value: boolean
  ) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [key]: value,
      },
    }));
  };

  const handleSavePreferences = () => {
    onUpdatePreferences?.(localPreferences);
    setIsPreferencesOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaBell className="text-blue-600" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
            )}
          </h2>
          <p className="text-muted-foreground">
            Stay updated with your courses and messages
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FaCog className="mr-2" />
                Preferences
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Notification Preferences</DialogTitle>
                <DialogDescription>
                  Choose how you want to receive notifications
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Email Notifications */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Email Notifications</CardTitle>
                        <CardDescription className="text-xs">
                          Receive notifications via email
                        </CardDescription>
                      </div>
                      <Switch
                        checked={localPreferences.email.enabled}
                        onCheckedChange={(checked) =>
                          setLocalPreferences((prev) => ({
                            ...prev,
                            email: { ...prev.email, enabled: checked },
                          }))
                        }
                      />
                    </div>
                  </CardHeader>
                  {localPreferences.email.enabled && (
                    <CardContent className="space-y-3 pt-0">
                      {(
                        [
                          ["enrollments", "Enrollments"],
                          ["messages", "Messages"],
                          ["discussions", "Discussions"],
                          ["announcements", "Announcements"],
                          ["certificates", "Certificates"],
                          ["reviews", "Reviews"],
                          ["courseUpdates", "Course Updates"],
                        ] as const
                      ).map(([key, label]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <Label className="text-sm">{label}</Label>
                          <Switch
                            checked={localPreferences.email[key]}
                            onCheckedChange={(checked) =>
                              handlePreferenceChange("email", key, checked)
                            }
                          />
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>

                {/* Push Notifications */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Push Notifications</CardTitle>
                        <CardDescription className="text-xs">
                          Receive browser push notifications
                        </CardDescription>
                      </div>
                      <Switch
                        checked={localPreferences.push.enabled}
                        onCheckedChange={(checked) =>
                          setLocalPreferences((prev) => ({
                            ...prev,
                            push: { ...prev.push, enabled: checked },
                          }))
                        }
                      />
                    </div>
                  </CardHeader>
                  {localPreferences.push.enabled && (
                    <CardContent className="space-y-3 pt-0">
                      {(
                        [
                          ["enrollments", "Enrollments"],
                          ["messages", "Messages"],
                          ["discussions", "Discussions"],
                          ["announcements", "Announcements"],
                          ["certificates", "Certificates"],
                          ["reviews", "Reviews"],
                          ["courseUpdates", "Course Updates"],
                        ] as const
                      ).map(([key, label]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <Label className="text-sm">{label}</Label>
                          <Switch
                            checked={localPreferences.push[key]}
                            onCheckedChange={(checked) =>
                              handlePreferenceChange("push", key, checked)
                            }
                          />
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPreferencesOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSavePreferences}>Save Preferences</Button>
              </div>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FaCheckDouble className="mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onMarkAllAsRead}>
                <FaCheckDouble className="mr-2" />
                Mark all as read
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={onDeleteAll}
              >
                <FaTrash className="mr-2" />
                Delete all
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "all" | "unread")}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={filterType}
          onValueChange={(val) =>
            setFilterType(val as "all" | NotificationType)
          }
        >
          <SelectTrigger className="w-[180px]">
            <FaFilter className="mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(notificationTypeConfig).map(([type, config]) => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center gap-2">
                  <span className={config.color}>{config.icon}</span>
                  {config.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-[600px]">
        {filteredNotifications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FaBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
              <p className="text-muted-foreground">
                {activeTab === "unread"
                  ? "You're all caught up!"
                  : "You don't have any notifications yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification, index) => {
              const config = notificationTypeConfig[notification.type];

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      !notification.isRead
                        ? "bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500"
                        : ""
                    } ${notification.isPinned ? "ring-2 ring-yellow-400" : ""}`}
                    onClick={() => {
                      onMarkAsRead?.(notification.id);
                      onNotificationClick?.(notification);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg bg-gray-100 dark:bg-slate-800 ${config.color}`}
                        >
                          {config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`font-semibold ${
                                !notification.isRead
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {notification.title}
                            </span>
                            {notification.isPinned && (
                              <Badge variant="secondary" className="text-xs">
                                Pinned
                              </Badge>
                            )}
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.content}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(notification.createdAt)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {config.label}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaCog />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notification.isRead && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkAsRead?.(notification.id);
                                }}
                              >
                                <FaCheckDouble className="mr-2" />
                                Mark as read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onTogglePin?.(notification.id);
                              }}
                            >
                              {notification.isPinned ? "Unpin" : "Pin"} notification
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(notification.id);
                              }}
                            >
                              <FaTrash className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default NotificationCenter;
