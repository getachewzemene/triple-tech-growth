"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPaperPlane,
  FaSmile,
  FaPaperclip,
  FaSearch,
  FaEllipsisV,
  FaUser,
  FaUsers,
  FaCircle,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Participant {
  id: string;
  name: string;
  avatarUrl: string | null;
  isOnline?: boolean;
  isInstructor?: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: Participant;
  attachments?: { type: string; url: string; name: string }[] | null;
  isEdited: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  type: "DIRECT" | "GROUP" | "COURSE";
  name: string | null;
  avatarUrl: string | null;
  participants: Participant[];
  memberCount?: number;
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount: number;
}

interface ChatWindowProps {
  currentUserId: string;
  currentUserName: string;
  conversations?: Conversation[];
  initialConversationId?: string;
  className?: string;
  onSendMessage?: (conversationId: string, content: string) => void;
}

export function ChatWindow({
  currentUserId,
  currentUserName,
  conversations = [],
  initialConversationId,
  className = "",
  onSendMessage,
}: ChatWindowProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample conversations for demo
  const sampleConversations: Conversation[] = conversations.length > 0 ? conversations : [
    {
      id: "conv_1",
      type: "DIRECT",
      name: null,
      avatarUrl: null,
      participants: [
        { id: "user_1", name: "Abebe Kebede", avatarUrl: null, isOnline: true },
        { id: currentUserId, name: currentUserName, avatarUrl: null, isOnline: true },
      ],
      lastMessage: {
        content: "Thanks for the help with the assignment!",
        senderId: "user_1",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      unreadCount: 2,
    },
    {
      id: "conv_2",
      type: "GROUP",
      name: "Web Development Study Group",
      avatarUrl: null,
      participants: [
        { id: "user_1", name: "Abebe Kebede", avatarUrl: null },
        { id: "user_2", name: "Sara Tesfaye", avatarUrl: null },
        { id: "user_3", name: "Dawit Mulugeta", avatarUrl: null },
        { id: currentUserId, name: currentUserName, avatarUrl: null },
      ],
      lastMessage: {
        content: "Anyone want to do a group study session tomorrow?",
        senderId: "user_2",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      unreadCount: 5,
    },
    {
      id: "conv_3",
      type: "COURSE",
      name: "Video Editing Course Chat",
      avatarUrl: null,
      participants: [
        { id: "instructor_1", name: "Dr. Instructor", avatarUrl: null, isInstructor: true },
      ],
      memberCount: 45,
      lastMessage: {
        content: "New lesson uploaded! Check it out.",
        senderId: "instructor_1",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      unreadCount: 1,
    },
  ];

  // Sample messages for demo
  const sampleMessages: Message[] = [
    {
      id: "msg_1",
      content: "Hey everyone! Welcome to the study group.",
      sender: { id: "user_1", name: "Abebe Kebede", avatarUrl: null },
      attachments: null,
      isEdited: false,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "msg_2",
      content: "Thanks for creating this! I think it will be really helpful.",
      sender: { id: "user_2", name: "Sara Tesfaye", avatarUrl: null },
      attachments: null,
      isEdited: false,
      createdAt: new Date(Date.now() - 86400000 * 1.9).toISOString(),
    },
    {
      id: "msg_3",
      content: "Has anyone started on the first project yet?",
      sender: { id: "user_3", name: "Dawit Mulugeta", avatarUrl: null },
      attachments: null,
      isEdited: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "msg_4",
      content: "Yes! I just finished the setup. It was easier than I thought.",
      sender: { id: "user_1", name: "Abebe Kebede", avatarUrl: null },
      attachments: null,
      isEdited: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "msg_5",
      content: "That's great! Can you share any tips?",
      sender: { id: currentUserId, name: currentUserName, avatarUrl: null },
      attachments: null,
      isEdited: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  useEffect(() => {
    if (initialConversationId) {
      const conv = sampleConversations.find((c) => c.id === initialConversationId);
      if (conv) setSelectedConversation(conv);
    }
  }, [initialConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sampleMessages]);

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedConversation) {
      onSendMessage?.(selectedConversation.id, messageInput);
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getConversationName = (conv: Conversation) => {
    if (conv.name) return conv.name;
    if (conv.type === "DIRECT") {
      const other = conv.participants.find((p) => p.id !== currentUserId);
      return other?.name || "Unknown";
    }
    return "Conversation";
  };

  const getConversationAvatar = (conv: Conversation) => {
    if (conv.type === "DIRECT") {
      const other = conv.participants.find((p) => p.id !== currentUserId);
      return other?.name.charAt(0).toUpperCase() || "?";
    }
    return conv.name?.charAt(0).toUpperCase() || "G";
  };

  const filteredConversations = sampleConversations.filter((conv) => {
    const name = getConversationName(conv);
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={`flex h-[600px] md:h-[70vh] max-h-[800px] bg-white dark:bg-slate-900 rounded-xl overflow-hidden border ${className}`}>
      {/* Conversation List */}
      <div
        className={`w-full md:w-80 border-r flex flex-col ${
          selectedConversation && isMobileConversationOpen ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                setSelectedConversation(conv);
                setIsMobileConversationOpen(true);
              }}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${
                selectedConversation?.id === conv.id
                  ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback
                    className={`text-white ${
                      conv.type === "GROUP"
                        ? "bg-gradient-to-br from-green-500 to-emerald-600"
                        : conv.type === "COURSE"
                        ? "bg-gradient-to-br from-purple-500 to-pink-600"
                        : "bg-gradient-to-br from-blue-500 to-cyan-600"
                    }`}
                  >
                    {conv.type === "GROUP" || conv.type === "COURSE" ? (
                      <FaUsers />
                    ) : (
                      getConversationAvatar(conv)
                    )}
                  </AvatarFallback>
                </Avatar>
                {conv.type === "DIRECT" && (
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      conv.participants.find((p) => p.id !== currentUserId)?.isOnline
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{getConversationName(conv)}</span>
                  {conv.lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {formatTime(conv.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                {conv.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage.content}
                  </p>
                )}
              </div>
              {conv.unreadCount > 0 && (
                <Badge className="bg-blue-500 text-white">{conv.unreadCount}</Badge>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          !selectedConversation || !isMobileConversationOpen ? "hidden md:flex" : "flex"
        }`}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileConversationOpen(false)}
              >
                <FaArrowLeft />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarFallback
                  className={`text-white ${
                    selectedConversation.type === "GROUP"
                      ? "bg-gradient-to-br from-green-500 to-emerald-600"
                      : selectedConversation.type === "COURSE"
                      ? "bg-gradient-to-br from-purple-500 to-pink-600"
                      : "bg-gradient-to-br from-blue-500 to-cyan-600"
                  }`}
                >
                  {selectedConversation.type === "GROUP" || selectedConversation.type === "COURSE" ? (
                    <FaUsers />
                  ) : (
                    getConversationAvatar(selectedConversation)
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{getConversationName(selectedConversation)}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedConversation.type === "GROUP" || selectedConversation.type === "COURSE"
                    ? `${selectedConversation.memberCount || selectedConversation.participants.length} members`
                    : selectedConversation.participants.find((p) => p.id !== currentUserId)?.isOnline
                    ? "Online"
                    : "Offline"}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <FaEllipsisV />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Leave Conversation</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {sampleMessages.map((message) => {
                  const isOwn = message.sender.id === currentUserId;
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-2 max-w-[70%] ${isOwn ? "flex-row-reverse" : ""}`}>
                        {!isOwn && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                              {message.sender.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          {!isOwn && (
                            <span className="text-xs text-muted-foreground mb-1 block">
                              {message.sender.name}
                            </span>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              isOwn
                                ? "bg-blue-500 text-white rounded-tr-sm"
                                : "bg-gray-100 dark:bg-slate-800 rounded-tl-sm"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 block">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <FaPaperclip className="text-gray-500" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button variant="ghost" size="sm">
                  <FaSmile className="text-gray-500" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <FaPaperPlane />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">Select a Conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
