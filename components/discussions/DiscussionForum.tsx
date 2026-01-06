"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaComment,
  FaThumbsUp,
  FaReply,
  FaPin,
  FaLock,
  FaCheckCircle,
  FaPlus,
  FaSearch,
  FaFilter,
  FaUser,
  FaClock,
  FaEye,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Author {
  id: string;
  name: string;
  avatarUrl: string | null;
  isInstructor?: boolean;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: Author;
  isPinned: boolean;
  isLocked: boolean;
  upvotes: number;
  viewCount: number;
  replyCount: number;
  createdAt: string;
}

interface DiscussionForumProps {
  courseId: string;
  courseName: string;
  discussions?: Discussion[];
  currentUserId?: string;
  isEnrolled?: boolean;
  isInstructor?: boolean;
  onCreateDiscussion?: (title: string, content: string) => void;
}

export function DiscussionForum({
  courseId,
  courseName,
  discussions = [],
  currentUserId,
  isEnrolled = true,
  isInstructor = false,
  onCreateDiscussion,
}: DiscussionForumProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
  const [newDiscussionContent, setNewDiscussionContent] = useState("");

  // Sample discussions for demo
  const sampleDiscussions: Discussion[] = discussions.length > 0 ? discussions : [
    {
      id: "disc_1",
      title: "How to get started with the course?",
      content: "I just enrolled in this course. What's the best way to approach the material?",
      author: {
        id: "user_1",
        name: "Abebe Kebede",
        avatarUrl: null,
      },
      isPinned: true,
      isLocked: false,
      upvotes: 12,
      viewCount: 45,
      replyCount: 5,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "disc_2",
      title: "Question about Assignment 3",
      content: "I'm having trouble understanding the requirements for the third assignment. Can someone help?",
      author: {
        id: "user_2",
        name: "Sara Tesfaye",
        avatarUrl: null,
      },
      isPinned: false,
      isLocked: false,
      upvotes: 8,
      viewCount: 32,
      replyCount: 3,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "disc_3",
      title: "Share your project progress!",
      content: "Let's use this thread to share our projects and get feedback from each other.",
      author: {
        id: "user_3",
        name: "Dawit Mulugeta",
        avatarUrl: null,
      },
      isPinned: false,
      isLocked: false,
      upvotes: 15,
      viewCount: 67,
      replyCount: 12,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ];

  const filteredDiscussions = sampleDiscussions.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort: pinned first, then by date
  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleCreateDiscussion = () => {
    if (newDiscussionTitle.trim() && newDiscussionContent.trim()) {
      onCreateDiscussion?.(newDiscussionTitle, newDiscussionContent);
      setNewDiscussionTitle("");
      setNewDiscussionContent("");
      setIsCreateDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!isEnrolled) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <FaLock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Discussions Locked</h3>
          <p className="text-muted-foreground">
            Enroll in this course to participate in discussions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Course Discussions</h2>
          <p className="text-muted-foreground">
            {sampleDiscussions.length} discussions in {courseName}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FaPlus className="mr-2" />
              New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Start a New Discussion</DialogTitle>
              <DialogDescription>
                Ask a question or start a conversation with your fellow learners.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="What's your question or topic?"
                  value={newDiscussionTitle}
                  onChange={(e) => setNewDiscussionTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Provide details about your question or topic..."
                  rows={5}
                  value={newDiscussionContent}
                  onChange={(e) => setNewDiscussionContent(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateDiscussion}
                disabled={!newDiscussionTitle.trim() || !newDiscussionContent.trim()}
              >
                Post Discussion
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search discussions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Discussion List */}
      {sortedDiscussions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FaComment className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Discussions Yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to start a discussion in this course!
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Start a Discussion
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedDiscussions.map((discussion, index) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  discussion.isPinned
                    ? "border-l-4 border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10"
                    : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={discussion.author.avatarUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {discussion.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {discussion.title}
                        </h3>
                        {discussion.isPinned && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                            <FaPin className="mr-1" /> Pinned
                          </Badge>
                        )}
                        {discussion.isLocked && (
                          <Badge variant="secondary" className="text-xs">
                            <FaLock className="mr-1" /> Locked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {discussion.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <FaUser />
                          {discussion.author.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {formatDate(discussion.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaEye />
                          {discussion.viewCount} views
                        </span>
                        <span className="flex items-center gap-1">
                          <FaComment />
                          {discussion.replyCount} replies
                        </span>
                        <span className="flex items-center gap-1">
                          <FaThumbsUp />
                          {discussion.upvotes}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiscussionForum;
