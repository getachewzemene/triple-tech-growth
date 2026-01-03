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
} from "react-icons/fa";
import Header from "@/components/Header";
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
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useAuthModal } from "@/app/providers/AuthModalProvider";

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
        <Header />
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
      <Header />
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <FaGraduationCap className="text-blue-600" />
                Student Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, <span className="font-semibold text-foreground">{userProfile.fullName}</span>! Track your learning progress and manage your courses.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsUpdateModalOpen(true)}
                className="flex items-center gap-2"
              >
                <FaEdit className="w-4 h-4" />
                Edit Profile
              </Button>
              <Button
                onClick={() => router.push("/training")}
                className="bg-[#e2a70f] hover:bg-[#d69e0b] text-white"
              >
                Browse Courses
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Enrolled</p>
                      <p className="text-2xl font-bold text-blue-600">{enrolledCourses.length}</p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <FaBook className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Courses</p>
                      <p className="text-2xl font-bold text-green-600">{activeCourses.length}</p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <FaCheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{pendingCourses.length}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                      <FaHourglassHalf className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-purple-600">0</p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                      <FaTrophy className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <FaPlay className="w-3 h-3" />
                <span className="hidden sm:inline">Active</span>
                {activeCourses.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{activeCourses.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <FaHourglassHalf className="w-3 h-3" />
                <span className="hidden sm:inline">Pending</span>
                {pendingCourses.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{pendingCourses.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <FaUser className="w-3 h-3" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <FaHistory className="w-3 h-3" />
                <span className="hidden sm:inline">History</span>
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
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => router.push("/profile")}
                        >
                          <FaUser className="w-4 h-4 mr-2" />
                          Go to Full Profile
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
