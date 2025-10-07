"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaVideo,
  FaRobot,
  FaMobileAlt,
  FaChartLine,
  FaCode,
  FaPaintBrush,
  FaClock,
  FaUser,
  FaDollarSign,
  FaStar,
  FaPlay,
  FaCheckCircle,
} from "react-icons/fa";
import Header from "@/components/Header";
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
import { useAuth } from "@/app/providers/AuthProvider";
import { useAuthModal } from "@/app/providers/AuthModalProvider";
import { useRouter } from "next/navigation";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";

// Featured bonus courses as specified in the requirements
const featuredCourses = [
  {
    id: 6,
    title: "AI Automation",
    description: "Get started with artificial intelligence.",
    icon: <FaRobot size={24} />,
    detailedDescription:
      "Explore the world of artificial intelligence and automation. Learn machine learning basics, Python programming, AI tools integration, and how to automate business processes.",
    duration: "8 weeks",
    level: "Beginner to Intermediate",
    price: "$499",
    benefits: [
      "Python programming for AI",
      "Machine learning fundamentals",
      "AI tool integration skills",
      "Business automation projects",
      "Future-ready career skills",
    ],
    instructor: "Dr. James Wilson - AI Research Scientist",
    prerequisites: "Basic math and logic skills",
    featured: true,
  },
  {
    id: 7,
    title: "CapCut Video Editing with Mobile",
    description: "Master mobile video editing with CapCut.",
    icon: <FaMobileAlt size={24} />,
    detailedDescription:
      "Learn professional mobile video editing using CapCut. Create stunning videos directly on your phone with advanced editing techniques, effects, and transitions specifically designed for mobile content creation.",
    duration: "6 weeks",
    level: "Beginner to Intermediate",
    price: "$199",
    benefits: [
      "Mobile-first video editing mastery",
      "CapCut advanced features and effects",
      "Social media content optimization",
      "Transitions and animations",
      "Mobile video monetization strategies",
    ],
    instructor: "Lisa Chang - Mobile Content Creator",
    prerequisites: "Smartphone and CapCut app",
    featured: true,
  },
  {
    id: 1,
    title: "Video Editing",
    description: "Master video editing techniques.",
    icon: <FaVideo size={24} />,
    detailedDescription:
      "Learn professional video editing with industry-standard tools like Adobe Premiere Pro, DaVinci Resolve, and Final Cut Pro. Master cutting, transitions, color correction, audio mixing, and visual effects.",
    duration: "8 weeks",
    level: "Beginner to Advanced",
    price: "$299",
    benefits: [
      "Hands-on experience with professional editing software",
      "Portfolio development with real projects",
      "Certificate of completion",
      "Job placement assistance",
      "Lifetime access to course materials",
    ],
    instructor: "Sarah Johnson - 10+ years industry experience",
    prerequisites: "Basic computer skills",
    featured: true,
  },
];

// All available courses
const allCourses = [
  ...featuredCourses,
  {
    id: 2,
    title: "Digital Marketing",
    description: "Learn SEO and social media marketing.",
    icon: <FaChartLine size={24} />,
    detailedDescription:
      "Comprehensive digital marketing course covering SEO, SEM, social media marketing, content marketing, email marketing, and analytics. Learn to create effective campaigns that drive results.",
    duration: "10 weeks",
    level: "Beginner to Intermediate",
    price: "$399",
    benefits: [
      "Google Ads & Analytics certification preparation",
      "Real campaign management experience",
      "Social media strategy development",
      "ROI measurement and optimization",
      "Industry networking opportunities",
    ],
    instructor: "Mike Chen - Digital Marketing Expert",
    prerequisites: "None",
  },
  {
    id: 3,
    title: "Web Development",
    description: "Build modern websites with React.",
    icon: <FaCode size={24} />,
    detailedDescription:
      "Full-stack web development course covering HTML, CSS, JavaScript, React, Node.js, and database management. Build responsive, interactive web applications from scratch.",
    duration: "12 weeks",
    level: "Beginner to Advanced",
    price: "$599",
    benefits: [
      "Build 5+ portfolio projects",
      "Learn latest web technologies",
      "Responsive design mastery",
      "Deployment and hosting skills",
      "Career transition support",
    ],
    instructor: "Alex Thompson - Senior Full-Stack Developer",
    prerequisites: "Basic computer literacy",
  },
  {
    id: 5,
    title: "Graphic Design",
    description: "Create stunning visuals with design tools.",
    icon: <FaPaintBrush size={24} />,
    detailedDescription:
      "Master graphic design principles and tools including Adobe Creative Suite (Photoshop, Illustrator, InDesign), typography, color theory, and brand identity design.",
    duration: "6 weeks",
    level: "Beginner to Intermediate",
    price: "$349",
    benefits: [
      "Adobe Creative Suite mastery",
      "Professional portfolio creation",
      "Brand identity design skills",
      "Print and digital design expertise",
      "Freelancing guidance",
    ],
    instructor: "David Kim - Creative Director",
    prerequisites: "Design interest and creativity",
  },
];

