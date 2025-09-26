"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaVideo,
  FaChartLine,
  FaCode,
  FaMobileAlt,
  FaPaintBrush,
  FaRobot,
  FaClock,
  FaUser,
  FaDollarSign,
  FaStar,
} from "react-icons/fa";
import Header from "@/components/Header";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";
import UserAuthModal from "@/components/UserAuthModal";

// Types
type Topic = {
  title: string;
  type: "video" | "pdf" | string;
  src: string;
};

type Course = {
  id: number | string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  detailedDescription?: string;
  duration?: string;
  level?: string;
  price?: string;
  benefits?: string[];
  instructor?: string;
  thumbnail?: string;
  isFolder?: boolean;
  instructorName?: string;
  instructorProfession?: string;
  instructorExperience?: string;
  instructorProfileImage?: string;
  priceCents?: number;
  topicsCount?: number;
  prerequisites?: string;
};

// Featured bonus courses as specified in the requirements
const featuredBonusCourses = [
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
    thumbnail: "/placeholder.svg",
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
    thumbnail: "/placeholder.svg",
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
    thumbnail: "/placeholder.svg",
  },
];

const courses = [
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
    thumbnail: "/placeholder.svg",
  },
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
    thumbnail: "/placeholder.svg",
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
    thumbnail: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Mobile App Development",
    description: "Create apps for iOS and Android.",
    icon: <FaMobileAlt size={24} />,
    detailedDescription:
      "Learn to develop native and cross-platform mobile applications using React Native, Flutter, or native development tools for iOS and Android platforms.",
    duration: "14 weeks",
    level: "Intermediate to Advanced",
    price: "$699",
    benefits: [
      "Publish apps to App Store and Google Play",
      "Cross-platform development skills",
      "UI/UX best practices for mobile",
      "App monetization strategies",
      "Technical interview preparation",
    ],
    instructor: "Emily Rodriguez - Mobile App Architect",
    prerequisites: "Basic programming knowledge",
    thumbnail: "/placeholder.svg",
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
    thumbnail: "/placeholder.svg",
  },
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
    thumbnail: "/placeholder.svg",
  },
];

const courseContents: Record<string, Topic[]> = {
  "Video Editing": [
    {
      title: "Basics of Video Cutting",
      type: "video",
      src: "https://www.youtube.com/embed/F1sKwFHM8q4",
    },
    { title: "Exporting Projects", type: "pdf", src: "/pdfs/exporting.pdf" },
  ],
  "Digital Marketing": [
    { title: "Introduction to SEO", type: "pdf", src: "/pdfs/seo-guide.pdf" },
    {
      title: "Social Media Strategies",
      type: "video",
      src: "https://www.youtube.com/embed/ysz5S6PUM-U",
    },
  ],
  "Web Development": [
    {
      title: "React Basics",
      type: "video",
      src: "https://www.youtube.com/embed/bMknfKXIFA8",
    },
    { title: "Responsive Layouts", type: "pdf", src: "/pdfs/responsive.pdf" },
  ],
  "Mobile App Development": [
    {
      title: "Getting Started with React Native",
      type: "video",
      src: "https://www.youtube.com/embed/0-S5a0eXPoc",
    },
    {
      title: "Building Your First App",
      type: "pdf",
      src: "/pdfs/first-app.pdf",
    },
  ],
  "Graphic Design": [
    {
      title: "Design Principles",
      type: "video",
      src: "https://www.youtube.com/embed/1a8d2b3c4e5",
    },
    {
      title: "Using Adobe Photoshop",
      type: "pdf",
      src: "/pdfs/photoshop-guide.pdf",
    },
  ],
  "AI Automation": [
    {
      title: "Introduction to AI",
      type: "video",
      src: "https://www.youtube.com/embed/2e8d3f4g5h6",
    },
    { title: "Building AI Models", type: "pdf", src: "/pdfs/ai-models.pdf" },
  ],
};

