"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaEdit,
  FaGraduationCap,
  FaBook,
  FaChartLine,
  FaPlay,
  FaTrophy,
  FaHistory,
  FaFire,
  FaStar,
  FaMedal,
  FaCrown,
  FaRocket,
  FaBolt,
  FaAward,
  FaUsers,
} from "react-icons/fa";
import StudentHeader from "@/components/StudentHeader";
import Footer from "@/components/Footer";
import UpdateProfileModal from "@/components/UpdateProfileModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useAuthModal } from "@/app/providers/AuthModalProvider";

// Gamification data
const badges = [
  { id: 1, name: "First Steps", icon: "🚀", description: "Complete your first lesson", earned: true, points: 50 },
  { id: 2, name: "Quick Learner", icon: "⚡", description: "Complete 5 lessons in a day", earned: false, points: 100 },
  { id: 3, name: "Consistent", icon: "🔥", description: "7-day learning streak", earned: false, points: 150 },
  { id: 4, name: "Explorer", icon: "🗺️", description: "Enroll in 3 different courses", earned: false, points: 75 },
  { id: 5, name: "Scholar", icon: "🎓", description: "Complete your first course", earned: false, points: 500 },
  { id: 6, name: "Master", icon: "👑", description: "Complete 5 courses", earned: false, points: 1000 },
];

// Constants for gamification
const DEFAULT_STREAK = 3; // Default streak for demo purposes
const USER_BASE_RANK = 25; // Base rank for user (would be calculated from actual data)

// Streak calculation - in production, this would be based on actual login/activity data
const calculateStreak = (): number => {
  // For demo purposes, return a consistent value
  // In production: calculate from user's lastLoginDates array
  return DEFAULT_STREAK;
};

// Calculate user rank deterministically based on their points
const calculateUserRank = (points: number): number => {
  // Simple formula: higher points = lower (better) rank
  return Math.max(1, USER_BASE_RANK - Math.floor(points / 100));
};

