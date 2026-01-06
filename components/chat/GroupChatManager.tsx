"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCrown,
  FaUserPlus,
  FaUserMinus,
  FaCog,
  FaImage,
  FaTimes,
  FaCheck,
  FaSignOutAlt,
  FaBell,
  FaBellSlash,
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GroupMember {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: "admin" | "member";
  isOnline?: boolean;
  joinedAt: string;
}

interface GroupChat {
  id: string;
  name: string;
  description?: string;
  avatarUrl: string | null;
  memberCount: number;
  members: GroupMember[];
  isAdmin: boolean;
  isMuted: boolean;
  createdAt: string;
}

interface GroupChatManagerProps {
  currentUserId: string;
  groups?: GroupChat[];
  availableUsers?: { id: string; name: string; avatarUrl: string | null }[];
  onCreateGroup?: (name: string, description: string, memberIds: string[]) => void;
  onUpdateGroup?: (groupId: string, name: string, description: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  onLeaveGroup?: (groupId: string) => void;
  onAddMember?: (groupId: string, userId: string) => void;
  onRemoveMember?: (groupId: string, userId: string) => void;
  onPromoteMember?: (groupId: string, userId: string) => void;
  onDemoteMember?: (groupId: string, userId: string) => void;
  onToggleMute?: (groupId: string) => void;
  onSelectGroup?: (group: GroupChat) => void;
}

export function GroupChatManager({
  currentUserId,
  groups = [],
  availableUsers = [],
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  onLeaveGroup,
  onAddMember,
  onRemoveMember,
  onPromoteMember,
  onDemoteMember,
  onToggleMute,
  onSelectGroup,
}: GroupChatManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [deleteConfirmGroup, setDeleteConfirmGroup] = useState<GroupChat | null>(null);
  const [leaveConfirmGroup, setLeaveConfirmGroup] = useState<GroupChat | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<GroupChat | null>(null);
  
  // Form states
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");

  // Sample groups for demo
  const sampleGroups: GroupChat[] = groups.length > 0 ? groups : [
    {
      id: "group_1",
      name: "Web Development Study Group",
      description: "A place to discuss web development topics and help each other learn.",
      avatarUrl: null,
      memberCount: 12,
      members: [
        { id: currentUserId, name: "You", avatarUrl: null, role: "admin", isOnline: true, joinedAt: new Date(Date.now() - 86400000 * 30).toISOString() },
        { id: "user_1", name: "Abebe Kebede", avatarUrl: null, role: "member", isOnline: true, joinedAt: new Date(Date.now() - 86400000 * 25).toISOString() },
        { id: "user_2", name: "Sara Tesfaye", avatarUrl: null, role: "member", isOnline: false, joinedAt: new Date(Date.now() - 86400000 * 20).toISOString() },
        { id: "user_3", name: "Dawit Mulugeta", avatarUrl: null, role: "admin", isOnline: true, joinedAt: new Date(Date.now() - 86400000 * 28).toISOString() },
      ],
      isAdmin: true,
      isMuted: false,
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      id: "group_2",
      name: "React Enthusiasts",
      description: "Everything React - tips, tricks, and best practices.",
      avatarUrl: null,
      memberCount: 25,
      members: [
        { id: "user_4", name: "Tigist Haile", avatarUrl: null, role: "admin", isOnline: true, joinedAt: new Date(Date.now() - 86400000 * 15).toISOString() },
        { id: currentUserId, name: "You", avatarUrl: null, role: "member", isOnline: true, joinedAt: new Date(Date.now() - 86400000 * 10).toISOString() },
      ],
      isAdmin: false,
      isMuted: true,
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    },
  ];

  // Sample available users for demo
  const sampleAvailableUsers = availableUsers.length > 0 ? availableUsers : [
    { id: "user_5", name: "Yohannes Tadesse", avatarUrl: null },
    { id: "user_6", name: "Meron Bekele", avatarUrl: null },
    { id: "user_7", name: "Bereket Hailu", avatarUrl: null },
    { id: "user_8", name: "Helen Girma", avatarUrl: null },
    { id: "user_9", name: "Samuel Tekle", avatarUrl: null },
  ];

  const filteredGroups = sampleGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableUsers = sampleAvailableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) &&
      !selectedGroup?.members.some((m) => m.id === user.id)
  );

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    onCreateGroup?.(newGroupName, newGroupDescription, selectedMembers);
    setNewGroupName("");
    setNewGroupDescription("");
    setSelectedMembers([]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateGroup = () => {
    if (!selectedGroup || !newGroupName.trim()) return;
    onUpdateGroup?.(selectedGroup.id, newGroupName, newGroupDescription);
    setIsEditDialogOpen(false);
  };

  const handleDeleteGroup = () => {
    if (!deleteConfirmGroup) return;
    onDeleteGroup?.(deleteConfirmGroup.id);
    setDeleteConfirmGroup(null);
  };

  const handleLeaveGroup = () => {
    if (!leaveConfirmGroup) return;
    onLeaveGroup?.(leaveConfirmGroup.id);
    setLeaveConfirmGroup(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const openEditDialog = (group: GroupChat) => {
    setSelectedGroup(group);
    setNewGroupName(group.name);
    setNewGroupDescription(group.description || "");
    setIsEditDialogOpen(true);
  };

  const openMembersDialog = (group: GroupChat) => {
    setSelectedGroup(group);
    setIsMembersDialogOpen(true);
  };

  const openAddMemberDialog = (group: GroupChat) => {
    setSelectedGroup(group);
    setMemberSearchQuery("");
    setIsAddMemberDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaUsers className="text-blue-600" />
            Group Chats
          </h2>
          <p className="text-muted-foreground">
            {sampleGroups.length} groups
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FaPlus className="mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Create a study group or community chat.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="groupName">Group Name *</Label>
                <Input
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., JavaScript Study Group"
                />
              </div>
              <div>
                <Label htmlFor="groupDescription">Description</Label>
                <Textarea
                  id="groupDescription"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="What's this group about?"
                  rows={3}
                />
              </div>
              <div>
                <Label>Add Members</Label>
                <div className="mt-2 space-y-2">
                  <Input
                    placeholder="Search users..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                  />
                  <ScrollArea className="h-32 border rounded-lg p-2">
                    {sampleAvailableUsers
                      .filter((u) =>
                        u.name.toLowerCase().includes(memberSearchQuery.toLowerCase())
                      )
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded cursor-pointer"
                          onClick={() => {
                            if (selectedMembers.includes(user.id)) {
                              setSelectedMembers(selectedMembers.filter((id) => id !== user.id));
                            } else {
                              setSelectedMembers([...selectedMembers, user.id]);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{user.name}</span>
                          </div>
                          {selectedMembers.includes(user.id) && (
                            <FaCheck className="text-green-500" />
                          )}
                        </div>
                      ))}
                  </ScrollArea>
                  {selectedMembers.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {selectedMembers.length} member(s) selected
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup} disabled={!newGroupName.trim()}>
                Create Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Groups List */}
      {filteredGroups.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FaUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Groups Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create or join a group to start chatting with others.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create Your First Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className="flex items-center gap-3 flex-1"
                      onClick={() => onSelectGroup?.(group)}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                          <FaUsers />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <CardTitle className="text-lg truncate flex items-center gap-2">
                          {group.name}
                          {group.isMuted && (
                            <FaBellSlash className="text-gray-400 text-sm" />
                          )}
                        </CardTitle>
                        <CardDescription className="truncate">
                          {group.memberCount} members
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <FaCog />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openMembersDialog(group)}>
                          <FaUsers className="mr-2" />
                          View Members
                        </DropdownMenuItem>
                        {group.isAdmin && (
                          <>
                            <DropdownMenuItem onClick={() => openAddMemberDialog(group)}>
                              <FaUserPlus className="mr-2" />
                              Add Members
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(group)}>
                              <FaEdit className="mr-2" />
                              Edit Group
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => onToggleMute?.(group.id)}>
                          {group.isMuted ? (
                            <>
                              <FaBell className="mr-2" />
                              Unmute
                            </>
                          ) : (
                            <>
                              <FaBellSlash className="mr-2" />
                              Mute
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {group.isAdmin ? (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteConfirmGroup(group)}
                          >
                            <FaTrash className="mr-2" />
                            Delete Group
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setLeaveConfirmGroup(group)}
                          >
                            <FaSignOutAlt className="mr-2" />
                            Leave Group
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent onClick={() => onSelectGroup?.(group)}>
                  {group.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {group.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 4).map((member) => (
                        <Avatar
                          key={member.id}
                          className="h-8 w-8 border-2 border-white dark:border-slate-900"
                        >
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {group.memberCount > 4 && (
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-medium">
                          +{group.memberCount - 4}
                        </div>
                      )}
                    </div>
                    {group.isAdmin && (
                      <Badge variant="secondary" className="text-xs">
                        <FaCrown className="mr-1 text-yellow-500" />
                        Admin
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Group Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>
              Update your group's name and description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="editGroupName">Group Name</Label>
              <Input
                id="editGroupName"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="editGroupDescription">Description</Label>
              <Textarea
                id="editGroupDescription"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateGroup}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Members Dialog */}
      <Dialog open={isMembersDialogOpen} onOpenChange={setIsMembersDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Group Members</DialogTitle>
            <DialogDescription>
              {selectedGroup?.memberCount} members in {selectedGroup?.name}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-80">
            <div className="space-y-2">
              {selectedGroup?.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {member.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{member.name}</span>
                        {member.role === "admin" && (
                          <Badge variant="secondary" className="text-xs">
                            <FaCrown className="mr-1 text-yellow-500" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Joined {formatDate(member.joinedAt)}
                      </span>
                    </div>
                  </div>
                  {selectedGroup?.isAdmin && member.id !== currentUserId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <FaCog />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {member.role === "member" ? (
                          <DropdownMenuItem
                            onClick={() => onPromoteMember?.(selectedGroup.id, member.id)}
                          >
                            <FaCrown className="mr-2 text-yellow-500" />
                            Make Admin
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => onDemoteMember?.(selectedGroup.id, member.id)}
                          >
                            <FaUserMinus className="mr-2" />
                            Remove Admin
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onRemoveMember?.(selectedGroup.id, member.id)}
                        >
                          <FaUserMinus className="mr-2" />
                          Remove from Group
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Members</DialogTitle>
            <DialogDescription>
              Invite people to join {selectedGroup?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Search users..."
              value={memberSearchQuery}
              onChange={(e) => setMemberSearchQuery(e.target.value)}
              className="mb-4"
            />
            <ScrollArea className="h-64">
              {filteredAvailableUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAvailableUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          onAddMember?.(selectedGroup!.id, user.id);
                        }}
                      >
                        <FaUserPlus className="mr-2" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirmGroup !== null}
        onOpenChange={(open) => !open && setDeleteConfirmGroup(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirmGroup?.name}"? This action cannot be undone and all messages will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Confirmation Dialog */}
      <AlertDialog
        open={leaveConfirmGroup !== null}
        onOpenChange={(open) => !open && setLeaveConfirmGroup(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave "{leaveConfirmGroup?.name}"? You will need to be invited again to rejoin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveGroup}
              className="bg-red-600 hover:bg-red-700"
            >
              Leave Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default GroupChatManager;