export default function TrainingPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [courseFolders, setCourseFolders] = useState<Course[]>([]);
  const [enrollmentData, setEnrollmentData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    address: "",
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const { user, registerUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Load course folders from admin system
    const loadCourseFolders = () => {
      const folders = safeLocalStorage.getItem("adminCourseFolders", []);
      setCourseFolders(folders);
    };

    loadCourseFolders();
    // Refresh every 5 seconds to show new folders
    const interval = setInterval(loadCourseFolders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEnrollment = (course: Course) => {
    // Check if user is already enrolled
    const enrolledCourses: any[] = JSON.parse(
      localStorage.getItem("enrolledCourses") || "[]",
    );
    const isEnrolled = enrolledCourses.some((enrolled: any) =>
      enrolled.courseId === course.id,
    );

    if (isEnrolled) {
      setShowPaymentModal(true);
    } else {
      setShowSignupModal(true);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse) return;

    // Register the user if not already authenticated
    if (!user) {
      const userData = {
        ...enrollmentData,
        password: "temp123", // In a real app, this would be generated or user-provided
      };
      registerUser(userData);
    }

    // Store enrollment data
    const enrolledCourses = safeLocalStorage.getItem("enrolledCourses", []);
    const newEnrollment = {
      courseId: selectedCourse.isFolder ? selectedCourse.id : selectedCourse.id,
      courseTitle: selectedCourse.title,
      ...enrollmentData,
      enrolledAt: new Date().toISOString(),
      status: "pending_payment",
      isFolder: selectedCourse.isFolder || false,
    };
    enrolledCourses.push(newEnrollment);
    safeLocalStorage.setItem("enrolledCourses", enrolledCourses);

    setShowSignupModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentUpload = async (e: any) => {
    e.preventDefault();
  if (!paymentProof || !selectedCourse) return;

    try {
      // Get presigned upload URL for the proof file
      const uploadUrlResponse = await fetch("/api/upload-proof-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        key: paymentProof.name,
          contentType: paymentProof.type,
          fileSize: paymentProof.size,
        }),
      });

      if (!uploadUrlResponse.ok) {
        const error = await uploadUrlResponse.json();
        throw new Error(error.error || "Failed to get upload URL");
      }

      const { uploadUrl, s3Key } = await uploadUrlResponse.json();

      // Upload file directly to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": paymentProof.type,
        },
        body: paymentProof,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload proof file");
      }

      // Submit payment proof to create enrollment
      const proofResponse = await fetch("/api/enrollments/submit-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: selectedCourse.isFolder
            ? selectedCourse.id
            : selectedCourse.id.toString(),
          s3Key: s3Key,
          comment: "Payment proof submitted from training page",
        }),
      });

      if (!proofResponse.ok) {
        const error = await proofResponse.json();
        throw new Error(error.error || "Failed to submit proof");
      }

      const result = await proofResponse.json();

      // Update local storage for demo purposes
      const enrolledCourses = safeLocalStorage.getItem("enrolledCourses", []);
      const updatedCourses = enrolledCourses.map((course: any) =>
        course.courseId ===
        (selectedCourse.isFolder ? selectedCourse.id : selectedCourse.id)
          ? {
              ...course,
              status: "pending",
              paymentProofId: result.paymentProofId,
            }
          : course,
      );
      safeLocalStorage.setItem("enrolledCourses", updatedCourses);

      setShowPaymentModal(false);
      setPaymentProof(null);

      alert(`Payment proof uploaded successfully! ${result.message}`);
    } catch (error: any) {
      console.error("Error uploading payment proof:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const checkEnrollmentStatus = (courseId: string | number) => {
    const enrolledCourses = safeLocalStorage.getItem("enrolledCourses", []);
    return enrolledCourses.find((course: any) => course.courseId === courseId);
  };

  const checkFolderEnrollmentStatus = (folderId: string | number) => {
    const enrolledCourses = safeLocalStorage.getItem("enrolledCourses", []);
    return enrolledCourses.find(
      (course: any) => course.courseId.toString() === folderId.toString(),
    );
  };

  const handleFolderEnrollment = (folder: any) => {
    const enrollmentStatus = checkFolderEnrollmentStatus(folder.id);

    if (enrollmentStatus?.status === "approved") {
      // User is approved, go to course page
      router.push(`/course/${folder.id}`);
    } else if (enrollmentStatus) {
      setShowPaymentModal(true);
    } else {
      // Set selected course to folder and open signup
      setSelectedCourse({
        id: folder.id,
        title: folder.title,
        description: folder.description,
        price: `$${(folder.priceCents / 100).toFixed(2)}`,
        instructor: folder.instructor,
        instructorName: folder.instructorName,
        instructorProfession: folder.instructorProfession,
        instructorExperience: folder.instructorExperience,
        instructorProfileImage: folder.instructorProfileImage,
        isFolder: true,
      });
      setShowSignupModal(true);
    }
  };

  const formatFolderPrice = (priceCents?: number) => {
    return `$${((priceCents ?? 0) / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
  <div className="px-4 pt-24 pb-16 sm:px-6 md:px-8 lg:px-16 xl:px-24">
        <motion.h2
          className="section-title text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {selectedCourse
            ? `${selectedCourse.title} Module`
            : "Training Modules"}
        </motion.h2>

        {!selectedCourse ? (
          <div className="space-y-12">
            {/* Course Folders Section */}
            {courseFolders.length > 0 && (
              <div>
                <motion.h3
                  className="text-2xl font-bold text-center mb-8 text-blue-600"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  Featured Course Collections
                </motion.h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-8">
                  {courseFolders.map((folder, index) => {
                    const enrollmentStatus = checkFolderEnrollmentStatus(
                      folder.id,
                    );
                    return (
                      <motion.div
                        key={folder.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative"
                      >
                        <Card className="h-full cursor-pointer transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 hover:shadow-2xl group relative overflow-hidden rounded-3xl bg-card backdrop-blur-sm border border-border shadow-green-500/25 border-l-4 border-l-green-500">
                          {/* Background gradient overlay for course folders */}
                          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-60 transition-all duration-500"></div>

                          {/* Enhanced hover background like root page */}
                          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 opacity-0 group-hover:opacity-90 transition-all duration-500"></div>

                          <CardHeader className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="text-green-600 group-hover:text-yellow transition-colors duration-300">
                                <FaVideo size={24} />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-xl group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                                  {folder.title}
                                </CardTitle>
                                <CardDescription className="mt-1 group-hover:text-black dark:group-hover:text-white group-hover:opacity-90 transition-all duration-300">
                                  {folder.description}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                              <FaClock className="w-4 h-4" />
                              <span>{folder.topicsCount || 0} topics</span>
                              <FaDollarSign className="w-4 h-4 ml-2" />
                              <span>
                                {formatFolderPrice(folder.priceCents)}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="relative z-10">
                            <div className="space-y-3">
                              <div>
                                <Badge variant="secondary" className="mb-2">
                                  Course Collection
                                </Badge>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                  Comprehensive course collection with multiple
                                  topics covering various aspects of{" "}
                                  {folder.title.toLowerCase()}.
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {enrollmentStatus?.status === "approved" ? (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      router.push(`/course/${folder.id}`)
                                    }
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                  >
                                    Access Course
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setSelectedCourse({
                                          id: folder.id,
                                          title: folder.title,
                                          description: folder.description,
                                          detailedDescription: `Comprehensive course collection with multiple topics covering various aspects of ${folder.title.toLowerCase()}. This structured program provides in-depth knowledge and practical skills through expert-curated content.`,
                                          price: `$${((folder.priceCents ?? 0) / 100).toFixed(2)}`,
                                          instructor: folder.instructor,
                                          instructorName: folder.instructorName,
                                          instructorProfession:
                                            folder.instructorProfession,
                                          instructorExperience:
                                            folder.instructorExperience,
                                          instructorProfileImage:
                                            folder.instructorProfileImage,
                                          duration: "8-12 weeks",
                                          level: "All Levels",
                                          benefits: [
                                            "Comprehensive curriculum designed by experts",
                                            "Hands-on projects and practical applications",
                                            "Progress tracking and milestone achievements",
                                            "Interactive learning materials and resources",
                                            "Certificate of completion upon finishing",
                                            "Lifetime access to course materials",
                                          ],
                                          prerequisites:
                                            "Basic computer skills recommended",
                                          isFolder: true,
                                        })
                                      }
                                      className="flex-1"
                                    >
                                      View Details
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleFolderEnrollment(folder)
                                      }
                                      className="flex-1 bg-[#e2a70f] hover:bg-[#d69e0b] text-white"
                                      disabled={
                                        enrollmentStatus?.status ===
                                        "payment_submitted"
                                      }
                                    >
                                      {enrollmentStatus?.status ===
                                      "payment_submitted"
                                        ? "Pending"
                                        : "Enroll Now"}
                                    </Button>
                                  </>
                                )}
                              </div>
                              {enrollmentStatus && (
                                <div className="text-xs text-center">
                                  <Badge
                                    variant={
                                      enrollmentStatus.status === "approved"
                                        ? "default"
                                        : enrollmentStatus.status ===
                                            "payment_submitted"
                                          ? "secondary"
                                          : "destructive"
                                    }
                                  >
                                    {enrollmentStatus.status === "approved"
                                      ? "Approved"
                                      : enrollmentStatus.status ===
                                          "payment_submitted"
                                        ? "Payment Under Review"
                                        : "Payment Required"}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Featured Bonus Courses Section */}
            <div>
              <motion.h3
                className="text-2xl font-bold text-center mb-8 text-yellow-600"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                Featured Bonus Courses
              </motion.h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-8">
                {featuredBonusCourses.map((course, index) => {
                  const enrollmentStatus = user
                    ? checkEnrollmentStatus(course.id)
                    : null;
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative"
                    >
                      <Card className="h-full cursor-pointer transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 hover:shadow-2xl group relative overflow-hidden rounded-3xl bg-card backdrop-blur-sm border border-border shadow-yellow-500/25">
                        {/* Background gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-0 group-hover:opacity-60 transition-all duration-500"></div>

                        {/* Enhanced hover background like root page */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-0 group-hover:opacity-90 transition-all duration-500"></div>

                        {course.featured && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                            BONUS
                          </div>
                        )}
                        <CardHeader className="relative z-10">
                          <div className="flex items-center gap-3 mb-3">
                            {course.thumbnail && (
                              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100 p-1">
                                <Image
                                  src={course.thumbnail}
                                  alt={course.title}
                                  fill
                                  className="object-cover rounded-xl"
                                  sizes="64px"
                                />
                              </div>
                            )}
                            <div className="relative">
                              <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                                <div className="text-white text-xl">
                                  {course.icon}
                                </div>
                              </div>
                              {/* Floating particles */}
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce"></div>
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl font-bold group-hover:text-black dark:group-hover:text-white transition-all duration-300">
                                {course.title}
                              </CardTitle>
                              <CardDescription className="mt-1 group-hover:text-black dark:group-hover:text-white group-hover:opacity-90 transition-all duration-300">
                                {course.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                            <FaClock className="w-4 h-4" />
                            <span>{course.duration}</span>
                            <FaDollarSign className="w-4 h-4 ml-2" />
                            <span>{course.price}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <div className="space-y-3">
                            <div>
                              <Badge
                                variant="secondary"
                                className="mb-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-300 transition-all duration-300 dark:group-hover:text-yellow-300"
                              >
                                {course.level}
                              </Badge>
                              <p className="text-sm text-gray-600 line-clamp-3 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                                {course.detailedDescription}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {user ? (
                                enrollmentStatus?.status === "approved" ? (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      router.push(`/course/${course.id}`)
                                    }
                                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                  >
                                    Access Course
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCourse(course);
                                      handleEnrollment(course);
                                    }}
                                    className="flex-1 bg-[#e2a70f] hover:bg-[#d69e0b] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                    disabled={
                                      enrollmentStatus?.status ===
                                      "payment_submitted"
                                    }
                                  >
                                    {enrollmentStatus?.status ===
                                    "payment_submitted"
                                      ? "Pending"
                                      : "Enroll Now"}
                                  </Button>
                                )
                              ) : (
                                <div className="flex-1 space-y-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedCourse(course)}
                                    className="w-full border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-300"
                                  >
                                    View Details
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCourse(course);
                                      setShowAuthModal(true);
                                    }}
                                    className="w-full bg-[#e2a70f] hover:bg-[#d69e0b] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                  >
                                    Enroll
                                  </Button>
                                </div>
                              )}
                            </div>
                            {user && enrollmentStatus && (
                              <div className="text-xs text-center">
                                <Badge
                                  variant={
                                    enrollmentStatus.status === "approved"
                                      ? "default"
                                      : enrollmentStatus.status ===
                                          "payment_submitted"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                >
                                  {enrollmentStatus.status === "approved"
                                    ? "Approved"
                                    : enrollmentStatus.status ===
                                        "payment_submitted"
                                      ? "Payment Under Review"
                                      : "Payment Required"}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* All Courses Section */}
            <div>
              <motion.h3
                className="text-2xl font-bold text-center mb-8 text-gray-700"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                All Available Courses
              </motion.h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-8">
                {courses.map((course) => {
                  const enrollmentStatus = user
                    ? checkEnrollmentStatus(course.id)
                    : null;
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative"
                    >
                      <Card className="h-full cursor-pointer transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 hover:shadow-2xl group relative overflow-hidden rounded-3xl bg-card backdrop-blur-sm border border-border shadow-blue-500/25">
                        {/* Background gradient overlay for regular courses */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-60 transition-all duration-500"></div>

                        {/* Enhanced hover background like root page */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-0 group-hover:opacity-90 transition-all duration-500"></div>
                        <CardHeader className="relative z-10">
                          <div className="flex items-center gap-3 mb-3">
                            {course.thumbnail && (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                  src={course.thumbnail}
                                  alt={course.title}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                            )}
                            <div className="text-blue-600 group-hover:text-yellow transition-colors duration-300">
                              {course.icon}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                                {course.title}
                              </CardTitle>
                              <CardDescription className="mt-1 group-hover:text-black dark:group-hover:text-white group-hover:opacity-90 transition-all duration-300">
                                {course.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-white transition-colors duration-300">
                            <FaClock className="w-4 h-4" />
                            <span>{course.duration}</span>
                            <FaDollarSign className="w-4 h-4 ml-2" />
                            <span>{course.price}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <div className="space-y-3">
                            <div>
                              <Badge
                                variant="secondary"
                                className="mb-2 transition-all duration-300 dark:group-hover:text-blue-200"
                              >
                                {course.level}
                              </Badge>
                              <p className="text-sm text-muted-foreground line-clamp-3 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                                {course.detailedDescription}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {user ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedCourse(course)}
                                    className="flex-1"
                                  >
                                    View Details
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCourse(course);
                                      handleEnrollment(course);
                                    }}
                                    className="flex-1 bg-[#e2a70f] hover:bg-[#d69e0b] text-white"
                                    disabled={
                                      enrollmentStatus?.status === "approved"
                                    }
                                  >
                                    {enrollmentStatus?.status === "approved"
                                      ? "Enrolled"
                                      : enrollmentStatus?.status ===
                                          "payment_submitted"
                                        ? "Pending"
                                        : "Enroll Now"}
                                  </Button>
                                </>
                              ) : (
                                <div className="flex-1 space-y-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedCourse(course)}
                                    className="w-full"
                                  >
                                    View Details
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCourse(course);
                                      setShowAuthModal(true);
                                    }}
                                    className="w-full bg-[#e2a70f] hover:bg-[#d69e0b] text-white"
                                  >
                                    Enroll
                                  </Button>
                                </div>
                              )}
                            </div>
                            {user && enrollmentStatus && (
                              <div className="text-xs text-center">
                                <Badge
                                  variant={
                                    enrollmentStatus.status === "approved"
                                      ? "default"
                                      : enrollmentStatus.status ===
                                          "payment_submitted"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                >
                                  {enrollmentStatus.status === "approved"
                                    ? "Approved"
                                    : enrollmentStatus.status ===
                                        "payment_submitted"
                                      ? "Payment Under Review"
                                      : "Payment Required"}
                                </Badge>
                              </div>
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
        ) : (
          <AnimatePresence>
            <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row h-[75vh] mt-10 gap-6">
              {/* Course Content Section */}
              <div className="w-full sm:w-full md:w-[35%] lg:w-[35%] xl:w-[35%] bg-card p-6 overflow-y-auto rounded-2xl shadow-elegant">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Contents
                </h3>
                {courseContents[selectedCourse.title]?.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={`my-3 font-medium cursor-pointer p-4 rounded-xl transition-all duration-500 transform relative group overflow-hidden ${
                      selectedTopic?.title === item.title
                        ? "text-white border-l-4 border-yellow bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg scale-105"
                        : "text-foreground hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-900 hover:border-l-4 hover:border-yellow"
                    }`}
                    onClick={() => setSelectedTopic(item)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Background gradient overlay for non-selected items */}
                    {selectedTopic?.title !== item.title && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-0 group-hover:opacity-90 transition-all duration-500 rounded-xl"></div>
                    )}

                    {/* Enhanced hover background for selected items */}
                    {selectedTopic?.title === item.title && (
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-30 rounded-xl"></div>
                    )}

                    {/* Content */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span
                        className={`font-semibold transition-colors duration-300 ${
                          selectedTopic?.title === item.title
                            ? "text-white"
                            : "group-hover:text-black dark:group-hover:text-white"
                        }`}
                      >
                        {item.title}
                      </span>

                      {/* Topic type indicator */}
                      <div
                        className={`ml-3 p-1 rounded-full transition-all duration-300 ${
                          selectedTopic?.title === item.title
                            ? "bg-yellow text-blue-900"
                            : "bg-blue-100 text-blue-600 group-hover:bg-yellow group-hover:text-blue-900"
                        }`}
                      >
                        {item.type === "video" ? (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </motion.div>
                ))}
                <Button
                  className="mx-12 mt-6 bg-primary text-primary-foreground hover:bg-yellow hover:text-primary-foreground"
                  onClick={() => {
                    setSelectedCourse(null);
                    setSelectedTopic(null);
                  }}
                >
                  Back to Courses
                </Button>
              </div>

              {/* Course Preview/Content Display */}
              <div className="flex-1 bg-card rounded-2xl shadow-elegant overflow-hidden">
                {selectedTopic ? (
                  <div className="h-full p-6">
                    {selectedTopic.type === "video" ? (
                      <iframe
                        src={selectedTopic.src}
                        title={selectedTopic.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-none rounded-xl"
                      />
                    ) : (
                      <iframe
                        src={selectedTopic.src}
                        title={selectedTopic.title}
                        className="w-full h-full border-none rounded-xl"
                      />
                    )}
                  </div>
                ) : (
                  /* Course Details Preview */
                  <div className="h-full p-6 overflow-y-auto">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="text-blue-600 text-3xl">
                          {selectedCourse.icon}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">
                            {selectedCourse.title}
                          </h2>
                          <p className="text-muted-foreground text-lg">
                            {selectedCourse.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <FaClock className="text-blue-600" />
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Duration
                                </p>
                                <p className="font-semibold">
                                  {selectedCourse.duration}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <FaDollarSign className="text-green-600" />
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Price
                                </p>
                                <p className="font-semibold">
                                  {selectedCourse.price}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Course Overview
                        </h3>
                        <p className="text-muted-foreground">
                          {selectedCourse?.detailedDescription ?? ""}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          What You'll Learn
                        </h3>
                        <ul className="space-y-2">
                          {selectedCourse?.benefits?.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <FaStar className="text-yellow-500 mt-1 flex-shrink-0" />
                              <span className="text-muted-foreground">
                                {benefit}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-3 text-gray-800">
                              Meet Your Instructor
                            </h4>
                            {selectedCourse.isFolder &&
                            selectedCourse.instructorName ? (
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  {selectedCourse.instructorProfileImage ? (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-blue-200">
                                      <img
                                        src={
                                          selectedCourse.instructorProfileImage
                                        }
                                        alt={selectedCourse.instructorName}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                                      {selectedCourse.instructorName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900">
                                      {selectedCourse.instructorName}
                                    </p>
                                    <p className="text-sm text-blue-600 font-medium">
                                      {selectedCourse.instructorProfession}
                                    </p>
                                  </div>
                                </div>
                                {selectedCourse.instructorExperience && (
                                  <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                      Experience & Background
                                    </p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                      {selectedCourse.instructorExperience}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                  <FaUser className="text-white text-sm" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {selectedCourse.instructor}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Expert Instructor
                                  </p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">
                              Prerequisites
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {selectedCourse?.prerequisites ?? "No prerequisites"}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="pt-4 border-t">
                        <Button
                          size="lg"
                          onClick={() => handleEnrollment(selectedCourse)}
                          className="w-full bg-[#e2a70f] hover:bg-[#d69e0b] text-white"
                          disabled={
                            checkEnrollmentStatus(selectedCourse.id)?.status ===
                            "approved"
                          }
                        >
                          {checkEnrollmentStatus(selectedCourse.id)?.status ===
                          "approved"
                            ? "Already Enrolled"
                            : checkEnrollmentStatus(selectedCourse.id)
                                  ?.status === "payment_submitted"
                              ? "Payment Under Review"
                              : `Enroll Now - ${selectedCourse.price}`}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Signup Modal */}
      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enroll in {selectedCourse?.title}</DialogTitle>
            <DialogDescription>
              Please fill in your details to enroll in this course.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={enrollmentData.fullName}
                onChange={(e) =>
                  setEnrollmentData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={enrollmentData.email}
                onChange={(e) =>
                  setEnrollmentData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={enrollmentData.phone}
                onChange={(e) =>
                  setEnrollmentData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={enrollmentData.age}
                onChange={(e) =>
                  setEnrollmentData((prev) => ({
                    ...prev,
                    age: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={enrollmentData.address}
                onChange={(e) =>
                  setEnrollmentData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSignupModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Continue to Payment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Proof Upload Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Payment Proof</DialogTitle>
            <DialogDescription>
              Please upload your payment proof for {selectedCourse?.title} (
              {selectedCourse?.price}). Transfer to: Bank Account: 123-456-789 |
              Mobile: +1234567890
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePaymentUpload} className="space-y-4">
            <div>
              <Label htmlFor="paymentProof">Payment Proof (Image/PDF)</Label>
              <Input
                id="paymentProof"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  const files = target.files;
                  if (!files) return;
                  if (files.length > 0) setPaymentProof(files[0]);
                }}
                required
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                After uploading, please wait for admin approval. You will
                receive notification once approved.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Upload Payment Proof
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Authentication Modal */}
      <UserAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <Footer />
    </div>
  );
}