export default function StudentDashboardPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  const loadEnrolledCourses = () => {
    const courses = safeLocalStorage.getItem("enrolledCourses", []);
    setEnrolledCourses(courses);
  };

  useEffect(() => {
    loadEnrolledCourses();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <StudentHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-96">
            <CardContent className="p-6 text-center">
              <FaGraduationCap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">Student Dashboard</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to access your student dashboard and view your enrolled courses.
              </p>
              <Button onClick={() => (openAuthModal ? openAuthModal("login") : router.push("/admin/login"))}>
                Sign In / Sign Up
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "payment_submitted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "pending_payment":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="text-green-600" />;
      case "payment_submitted":
      case "pending":
        return <FaHourglassHalf className="text-yellow-600" />;
      case "pending_payment":
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Active";
      case "payment_submitted":
      case "pending":
        return "Pending Approval";
      case "pending_payment":
        return "Payment Required";
      default:
        return "Unknown";
    }
  };

  // Separate courses by status
  const activeCourses = enrolledCourses.filter((c) => c.status === "approved");
  const pendingCourses = enrolledCourses.filter(
    (c) => c.status === "payment_submitted" || c.status === "pending" || c.status === "pending_payment"
  );

  // Get user profile info from first enrollment or default
  const userProfile = enrolledCourses.length > 0
    ? {
        email: enrolledCourses[0].email || "",
        phone: enrolledCourses[0].phone || "",
        address: enrolledCourses[0].address || "",
        fullName: enrolledCourses[0].fullName || user.username,
      }
    : {
        email: "",
        phone: "",
        address: "",
        fullName: user.username,
      };

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Skool-Style Header with Gamification */}
          <div className="mb-8">
            {/* User Profile Card - Skool Style */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-white/30">
                    <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                      {userProfile.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                      {userProfile.fullName}
                      <Badge className="bg-yellow-400 text-yellow-900 ml-2">
                        <FaCrown className="mr-1" /> Level {Math.floor(activeCourses.length * 2.5) + 1}
                      </Badge>
                    </h1>
                    <p className="text-white/80 flex items-center gap-2 mt-1">
                      <FaGraduationCap /> Student at Triple Technologies Academy
                    </p>
                    {/* Streak indicator */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 bg-orange-500/30 px-3 py-1 rounded-full">
                        <FaFire className="text-orange-300" />
                        <span className="text-sm font-medium">{calculateStreak()}-day streak</span>
                      </div>
                      <div className="flex items-center gap-1 bg-blue-500/30 px-3 py-1 rounded-full">
                        <FaStar className="text-yellow-300" />
                        <span className="text-sm font-medium">{activeCourses.length * 250 + 150} points</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsUpdateModalOpen(true)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <FaEdit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    onClick={() => router.push("/training")}
                    className="bg-white text-blue-600 hover:bg-white/90"
                  >
                    <FaRocket className="w-4 h-4 mr-2" />
                    Explore Courses
                  </Button>
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <Card className="mb-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Level {Math.floor(activeCourses.length * 2.5) + 1} Progress
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {250 - ((activeCourses.length * 250 + 150) % 250)} XP to next level
                  </span>
                </div>
                <Progress value={((activeCourses.length * 250 + 150) % 250) / 2.5} className="h-3" />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Current: {activeCourses.length * 250 + 150} XP</span>
                  <span>Next Level: {(Math.floor((activeCourses.length * 250 + 150) / 250) + 1) * 250} XP</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Cards - Enhanced Skool Style */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <FaBook className="w-8 h-8 mb-2 opacity-80" />
                    <p className="text-3xl font-bold">{enrolledCourses.length}</p>
                    <p className="text-sm opacity-80">Total Courses</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <FaCheckCircle className="w-8 h-8 mb-2 opacity-80" />
                    <p className="text-3xl font-bold">{activeCourses.length}</p>
                    <p className="text-sm opacity-80">Active</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <FaHourglassHalf className="w-8 h-8 mb-2 opacity-80" />
                    <p className="text-3xl font-bold">{pendingCourses.length}</p>
                    <p className="text-sm opacity-80">Pending</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <FaTrophy className="w-8 h-8 mb-2 opacity-80" />
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm opacity-80">Completed</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg col-span-2 sm:col-span-1">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <FaFire className="w-8 h-8 mb-2 opacity-80" />
                    <p className="text-3xl font-bold">{calculateStreak()}</p>
                    <p className="text-sm opacity-80">Day Streak</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Badges Section - Skool Gamification */}
          <Card className="mb-8 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaAward className="text-amber-500" />
                Your Achievements
              </CardTitle>
              <CardDescription>Unlock badges by completing challenges and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-4 rounded-xl text-center transition-all cursor-pointer hover:scale-105 ${
                      badge.earned 
                        ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className={`text-xs font-medium ${badge.earned ? 'text-white' : ''}`}>{badge.name}</div>
                    <div className={`text-xs mt-1 ${badge.earned ? 'text-white/80' : 'text-gray-400'}`}>+{badge.points} XP</div>
                    {!badge.earned && (
                      <div className="absolute inset-0 rounded-xl bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center">
                        <span className="text-2xl">🔒</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-white dark:bg-slate-800 p-1 rounded-xl shadow-md">
              <TabsTrigger value="active" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <FaPlay className="w-3 h-3" />
                <span className="hidden sm:inline">Active</span>
                {activeCourses.length > 0 && (
                  <Badge variant="secondary" className="ml-1 data-[state=active]:bg-white/20">{activeCourses.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <FaHourglassHalf className="w-3 h-3" />
                <span className="hidden sm:inline">Pending</span>
                {pendingCourses.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{pendingCourses.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <FaTrophy className="w-3 h-3" />
                <span className="hidden sm:inline">Rewards</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <FaUser className="w-3 h-3" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>

            {/* Active Courses Tab */}
            <TabsContent value="active">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Active Courses</h2>
                    <p className="text-muted-foreground">Courses you have access to</p>
                  </div>
                </div>

                {activeCourses.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FaGraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Active Courses</h3>
                      <p className="text-muted-foreground mb-4">
                        You don't have any active courses yet. Complete enrollment to access course content.
                      </p>
                      <Button onClick={() => router.push("/training")}>
                        Browse Courses
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCourses.map((course, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{course.courseTitle}</CardTitle>
                              <Badge className={getStatusColor(course.status)}>
                                {getStatusText(course.status)}
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-2">
                              <FaCalendar className="w-3 h-3" />
                              Enrolled on {new Date(course.enrolledAt).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Progress Section */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">0%</span>
                              </div>
                              <Progress value={0} className="h-2" />
                            </div>

                            <div className="text-sm space-y-2 border-t pt-3">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <FaUser className="w-3 h-3" />
                                <span>{course.fullName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <FaEnvelope className="w-3 h-3" />
                                <span className="truncate">{course.email}</span>
                              </div>
                            </div>

                            <Button
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={() => router.push(`/course/${course.courseId}`)}
                            >
                              <FaPlay className="w-4 h-4 mr-2" />
                              Continue Learning
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Pending Enrollments Tab */}
            <TabsContent value="pending">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Pending Enrollments</h2>
                    <p className="text-muted-foreground">Courses awaiting approval or payment</p>
                  </div>
                </div>

                {pendingCourses.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                      <p className="text-muted-foreground mb-4">
                        You don't have any pending enrollments. All your courses are active!
                      </p>
                      <Button variant="outline" onClick={() => router.push("/training")}>
                        Explore More Courses
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingCourses.map((course, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full border-l-4 border-l-yellow-500">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{course.courseTitle}</CardTitle>
                              {getStatusIcon(course.status)}
                            </div>
                            <CardDescription className="flex items-center gap-2">
                              <FaCalendar className="w-3 h-3" />
                              Applied on {new Date(course.enrolledAt).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Badge className={getStatusColor(course.status)}>
                              {getStatusText(course.status)}
                            </Badge>

                            <div className="text-sm space-y-2 border-t pt-3">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <FaUser className="w-3 h-3" />
                                <span>{course.fullName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <FaEnvelope className="w-3 h-3" />
                                <span className="truncate">{course.email}</span>
                              </div>
                            </div>

                            {course.status === "pending_payment" ? (
                              <Button
                                className="w-full"
                                onClick={() => router.push("/training")}
                              >
                                Complete Payment
                              </Button>
                            ) : (
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                  <FaHourglassHalf className="inline w-4 h-4 mr-2" />
                                  Your enrollment is being reviewed. You'll be notified once approved.
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Achievements/Rewards Tab - Skool Style */}
            <TabsContent value="achievements">
              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Your Reward Summary</h2>
                        <p className="text-white/80">Keep learning to unlock more rewards and climb the leaderboard!</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-center bg-white/20 rounded-xl p-4">
                          <div className="text-3xl font-bold">{activeCourses.length * 250 + 150}</div>
                          <div className="text-sm opacity-80">Total XP</div>
                        </div>
                        <div className="text-center bg-white/20 rounded-xl p-4">
                          <div className="text-3xl font-bold">{badges.filter(b => b.earned).length}</div>
                          <div className="text-sm opacity-80">Badges</div>
                        </div>
                        <div className="text-center bg-white/20 rounded-xl p-4">
                          <div className="text-3xl font-bold">#{calculateUserRank(activeCourses.length * 250 + 150)}</div>
                          <div className="text-sm opacity-80">Rank</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* All Badges Grid */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaAward className="text-amber-500" />
                      All Badges
                    </CardTitle>
                    <CardDescription>Complete challenges to unlock these badges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {badges.map((badge, index) => (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className={`relative p-6 rounded-2xl text-center transition-all cursor-pointer hover:scale-105 ${
                            badge.earned 
                              ? 'bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-2 border-amber-300' 
                              : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="text-4xl mb-3">{badge.icon}</div>
                          <div className={`font-semibold text-sm ${badge.earned ? 'text-amber-800 dark:text-amber-200' : 'text-gray-500'}`}>{badge.name}</div>
                          <div className={`text-xs mt-1 ${badge.earned ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}`}>{badge.description}</div>
                          <div className={`text-xs mt-2 font-bold ${badge.earned ? 'text-green-600' : 'text-gray-400'}`}>+{badge.points} XP</div>
                          {badge.earned && (
                            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                              <FaCheckCircle className="text-white text-sm" />
                            </div>
                          )}
                          {!badge.earned && (
                            <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-gray-200/30 dark:bg-gray-700/30">
                              <span className="text-3xl opacity-50">🔒</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Leaderboard Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaTrophy className="text-yellow-500" />
                      Top Learners This Month
                    </CardTitle>
                    <CardDescription>See where you stand in the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { rank: 1, name: "Abebe K.", points: 2450, badge: "🥇" },
                        { rank: 2, name: "Sara T.", points: 2180, badge: "🥈" },
                        { rank: 3, name: "Dawit M.", points: 1950, badge: "🥉" },
                      ].map((learner) => (
                        <div key={learner.rank} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{learner.badge}</span>
                            <div>
                              <div className="font-medium">{learner.name}</div>
                              <div className="text-sm text-gray-500">{learner.points.toLocaleString()} XP</div>
                            </div>
                          </div>
                          <Badge variant="outline">#{learner.rank}</Badge>
                        </div>
                      ))}
                      {user && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-500 text-white text-sm">
                                {userProfile.fullName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-blue-700 dark:text-blue-300">You</div>
                              <div className="text-sm text-blue-600 dark:text-blue-400">{activeCourses.length * 250 + 150} XP</div>
                            </div>
                          </div>
                          <Badge className="bg-blue-500">#{calculateUserRank(activeCourses.length * 250 + 150)}</Badge>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" className="w-full mt-4" onClick={() => router.push("/training")}>
                      <FaTrophy className="mr-2" /> View Full Leaderboard
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FaUser className="text-blue-600" />
                        Personal Information
                      </CardTitle>
                      <Button
                        onClick={() => setIsUpdateModalOpen(true)}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <FaEdit className="w-3 h-3" />
                        Edit
                      </Button>
                    </div>
                    <CardDescription>Your account and contact details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {userProfile.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{userProfile.fullName}</h3>
                        <p className="text-sm text-muted-foreground">Student</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <FaUser className="text-muted-foreground w-4 h-4" />
                        <div>
                          <p className="text-xs text-muted-foreground">Username</p>
                          <p className="font-medium">{user.username}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <FaEnvelope className="text-muted-foreground w-4 h-4" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium">{userProfile.email || "Not provided"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <FaPhone className="text-muted-foreground w-4 h-4" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium">{userProfile.phone || "Not provided"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <FaMapMarkerAlt className="text-muted-foreground w-4 h-4" />
                        <div>
                          <p className="text-xs text-muted-foreground">Address</p>
                          <p className="font-medium">{userProfile.address || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaChartLine className="text-green-600" />
                      Learning Statistics
                    </CardTitle>
                    <CardDescription>Your progress overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">{enrolledCourses.length}</div>
                        <div className="text-sm text-muted-foreground">Total Courses</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">{activeCourses.length}</div>
                        <div className="text-sm text-muted-foreground">Active</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-yellow-600">{pendingCourses.length}</div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600">0</div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">Quick Actions</h4>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => router.push("/training")}
                        >
                          <FaBook className="w-4 h-4 mr-2" />
                          Browse Available Courses
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaHistory className="text-gray-600" />
                    Enrollment History
                  </CardTitle>
                  <CardDescription>Complete history of all your course enrollments</CardDescription>
                </CardHeader>
                <CardContent>
                  {enrolledCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <FaHistory className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No History Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Your enrollment history will appear here once you enroll in courses.
                      </p>
                      <Button onClick={() => router.push("/training")}>
                        Start Learning
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {enrolledCourses.map((course, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <FaBook className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{course.courseTitle}</h4>
                              <p className="text-sm text-muted-foreground">
                                Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(course.status)}>
                              {getStatusText(course.status)}
                            </Badge>
                            {course.status === "approved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/course/${course.courseId}`)}
                              >
                                <FaPlay className="w-3 h-3 mr-1" />
                                Open
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      <Footer />

      {/* Update Profile Modal */}
      <UpdateProfileModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onProfileUpdated={loadEnrolledCourses}
      />
    </div>
  );
}
