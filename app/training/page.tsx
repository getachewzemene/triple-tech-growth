"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  FaStar,
  FaSearch,
  FaFilter,
  FaUsers,
  FaGraduationCap,
  FaTrophy,
  FaFire,
  FaPlay,
  FaBookOpen,
  FaCheckCircle,
  FaMedal,
  FaCrown,
  FaArrowRight,
  FaLock,
} from "react-icons/fa";
import Header from "@/components/Header";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/app/providers/AuthProvider";
import { useAuthModal } from "@/app/providers/AuthModalProvider";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";

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
  rating?: number;
  studentsEnrolled?: number;
  isComingSoon?: boolean;
  category?: string;
};

// Constants
const BENEFIT_TRUNCATE_LENGTH = 35;

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
    rating: 4.8,
    studentsEnrolled: 1250,
    category: "Media Production",
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
    rating: 4.9,
    studentsEnrolled: 2100,
    category: "Marketing",
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
    rating: 4.7,
    studentsEnrolled: 3500,
    category: "Development",
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
    rating: 4.6,
    studentsEnrolled: 890,
    category: "Development",
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
    rating: 4.8,
    studentsEnrolled: 1800,
    category: "Design",
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
    rating: 4.9,
    studentsEnrolled: 1450,
    category: "Technology",
  },
  {
    id: 7,
    title: "Data Science Fundamentals",
    description: "Learn data analysis and visualization.",
    icon: <FaChartLine size={24} />,
    detailedDescription:
      "Master data science concepts including data analysis, visualization, statistical modeling, and machine learning fundamentals using Python and popular data science libraries.",
    duration: "10 weeks",
    level: "Intermediate",
    price: "$549",
    benefits: [
      "Python for data analysis",
      "Data visualization with popular tools",
      "Statistical modeling techniques",
      "Real-world data projects",
      "Industry certification preparation",
    ],
    instructor: "Dr. Sarah Martinez - Data Scientist",
    prerequisites: "Basic programming knowledge",
    thumbnail: "/placeholder.svg",
    rating: 4.7,
    studentsEnrolled: 0,
    category: "Technology",
    isComingSoon: true,
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

// Leaderboard data for Skool-like gamification
const topLearners = [
  { id: 1, name: "Abebe Kebede", points: 2450, coursesCompleted: 5, avatar: "", badge: "🏆" },
  { id: 2, name: "Sara Tadesse", points: 2180, coursesCompleted: 4, avatar: "", badge: "🥈" },
  { id: 3, name: "Dawit Mengistu", points: 1950, coursesCompleted: 4, avatar: "", badge: "🥉" },
  { id: 4, name: "Hana Girma", points: 1820, coursesCompleted: 3, avatar: "", badge: "⭐" },
  { id: 5, name: "Yonas Hailu", points: 1650, coursesCompleted: 3, avatar: "", badge: "⭐" },
];

// Community stats
const communityStats = {
  totalMembers: 2847,
  activeToday: 156,
  coursesAvailable: 7,
  certificatesIssued: 1256,
};

export default function TrainingPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { openAuthModal } = useAuthModal();
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
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  // Get unique categories from courses
  const categories = useMemo(() => {
    const cats = new Set(courses.map(c => c.category).filter(Boolean));
    return ["all", ...Array.from(cats)];
  }, []);

  // Get unique levels from courses
  const levels = useMemo(() => {
    const lvls = new Set(courses.map(c => c.level).filter(Boolean));
    return ["all", ...Array.from(lvls)];
  }, []);

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(lowerSearchQuery) ||
        course.description.toLowerCase().includes(lowerSearchQuery);
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

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
    const enrolledCourses: any[] = safeLocalStorage.getItem("enrolledCourses", []);
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
    // Format for Ethiopian market - show ETB pricing
    const usdAmount = ((priceCents ?? 0) / 100);
    const etbAmount = Math.round(usdAmount * 56); // Approximate ETB conversion
    return { usd: `$${usdAmount.toFixed(0)}`, etb: `${etbAmount.toLocaleString()} ETB` };
  };

  const formatPrice = (priceString?: string) => {
    if (!priceString) return { usd: "$0", etb: "0 ETB" };
    const amount = parseInt(priceString.replace(/[^0-9]/g, "")) || 0;
    const etbAmount = Math.round(amount * 56);
    return { usd: priceString, etb: `${etbAmount.toLocaleString()} ETB` };
  };

  // Active tab for the training page
  const [activeTab, setActiveTab] = useState("courses");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      {/* Hero Section - Skool Style */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-4 py-1.5 text-sm font-medium">
              <FaFire className="inline mr-2" /> Ethiopia&apos;s #1 Online Learning Platform
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Transform Your Career with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                World-Class Skills
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of Ethiopian learners mastering in-demand skills. Get certified, earn points, 
              and unlock opportunities with our expert-led courses.
            </p>
            
            {/* Community Stats - Skool Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-slate-700"
              >
                <div className="flex items-center justify-center mb-2">
                  <FaUsers className="text-blue-500 text-2xl" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{communityStats.totalMembers.toLocaleString()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Community Members</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-slate-700"
              >
                <div className="flex items-center justify-center mb-2">
                  <FaFire className="text-orange-500 text-2xl" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{communityStats.activeToday}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Active Today</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-slate-700"
              >
                <div className="flex items-center justify-center mb-2">
                  <FaBookOpen className="text-green-500 text-2xl" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{communityStats.coursesAvailable}+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Expert Courses</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-slate-700"
              >
                <div className="flex items-center justify-center mb-2">
                  <FaTrophy className="text-yellow-500 text-2xl" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{communityStats.certificatesIssued.toLocaleString()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Certificates Issued</div>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => openAuthModal("register")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <FaGraduationCap className="mr-2" />
                  Start Learning Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => openAuthModal("login")}
                  className="px-8 py-6 text-lg rounded-xl border-2"
                >
                  Sign In
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content with Tabs - Skool Style */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="courses" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-md">
              <TabsTrigger value="courses" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <FaBookOpen className="mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <FaTrophy className="mr-2" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="about" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <FaGraduationCap className="mr-2" />
                About
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="mt-0">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-6 text-lg rounded-xl border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl === "all" ? "All Levels" : lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Featured Courses from Admin */}
              {courseFolders.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <FaStar className="text-yellow-500 text-xl" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Courses</h2>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">New</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courseFolders.map((folder, index) => {
                      const enrollmentStatus = checkFolderEnrollmentStatus(folder.id);
                      const price = formatFolderPrice(folder.priceCents);
                      return (
                        <motion.div
                          key={folder.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="group h-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            {/* Course Image/Gradient Header */}
                            <div className="h-40 bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
                              <div className="absolute inset-0 bg-black/10"></div>
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                                  <FaVideo className="mr-1" /> {folder.topicsCount || 0} Lessons
                                </Badge>
                              </div>
                              <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-xl font-bold text-white">{folder.title}</h3>
                              </div>
                              {/* Decorative elements */}
                              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
                              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
                            </div>
                            
                            <CardContent className="p-5">
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                {folder.description || "Comprehensive course with expert-curated content"}
                              </p>
                              
                              {/* Instructor Info */}
                              {folder.instructorName && (
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-slate-700">
                                  <Avatar className="h-10 w-10 border-2 border-emerald-200">
                                    <AvatarImage src={folder.instructorProfileImage} />
                                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                                      {folder.instructorName?.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">{folder.instructorName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{folder.instructorProfession || "Expert Instructor"}</p>
                                  </div>
                                </div>
                              )}
                              
                              {/* Price and Enrollment */}
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{price.etb}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{price.usd}</div>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <FaUsers className="text-emerald-500" />
                                  <span>{Math.floor(Math.random() * 200) + 50} enrolled</span>
                                </div>
                              </div>
                              
                              {/* Action Button */}
                              {user && enrollmentStatus?.status === "approved" ? (
                                <Button
                                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-5"
                                  onClick={() => router.push(`/course/${folder.id}`)}
                                >
                                  <FaPlay className="mr-2" /> Continue Learning
                                </Button>
                              ) : (
                                <Button
                                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl py-5"
                                  onClick={() => user ? handleFolderEnrollment(folder) : openAuthModal("login")}
                                  disabled={enrollmentStatus?.status === "payment_submitted"}
                                >
                                  {enrollmentStatus?.status === "payment_submitted" ? (
                                    <>
                                      <FaClock className="mr-2" /> Payment Under Review
                                    </>
                                  ) : (
                                    <>
                                      <FaArrowRight className="mr-2" /> Enroll Now
                                    </>
                                  )}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Courses */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {searchQuery || selectedCategory !== "all" || selectedLevel !== "all" 
                      ? `${filteredCourses.length} Courses Found`
                      : "All Courses"
                    }
                  </h2>
                  {(searchQuery || selectedCategory !== "all" || selectedLevel !== "all") && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedLevel("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>

                {filteredCourses.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl">
                    <FaSearch className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No courses found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, index) => {
                      const enrollmentStatus = user ? checkEnrollmentStatus(course.id) : null;
                      const price = formatPrice(course.price);
                      return (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className={`group h-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${course.isComingSoon ? 'opacity-80' : ''}`}>
                            {/* Course Image/Gradient Header */}
                            <div className={`h-40 relative overflow-hidden ${
                              course.category === "Development" ? "bg-gradient-to-br from-blue-500 to-indigo-600" :
                              course.category === "Marketing" ? "bg-gradient-to-br from-pink-500 to-rose-600" :
                              course.category === "Design" ? "bg-gradient-to-br from-purple-500 to-violet-600" :
                              course.category === "Technology" ? "bg-gradient-to-br from-cyan-500 to-blue-600" :
                              "bg-gradient-to-br from-orange-500 to-amber-600"
                            }`}>
                              <div className="absolute inset-0 bg-black/10"></div>
                              <div className="absolute top-4 left-4 flex gap-2">
                                <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                                  {course.category}
                                </Badge>
                                {course.isComingSoon && (
                                  <Badge className="bg-purple-500/80 backdrop-blur-sm text-white border-0">
                                    Coming Soon
                                  </Badge>
                                )}
                              </div>
                              <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                                <FaStar className="text-yellow-300 text-sm" />
                                <span className="text-white text-sm font-medium">{course.rating}</span>
                              </div>
                              <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-xl font-bold text-white">{course.title}</h3>
                              </div>
                              {/* Course Icon */}
                              <div className="absolute right-4 bottom-4 p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white">
                                {course.icon}
                              </div>
                            </div>
                            
                            <CardContent className="p-5">
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                {course.description}
                              </p>
                              
                              {/* Course Meta */}
                              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <FaClock />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FaUsers />
                                  <span>{(course.studentsEnrolled || 0).toLocaleString()}</span>
                                </div>
                              </div>
                              
                              {/* Level Badge */}
                              <div className="mb-4">
                                <Badge variant="outline" className="text-xs">
                                  {course.level}
                                </Badge>
                              </div>
                              
                              {/* Price and Enrollment */}
                              <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                                <div>
                                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{price.etb}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{price.usd}</div>
                                </div>
                              </div>
                              
                              {/* Action Button */}
                              {course.isComingSoon ? (
                                <Button
                                  className="w-full bg-gray-400 text-white rounded-xl py-5 cursor-not-allowed"
                                  disabled
                                >
                                  <FaLock className="mr-2" /> Coming Soon
                                </Button>
                              ) : user && enrollmentStatus?.status === "approved" ? (
                                <Button
                                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-5"
                                  onClick={() => router.push(`/course/${course.id}`)}
                                >
                                  <FaPlay className="mr-2" /> Continue Learning
                                </Button>
                              ) : (
                                <Button
                                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl py-5"
                                  onClick={() => {
                                    if (!user) {
                                      openAuthModal("login");
                                    } else {
                                      setSelectedCourse(course);
                                      handleEnrollment(course);
                                    }
                                  }}
                                  disabled={enrollmentStatus?.status === "payment_submitted"}
                                >
                                  {enrollmentStatus?.status === "payment_submitted" ? (
                                    <>
                                      <FaClock className="mr-2" /> Payment Under Review
                                    </>
                                  ) : (
                                    <>
                                      <FaArrowRight className="mr-2" /> Enroll Now
                                    </>
                                  )}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Leaderboard Tab - Skool Style Gamification */}
            <TabsContent value="leaderboard" className="mt-0">
              <div className="max-w-4xl mx-auto">
                <Card className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6">
                    <div className="flex items-center gap-3">
                      <FaTrophy className="text-3xl" />
                      <div>
                        <CardTitle className="text-2xl">Top Learners This Month</CardTitle>
                        <CardDescription className="text-white/80">
                          Earn points by completing courses and engaging with the community
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Top 3 Podium */}
                    <div className="bg-gradient-to-b from-yellow-50 to-white dark:from-slate-700 dark:to-slate-800 p-8">
                      <div className="flex justify-center items-end gap-4">
                        {/* 2nd Place */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-center"
                        >
                          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-3xl shadow-lg">
                            🥈
                          </div>
                          <div className="font-bold text-gray-900 dark:text-white">{topLearners[1]?.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{topLearners[1]?.points.toLocaleString()} pts</div>
                          <div className="bg-gray-200 dark:bg-slate-600 h-16 w-24 mt-3 rounded-t-lg flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                            2nd
                          </div>
                        </motion.div>
                        
                        {/* 1st Place */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-center"
                        >
                          <FaCrown className="text-yellow-500 text-2xl mx-auto mb-2" />
                          <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl shadow-xl ring-4 ring-yellow-300">
                            🏆
                          </div>
                          <div className="font-bold text-gray-900 dark:text-white text-lg">{topLearners[0]?.name}</div>
                          <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">{topLearners[0]?.points.toLocaleString()} pts</div>
                          <div className="bg-gradient-to-t from-yellow-400 to-yellow-300 h-24 w-28 mt-3 rounded-t-lg flex items-center justify-center font-bold text-yellow-800">
                            1st
                          </div>
                        </motion.div>
                        
                        {/* 3rd Place */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-center"
                        >
                          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-3xl shadow-lg">
                            🥉
                          </div>
                          <div className="font-bold text-gray-900 dark:text-white">{topLearners[2]?.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{topLearners[2]?.points.toLocaleString()} pts</div>
                          <div className="bg-orange-200 dark:bg-orange-900/30 h-12 w-24 mt-3 rounded-t-lg flex items-center justify-center font-bold text-orange-700 dark:text-orange-400">
                            3rd
                          </div>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Leaderboard List */}
                    <div className="divide-y divide-gray-100 dark:divide-slate-700">
                      {topLearners.slice(3).map((learner, index) => (
                        <motion.div
                          key={learner.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-600 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                              {index + 4}
                            </div>
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                                {learner.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{learner.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {learner.coursesCompleted} courses completed
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-white">{learner.points.toLocaleString()}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">points</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* User's Ranking (if logged in) */}
                    {user && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                              You
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{user.username}</div>
                              <div className="text-sm text-blue-600 dark:text-blue-400">Keep learning to climb the ranks!</div>
                            </div>
                          </div>
                          <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                            <FaFire className="mr-2" />
                            Start Earning
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* How Points Work */}
                <Card className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaMedal className="text-yellow-500" />
                      How to Earn Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                        <FaCheckCircle className="text-green-500 text-2xl mx-auto mb-2" />
                        <div className="font-bold text-gray-900 dark:text-white">+100 pts</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Complete a lesson</div>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                        <FaTrophy className="text-blue-500 text-2xl mx-auto mb-2" />
                        <div className="font-bold text-gray-900 dark:text-white">+500 pts</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Complete a course</div>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                        <FaFire className="text-purple-500 text-2xl mx-auto mb-2" />
                        <div className="font-bold text-gray-900 dark:text-white">+50 pts</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Daily login streak</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-0">
              <div className="max-w-4xl mx-auto">
                <Card className="bg-white dark:bg-slate-800 rounded-2xl border-0 shadow-lg overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h2 className="text-3xl font-bold mb-2">Triple Technologies Academy</h2>
                      <p className="text-white/80">Ethiopia&apos;s Premier Online Learning Platform</p>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        We are dedicated to empowering Ethiopian learners with world-class digital skills. 
                        Our platform combines expert instruction, hands-on projects, and a supportive community 
                        to help you achieve your career goals.
                      </p>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Us?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="flex gap-3">
                          <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Expert Instructors</h4>
                            <p className="text-gray-600 dark:text-gray-400">Learn from industry professionals with years of experience</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Practical Projects</h4>
                            <p className="text-gray-600 dark:text-gray-400">Build real-world projects for your portfolio</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Ethiopian Context</h4>
                            <p className="text-gray-600 dark:text-gray-400">Content designed for Ethiopian learners and market</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Career Support</h4>
                            <p className="text-gray-600 dark:text-gray-400">Job placement assistance and networking opportunities</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Info for Ethiopia */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          We accept payments through Ethiopian banks and mobile money:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-slate-700 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Bank Transfer</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Commercial Bank of Ethiopia</p>
                            <p className="font-mono text-sm text-gray-900 dark:text-white">Account: 1000123456789</p>
                          </div>
                          <div className="bg-white dark:bg-slate-700 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Telebirr / CBE Birr</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Mobile Money</p>
                            <p className="font-mono text-sm text-gray-900 dark:text-white">+251 91 234 5678</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
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

      {/* Authentication is handled globally via AuthModalProvider */}

      <Footer />
    </div>
  );
}
