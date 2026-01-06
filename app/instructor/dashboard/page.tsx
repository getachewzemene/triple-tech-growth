"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaBook,
  FaUsers,
  FaDollarSign,
  FaStar,
  FaPlus,
  FaEdit,
  FaEye,
  FaChartLine,
  FaComments,
  FaCog,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InstructorApplicationForm from "@/components/instructor/InstructorApplicationForm";

// Sample instructor data
const instructorData = {
  profile: {
    name: "Dr. Instructor",
    email: "instructor@example.com",
    bio: "Experienced software developer and educator with 10+ years in the industry.",
    expertise: ["Web Development", "Mobile Apps", "Machine Learning"],
    totalStudents: 1250,
    totalCourses: 8,
    totalEarnings: 125000, // In ETB
    averageRating: 4.8,
  },
  courses: [
    {
      id: "course_1",
      title: "Web Development Masterclass",
      students: 450,
      revenue: 50000,
      rating: 4.9,
      status: "published",
      lessonsCount: 45,
      progress: 100,
    },
    {
      id: "course_2",
      title: "React & Next.js Complete Guide",
      students: 380,
      revenue: 42000,
      rating: 4.8,
      status: "published",
      lessonsCount: 38,
      progress: 100,
    },
    {
      id: "course_3",
      title: "Node.js Backend Development",
      students: 0,
      revenue: 0,
      rating: 0,
      status: "draft",
      lessonsCount: 12,
      progress: 60,
    },
  ],
  recentActivity: [
    { type: "enrollment", message: "New student enrolled in Web Development Masterclass", time: "2 hours ago" },
    { type: "review", message: "5-star review from Sara T. on React & Next.js Guide", time: "5 hours ago" },
    { type: "question", message: "New question in Web Development discussion", time: "1 day ago" },
    { type: "payment", message: "Payment of 5,000 ETB processed", time: "2 days ago" },
  ],
};

export default function InstructorDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isInstructor, setIsInstructor] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<"NONE" | "PENDING" | "APPROVED" | "REJECTED">("NONE");

  useEffect(() => {
    // In production, check if user is an approved instructor
    // For demo, we'll show application form for non-instructors
    if (user?.role === "INSTRUCTOR" || user?.role === "ADMIN") {
      setIsInstructor(true);
      setApplicationStatus("APPROVED");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <FaChalkboardTeacher className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">Instructor Dashboard</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to access your instructor dashboard.
            </p>
            <Button onClick={() => router.push("/")}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not an instructor, show application form
  if (!isInstructor || applicationStatus !== "APPROVED") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Button variant="ghost" onClick={() => router.push("/student")}>
                <FaHome className="mr-2" /> Back to Student Dashboard
              </Button>
            </div>
            <InstructorApplicationForm
              userId={user.id}
              userName={user.username}
              userEmail={user.email}
              applicationStatus={applicationStatus}
              onSubmit={() => setApplicationStatus("PENDING")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Instructor Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-white/30">
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {instructorData.profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{instructorData.profile.name}</h1>
                <p className="text-white/80">Instructor Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/student")}
                className="text-white hover:bg-white/10"
              >
                <FaHome className="mr-2" /> Student View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-white hover:bg-white/10"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FaBook className="w-8 h-8 opacity-80" />
                  <div>
                    <p className="text-3xl font-bold">{instructorData.profile.totalCourses}</p>
                    <p className="text-sm opacity-80">Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FaUsers className="w-8 h-8 opacity-80" />
                  <div>
                    <p className="text-3xl font-bold">{instructorData.profile.totalStudents.toLocaleString()}</p>
                    <p className="text-sm opacity-80">Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FaDollarSign className="w-8 h-8 opacity-80" />
                  <div>
                    <p className="text-3xl font-bold">{instructorData.profile.totalEarnings.toLocaleString()}</p>
                    <p className="text-sm opacity-80">ETB Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FaStar className="w-8 h-8 opacity-80" />
                  <div>
                    <p className="text-3xl font-bold">{instructorData.profile.averageRating}</p>
                    <p className="text-sm opacity-80">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-800 p-1 rounded-xl shadow-md">
            <TabsTrigger value="courses" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg">
              <FaBook className="mr-2" /> My Courses
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg">
              <FaChartLine className="mr-2" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg">
              <FaUsers className="mr-2" /> Students
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg">
              <FaCog className="mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">My Courses</h2>
                <p className="text-muted-foreground">Create and manage your courses</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FaPlus className="mr-2" /> Create New Course
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructorData.courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <Badge
                          variant={course.status === "published" ? "default" : "secondary"}
                          className={course.status === "published" ? "bg-green-500" : ""}
                        >
                          {course.status}
                        </Badge>
                      </div>
                      <CardDescription>{course.lessonsCount} lessons</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {course.status === "draft" && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Course Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-2">
                          <p className="text-lg font-bold">{course.students}</p>
                          <p className="text-xs text-muted-foreground">Students</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-2">
                          <p className="text-lg font-bold">{course.rating || "-"}</p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-2">
                          <p className="text-lg font-bold">{(course.revenue / 1000).toFixed(0)}k</p>
                          <p className="text-xs text-muted-foreground">ETB</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <FaEdit className="mr-1" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <FaEye className="mr-1" /> Preview
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <FaComments className="mr-1" /> Q&A
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Create Course Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="h-full flex items-center justify-center border-dashed border-2 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer">
                  <CardContent className="text-center py-12">
                    <FaPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Create New Course</h3>
                    <p className="text-sm text-muted-foreground">
                      Share your knowledge with students
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Course Analytics</CardTitle>
                <CardDescription>Track your course performance</CardDescription>
              </CardHeader>
              <CardContent className="py-12 text-center">
                <FaChartLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed analytics and insights about your courses will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>View and manage your enrolled students</CardDescription>
              </CardHeader>
              <CardContent className="py-12 text-center">
                <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Student Management Coming Soon</h3>
                <p className="text-muted-foreground">
                  View student progress, send announcements, and manage enrollments.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Instructor Settings</CardTitle>
                <CardDescription>Manage your instructor profile and preferences</CardDescription>
              </CardHeader>
              <CardContent className="py-12 text-center">
                <FaCog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Settings Coming Soon</h3>
                <p className="text-muted-foreground">
                  Update your profile, payout settings, and notification preferences.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instructorData.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === "enrollment"
                        ? "bg-green-100 text-green-600"
                        : activity.type === "review"
                        ? "bg-yellow-100 text-yellow-600"
                        : activity.type === "question"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {activity.type === "enrollment" && <FaUsers />}
                    {activity.type === "review" && <FaStar />}
                    {activity.type === "question" && <FaComments />}
                    {activity.type === "payment" && <FaDollarSign />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