export default function CoursesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Load enrolled courses from localStorage
    const courses = safeLocalStorage.getItem("enrolledCourses", []);
    setEnrolledCourses(courses);
  }, []);

  const { openAuthModal } = useAuthModal();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-96">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Please Log In</h2>
              <p className="text-muted-foreground mb-4">
                You need to be logged in to access the course module.
              </p>
              <Button onClick={() => openAuthModal("login")}>
                Sign In / Sign Up
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const checkEnrollmentStatus = (courseId: number): any | undefined => {
    return enrolledCourses.find((course: any) => course.courseId === courseId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="text-green-600" />;
      case "payment_submitted":
        return <FaClock className="text-yellow-600" />;
      case "pending_payment":
        return <FaClock className="text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Enrolled";
      case "payment_submitted":
        return "Payment Under Review";
      case "pending_payment":
        return "Payment Required";
      default:
        return "Not Enrolled";
    }
  };

  const handleEnrollment = (course: any) => {
    // Redirect to training page for enrollment
    router.push("/training");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Course Module</h1>
            <p className="text-muted-foreground">
              Explore available courses and manage your enrolled courses
            </p>
          </div>

          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
              <div className="space-y-8">
                {/* Featured Bonus Courses */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-blue-600">
                      Bonus Courses
                    </h2>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Featured
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4 xs:gap-4 sm:gap-6">
                    {featuredCourses.map((course, index) => {
                      const enrollmentStatus = checkEnrollmentStatus(course.id);
                      return (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="relative"
                        >
                          <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4 border-l-yellow-500">
                            {course.featured && (
                              <div className="absolute -top-2 -right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                BONUS
                              </div>
                            )}
                            <CardHeader>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="text-yellow-600">
                                  {course.icon}
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-lg">
                                    {course.title}
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    {course.description}
                                  </CardDescription>
                                </div>
                                {enrollmentStatus &&
                                  getStatusIcon(enrollmentStatus.status)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <FaClock className="w-4 h-4" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FaDollarSign className="w-4 h-4" />
                                  <span>{course.price}</span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {course.detailedDescription}
                                </p>
                                <div className="flex items-center gap-2 text-sm">
                                  <FaUser className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">
                                    {course.instructor}
                                  </span>
                                </div>
                                {enrollmentStatus ? (
                                  <div className="space-y-2">
                                    <Badge
                                      variant={
                                        enrollmentStatus.status === "approved"
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {getStatusText(enrollmentStatus.status)}
                                    </Badge>
                                    {enrollmentStatus.status === "approved" && (
                                      <Button
                                        size="sm"
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() =>
                                          router.push(`/course/${course.id}`)
                                        }
                                      >
                                        <FaPlay className="w-4 h-4 mr-2" />
                                        Access Course
                                      </Button>
                                    )}
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    onClick={() => handleEnrollment(course)}
                                  >
                                    Enroll Now
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* All Available Courses */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">All Courses</h2>
                  <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4 xs:gap-4 sm:gap-6">
                    {allCourses.map((course, index) => {
                      const enrollmentStatus = checkEnrollmentStatus(course.id);
                      return (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: (index + featuredCourses.length) * 0.1,
                          }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="text-blue-600">
                                  {course.icon}
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-lg">
                                    {course.title}
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    {course.description}
                                  </CardDescription>
                                </div>
                                {enrollmentStatus &&
                                  getStatusIcon(enrollmentStatus.status)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <FaClock className="w-4 h-4" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FaDollarSign className="w-4 h-4" />
                                  <span>{course.price}</span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {course.detailedDescription}
                                </p>
                                <div className="flex items-center gap-2 text-sm">
                                  <FaUser className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">
                                    {course.instructor}
                                  </span>
                                </div>
                                {enrollmentStatus ? (
                                  <div className="space-y-2">
                                    <Badge
                                      variant={
                                        enrollmentStatus.status === "approved"
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {getStatusText(enrollmentStatus.status)}
                                    </Badge>
                                    {enrollmentStatus.status === "approved" && (
                                      <Button
                                        size="sm"
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() =>
                                          router.push(`/course/${course.id}`)
                                        }
                                      >
                                        <FaPlay className="w-4 h-4 mr-2" />
                                        Access Course
                                      </Button>
                                    )}
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    onClick={() => handleEnrollment(course)}
                                  >
                                    Enroll Now
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="enrolled">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">
                    My Enrolled Courses
                  </h2>
                  <Button
                    onClick={() => router.push("/training")}
                    variant="outline"
                  >
                    Browse More Courses
                  </Button>
                </div>

                {enrolledCourses.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-lg font-semibold mb-2">
                        Not enrolled yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Enroll in the Courses tab
                      </p>
                      <Button
                        onClick={() => {
                          // Switch to courses tab
                          const coursesTab = document.querySelector(
                            '[value="courses"]',
                          ) as HTMLElement;
                          if (coursesTab) coursesTab.click();
                        }}
                      >
                        View Courses
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4 xs:gap-4 sm:gap-6">
                    {enrolledCourses.map((course: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                {course.courseTitle}
                              </CardTitle>
                              {getStatusIcon(course.status)}
                            </div>
                            <CardDescription>
                              Enrolled on{" "}
                              {new Date(course.enrolledAt).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Badge
                              variant={
                                course.status === "approved"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {getStatusText(course.status)}
                            </Badge>

                            <div className="text-sm space-y-1">
                              <div>
                                <strong>Name:</strong> {course.fullName}
                              </div>
                              <div>
                                <strong>Email:</strong> {course.email}
                              </div>
                            </div>

                            {course.status === "pending_payment" && (
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={() => router.push("/training")}
                              >
                                Complete Payment
                              </Button>
                            )}

                            {course.status === "approved" && (
                              <Button
                                size="sm"
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() =>
                                  router.push(`/course/${course.courseId}`)
                                }
                              >
                                <FaPlay className="w-4 h-4 mr-2" />
                                Access Course
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
