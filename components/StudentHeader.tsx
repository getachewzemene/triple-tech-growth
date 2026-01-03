"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, LogOut, Edit, Home, Settings } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StudentHeader = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-light-blue/95 backdrop-blur-md shadow-2xl border-b border-white/10">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        <div
          className="flex items-center space-x-3 text-2xl font-bold transition-all duration-500 transform hover:scale-105 text-white cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Triple Technologies Logo"
              width={40}
              height={40}
              className="transition-all duration-300 hover:rotate-12"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow/20 to-white/20 rounded-full blur-md opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
            Triple Technologies
          </span>
        </div>

        {/* Profile Dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/10 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 px-3 py-2 rounded-full"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-yellow to-yellow/70 rounded-full flex items-center justify-center text-light-blue font-bold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{user.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg z-[100]"
            >
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Student Account</p>
              </div>
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 py-2"
              >
                <Edit className="w-4 h-4 text-blue-600" />
                <span>Edit Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/student")}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 py-2"
              >
                <Settings className="w-4 h-4 text-gray-600" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/")}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 py-2"
              >
                <Home className="w-4 h-4 text-green-600" />
                <span>Main Page</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-700" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 py-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default StudentHeader;
