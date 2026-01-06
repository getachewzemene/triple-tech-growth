"use client";

import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaUser,
  FaUsers,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
}

interface NewConversationDialogProps {
  currentUserId: string;
  onCreateConversation: (
    type: "DIRECT" | "GROUP",
    participantIds: string[],
    name?: string,
    initialMessage?: string
  ) => void;
  suggestedUsers?: User[];
}

export function NewConversationDialog({
  currentUserId,
  onCreateConversation,
  suggestedUsers = [],
}: NewConversationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Sample users for demo (in production, would search from API)
  const sampleUsers: User[] = suggestedUsers.length > 0 ? suggestedUsers : [
    { id: "user_1", name: "Abebe Kebede", role: "Student" },
    { id: "user_2", name: "Sara Tesfaye", role: "Student" },
    { id: "user_3", name: "Dawit Mulugeta", role: "Student" },
    { id: "instructor_1", name: "Dr. Instructor", role: "Instructor" },
    { id: "instructor_2", name: "Prof. Smith", role: "Instructor" },
  ];

  const filteredUsers = sampleUsers.filter(
    (u) =>
      u.id !== currentUserId &&
      !selectedUsers.find((s) => s.id === u.id) &&
      u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (user: User) => {
    setSelectedUsers((prev) => [...prev, user]);
    setSearchQuery("");
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return;

    setIsCreating(true);
    try {
      const type = selectedUsers.length === 1 ? "DIRECT" : "GROUP";
      const participantIds = [currentUserId, ...selectedUsers.map((u) => u.id)];
      
      await onCreateConversation(
        type,
        participantIds,
        type === "GROUP" ? groupName : undefined,
        initialMessage
      );

      // Reset form and close dialog
      setSelectedUsers([]);
      setGroupName("");
      setInitialMessage("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const isGroup = selectedUsers.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FaPlus className="mr-2" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Start a Conversation</DialogTitle>
          <DialogDescription>
            Send a direct message or create a group chat
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <Badge
                  key={user.id}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  {user.name}
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    className="ml-1 rounded-full p-0.5 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Search Users */}
          <div>
            <Label>Search Users</Label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* User List */}
          {searchQuery && (
            <div className="max-h-48 overflow-y-auto border rounded-lg">
              {filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No users found
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b last:border-b-0"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{user.name}</div>
                      {user.role && (
                        <div className="text-xs text-muted-foreground">
                          {user.role}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Suggested Users (when not searching) */}
          {!searchQuery && selectedUsers.length === 0 && (
            <div>
              <Label className="text-sm text-muted-foreground">
                Suggested Users
              </Label>
              <div className="mt-2 space-y-1">
                {sampleUsers
                  .filter((u) => u.id !== currentUserId)
                  .slice(0, 3)
                  .map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{user.name}</div>
                      </div>
                      {user.role === "Instructor" && (
                        <Badge variant="outline" className="text-xs">
                          Instructor
                        </Badge>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Group Name (if multiple users selected) */}
          {isGroup && (
            <div>
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}

          {/* Initial Message */}
          {selectedUsers.length > 0 && (
            <div>
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Write your first message..."
                rows={3}
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateConversation}
            disabled={
              selectedUsers.length === 0 ||
              (isGroup && !groupName) ||
              isCreating
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <FaPaperPlane className="mr-2" />
                {isGroup ? "Create Group" : "Start Chat"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NewConversationDialog;
