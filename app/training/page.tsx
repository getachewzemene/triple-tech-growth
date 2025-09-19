'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaVideo, FaChartLine, FaCode, FaMobileAlt, FaPaintBrush, FaRobot, FaClock, FaUser, FaDollarSign, FaStar } from "react-icons/fa";
import Header from "@/components/Header";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";
import UserAuthModal from "@/components/UserAuthModal";

// Featured bonus courses as specified in the requirements
const featuredBonusCourses = [
  {
    id: 6,
    title: "AI Automation",
    description: "Get started with artificial intelligence.",
    icon: <FaRobot size={24} />,
    detailedDescription: "Explore the world of artificial intelligence and automation. Learn machine learning basics, Python programming, AI tools integration, and how to automate business processes.",
    duration: "8 weeks",
    level: "Beginner to Intermediate",
    price: "$499",
    benefits: [
      "Python programming for AI",
      "Machine learning fundamentals",
      "AI tool integration skills",
      "Business automation projects",
      "Future-ready career skills"
    ],
    instructor: "Dr. James Wilson - AI Research Scientist",
    prerequisites: "Basic math and logic skills",
    featured: true,
    thumbnail: "/placeholder.svg"
  },
  {
    id: 7,
    title: "CapCut Video Editing with Mobile",
    description: "Master mobile video editing with CapCut.",
    icon: <FaMobileAlt size={24} />,
    detailedDescription: "Learn professional mobile video editing using CapCut. Create stunning videos directly on your phone with advanced editing techniques, effects, and transitions specifically designed for mobile content creation.",
    duration: "6 weeks", 
    level: "Beginner to Intermediate",
    price: "$199",
    benefits: [
      "Mobile-first video editing mastery",
      "CapCut advanced features and effects",
      "Social media content optimization",
      "Transitions and animations",
      "Mobile video monetization strategies"
    ],
    instructor: "Lisa Chang - Mobile Content Creator",
    prerequisites: "Smartphone and CapCut app",
    featured: true,
    thumbnail: "/placeholder.svg"
  },
  {
    id: 1,
    title: "Video Editing",
    description: "Master video editing techniques.",
    icon: <FaVideo size={24} />,
    detailedDescription: "Learn professional video editing with industry-standard tools like Adobe Premiere Pro, DaVinci Resolve, and Final Cut Pro. Master cutting, transitions, color correction, audio mixing, and visual effects.",
    duration: "8 weeks",
    level: "Beginner to Advanced",
    price: "$299",
    benefits: [
      "Hands-on experience with professional editing software",
      "Portfolio development with real projects",
      "Certificate of completion",
      "Job placement assistance",
      "Lifetime access to course materials"
    ],
    instructor: "Sarah Johnson - 10+ years industry experience",
    prerequisites: "Basic computer skills",
    featured: true,
    thumbnail: "/placeholder.svg"
  }
];

const courses = [
  {
    id: 1,
    title: "Video Editing",
    description: "Master video editing techniques.",
    icon: <FaVideo size={24} />,
    detailedDescription: "Learn professional video editing with industry-standard tools like Adobe Premiere Pro, DaVinci Resolve, and Final Cut Pro. Master cutting, transitions, color correction, audio mixing, and visual effects.",
    duration: "8 weeks",
    level: "Beginner to Advanced",
    price: "$299",
    benefits: [
      "Hands-on experience with professional editing software",
      "Portfolio development with real projects",
      "Certificate of completion",
      "Job placement assistance",
      "Lifetime access to course materials"
    ],
    instructor: "Sarah Johnson - 10+ years industry experience",
    prerequisites: "Basic computer skills",
    thumbnail: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Digital Marketing",
    description: "Learn SEO and social media marketing.",
    icon: <FaChartLine size={24} />,
    detailedDescription: "Comprehensive digital marketing course covering SEO, SEM, social media marketing, content marketing, email marketing, and analytics. Learn to create effective campaigns that drive results.",
    duration: "10 weeks",
    level: "Beginner to Intermediate",
    price: "$399",
    benefits: [
      "Google Ads & Analytics certification preparation",
      "Real campaign management experience",
      "Social media strategy development",
      "ROI measurement and optimization",
      "Industry networking opportunities"
    ],
    instructor: "Mike Chen - Digital Marketing Expert",
    prerequisites: "None",
    thumbnail: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Web Development",
    description: "Build modern websites with React.",
    icon: <FaCode size={24} />,
    detailedDescription: "Full-stack web development course covering HTML, CSS, JavaScript, React, Node.js, and database management. Build responsive, interactive web applications from scratch.",
    duration: "12 weeks",
    level: "Beginner to Advanced",
    price: "$599",
    benefits: [
      "Build 5+ portfolio projects",
      "Learn latest web technologies",
      "Responsive design mastery",
      "Deployment and hosting skills",
      "Career transition support"
    ],
    instructor: "Alex Thompson - Senior Full-Stack Developer",
    prerequisites: "Basic computer literacy",
    thumbnail: "/placeholder.svg"
  },
  {
    id: 4,
    title: "Mobile App Development",
    description: "Create apps for iOS and Android.",
    icon: <FaMobileAlt size={24} />,
    detailedDescription: "Learn to develop native and cross-platform mobile applications using React Native, Flutter, or native development tools for iOS and Android platforms.",
    duration: "14 weeks",
    level: "Intermediate to Advanced",
    price: "$699",
    benefits: [
      "Publish apps to App Store and Google Play",
      "Cross-platform development skills",
      "UI/UX best practices for mobile",
      "App monetization strategies",
      "Technical interview preparation"
    ],
    instructor: "Emily Rodriguez - Mobile App Architect",
    prerequisites: "Basic programming knowledge",
    thumbnail: "/placeholder.svg"
  },
  {
    id: 5,
    title: "Graphic Design",
    description: "Create stunning visuals with design tools.",
    icon: <FaPaintBrush size={24} />,
    detailedDescription: "Master graphic design principles and tools including Adobe Creative Suite (Photoshop, Illustrator, InDesign), typography, color theory, and brand identity design.",
    duration: "6 weeks",
    level: "Beginner to Intermediate",
    price: "$349",
    benefits: [
      "Adobe Creative Suite mastery",
      "Professional portfolio creation",
      "Brand identity design skills",
      "Print and digital design expertise",
      "Freelancing guidance"
    ],
    instructor: "David Kim - Creative Director",
    prerequisites: "Design interest and creativity",
    thumbnail: "/placeholder.svg"
  },
  {
    id: 6,
    title: "AI Automation",
    description: "Get started with artificial intelligence.",
    icon: <FaRobot size={24} />,
    detailedDescription: "Explore the world of artificial intelligence and automation. Learn machine learning basics, Python programming, AI tools integration, and how to automate business processes.",
    duration: "8 weeks",
    level: "Beginner to Intermediate",
    price: "$499",
    benefits: [
      "Python programming for AI",
      "Machine learning fundamentals",
      "AI tool integration skills",
      "Business automation projects",
      "Future-ready career skills"
    ],
    instructor: "Dr. James Wilson - AI Research Scientist",
    prerequisites: "Basic math and logic skills",
    thumbnail: "/placeholder.svg"
  },
];

const courseContents = {
  "Video Editing": [
    { title: "Basics of Video Cutting", type: "video", src: "https://www.youtube.com/embed/F1sKwFHM8q4" },
    { title: "Exporting Projects", type: "pdf", src: "/pdfs/exporting.pdf" },
  ],
  "Digital Marketing": [
    { title: "Introduction to SEO", type: "pdf", src: "/pdfs/seo-guide.pdf" },
    { title: "Social Media Strategies", type: "video", src: "https://www.youtube.com/embed/ysz5S6PUM-U" },
  ],
  "Web Development": [
    { title: "React Basics", type: "video", src: "https://www.youtube.com/embed/bMknfKXIFA8" },
    { title: "Responsive Layouts", type: "pdf", src: "/pdfs/responsive.pdf" },
  ],
  "Mobile App Development": [
    { title: "Getting Started with React Native", type: "video", src: "https://www.youtube.com/embed/0-S5a0eXPoc" },
    { title: "Building Your First App", type: "pdf", src: "/pdfs/first-app.pdf" },
  ],
  "Graphic Design": [
    { title: "Design Principles", type: "video", src: "https://www.youtube.com/embed/1a8d2b3c4e5" },
    { title: "Using Adobe Photoshop", type: "pdf", src: "/pdfs/photoshop-guide.pdf" },
  ],
  "AI Automation": [
    { title: "Introduction to AI", type: "video", src: "https://www.youtube.com/embed/2e8d3f4g5h6" },
    { title: "Building AI Models", type: "pdf", src: "/pdfs/ai-models.pdf" },
  ]
};

export default function TrainingPage() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [courseFolders, setCourseFolders] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    address: ''
  });
  const [paymentProof, setPaymentProof] = useState(null);
  const { user, registerUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Load course folders from admin system
    const loadCourseFolders = () => {
      const folders = safeLocalStorage.getItem('adminCourseFolders', []);
      setCourseFolders(folders);
    };
    
    loadCourseFolders();
    // Refresh every 5 seconds to show new folders
    const interval = setInterval(loadCourseFolders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEnrollment = (course) => {
    // Check if user is already enrolled
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const isEnrolled = enrolledCourses.some(enrolled => enrolled.courseId === course.id);
    
    if (isEnrolled) {
      setShowPaymentModal(true);
    } else {
      setShowSignupModal(true);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    
    // Register the user if not already authenticated
    if (!user) {
      const userData = {
        ...enrollmentData,
        password: 'temp123' // In a real app, this would be generated or user-provided
      };
      registerUser(userData);
    }
    
    // Store enrollment data
    const enrolledCourses = safeLocalStorage.getItem('enrolledCourses', []);
    const newEnrollment = {
      courseId: selectedCourse.isFolder ? selectedCourse.id : selectedCourse.id,
      courseTitle: selectedCourse.title,
      ...enrollmentData,
      enrolledAt: new Date().toISOString(),
      status: 'pending_payment',
      isFolder: selectedCourse.isFolder || false
    };
    enrolledCourses.push(newEnrollment);
    safeLocalStorage.setItem('enrolledCourses', enrolledCourses);
    
    setShowSignupModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentUpload = async (e: any) => {
    e.preventDefault();
    if (!paymentProof || !selectedCourse) return;

    try {
      // Get presigned upload URL for the proof file
      const uploadUrlResponse = await fetch('/api/upload-proof-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: paymentProof.name,
          contentType: paymentProof.type,
          fileSize: paymentProof.size,
        }),
      });

      if (!uploadUrlResponse.ok) {
        const error = await uploadUrlResponse.json();
        throw new Error(error.error || 'Failed to get upload URL');
      }

      const { uploadUrl, s3Key } = await uploadUrlResponse.json();

      // Upload file directly to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': paymentProof.type,
        },
        body: paymentProof,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload proof file');
      }

      // Submit payment proof to create enrollment
      const proofResponse = await fetch('/api/enrollments/submit-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: selectedCourse.isFolder ? selectedCourse.id : selectedCourse.id.toString(),
          s3Key: s3Key,
          comment: 'Payment proof submitted from training page',
        }),
      });

      if (!proofResponse.ok) {
        const error = await proofResponse.json();
        throw new Error(error.error || 'Failed to submit proof');
      }

      const result = await proofResponse.json();
      
      // Update local storage for demo purposes
      const enrolledCourses = safeLocalStorage.getItem('enrolledCourses', []);
      const updatedCourses = enrolledCourses.map((course: any) => 
        course.courseId === (selectedCourse.isFolder ? selectedCourse.id : selectedCourse.id)
          ? { ...course, status: 'pending', paymentProofId: result.paymentProofId }
          : course
      );
      safeLocalStorage.setItem('enrolledCourses', updatedCourses);
      
      setShowPaymentModal(false);
      setPaymentProof(null);
      
      alert(`Payment proof uploaded successfully! ${result.message}`);
      
    } catch (error: any) {
      console.error('Error uploading payment proof:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const checkEnrollmentStatus = (courseId: number) => {
    const enrolledCourses = safeLocalStorage.getItem('enrolledCourses', []);
    return enrolledCourses.find((course: any) => course.courseId === courseId);
  };

  const checkFolderEnrollmentStatus = (folderId: string) => {
    const enrolledCourses = safeLocalStorage.getItem('enrolledCourses', []);
    return enrolledCourses.find((course: any) => course.courseId.toString() === folderId);
  };

  const handleFolderEnrollment = (folder: any) => {
    const enrollmentStatus = checkFolderEnrollmentStatus(folder.id);
    
    if (enrollmentStatus?.status === 'approved') {
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
        isFolder: true
      });
      setShowSignupModal(true);
    }
  };

  const formatFolderPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="px-4 pt-24 pb-16 md:px-8 lg:px-16">
        <motion.h2
          className="section-title text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {selectedCourse ? `${selectedCourse.title} Module` : "Training Modules"}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {courseFolders.map((folder, index) => {
                    const enrollmentStatus = checkFolderEnrollmentStatus(folder.id);
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
                        <div className={`group relative overflow-hidden rounded-3xl bg-white backdrop-blur-sm border border-gray-100 hover:border-gray-200 transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 shadow-blue-500/25 hover:shadow-2xl cursor-pointer h-full`}>
                          {/* Background gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                          
                          {/* Animated border gradient */}
                          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-0.5">
                            <div className="w-full h-full bg-white rounded-3xl"></div>
                          </div>

                          {/* Content */}
                          <div className="relative p-6 h-full flex flex-col">
                            {/* Stats badge */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                                {folder.topicsCount || 0} topics
                              </div>
                            </div>

                            {/* Icon */}
                            <div className="relative mb-6 flex justify-center">
                              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                                <FaVideo className="w-8 h-8 text-white" />
                              </div>
                              {/* Floating particles */}
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce"></div>
                              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                            </div>

                            {/* Title and description */}
                            <div className="text-center mb-6 flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-light-blue group-hover:to-yellow transition-all duration-300">
                                {folder.title}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300 mb-4">
                                {folder.description}
                              </p>
                              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                  <FaClock className="w-4 h-4" />
                                  <span>{folder.topicsCount || 0} topics</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FaDollarSign className="w-4 h-4" />
                                  <span>{formatFolderPrice(folder.priceCents)}</span>
                                </div>
                              </div>
                              <Badge variant="secondary" className="mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 border-gray-300">
                                Course Collection
                              </Badge>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-auto">
                              <div className="space-y-2">
                                {enrollmentStatus?.status === 'approved' ? (
                                  <Button 
                                    size="sm"
                                    onClick={() => router.push(`/course/${folder.id}`)}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                  >
                                    Access Course
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm"
                                    onClick={() => handleFolderEnrollment(folder)}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                    disabled={enrollmentStatus?.status === 'payment_submitted'}
                                  >
                                    {enrollmentStatus?.status === 'payment_submitted' ? 'Pending' : 'Enroll Now'}
                                  </Button>
                                )}
                                {enrollmentStatus && (
                                  <div className="text-xs text-center mt-2">
                                    <Badge 
                                      variant={
                                        enrollmentStatus.status === 'approved' ? 'default' :
                                        enrollmentStatus.status === 'payment_submitted' ? 'secondary' :
                                        'destructive'
                                      }
                                    >
                                      {enrollmentStatus.status === 'approved' ? 'Approved' :
                                       enrollmentStatus.status === 'payment_submitted' ? 'Payment Under Review' :
                                       'Payment Required'}
                                    </Badge>
                                  </div>
                                )}
                              </div>

                              {/* Progress indicator */}
                              <div className="absolute bottom-4 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>
                                </div>
                              </div>
                            </div>

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20 blur-xl transform scale-110"></div>
                            </div>
                          </div>
                        </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredBonusCourses.map((course, index) => {
                  const enrollmentStatus = user ? checkEnrollmentStatus(course.id) : null;
                  const gradientColor = index % 3 === 0 ? 'from-yellow-500 to-orange-600' : 
                                      index % 3 === 1 ? 'from-blue-500 to-indigo-600' : 
                                      'from-purple-500 to-pink-600';
                  const bgGradient = index % 3 === 0 ? 'from-yellow-50 to-orange-50' : 
                                   index % 3 === 1 ? 'from-blue-50 to-indigo-50' : 
                                   'from-purple-50 to-pink-50';
                  const shadowColor = index % 3 === 0 ? 'shadow-yellow-500/25' : 
                                    index % 3 === 1 ? 'shadow-blue-500/25' : 
                                    'shadow-purple-500/25';
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <div className={`group relative overflow-hidden rounded-3xl bg-white backdrop-blur-sm border border-gray-100 hover:border-gray-200 transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 ${shadowColor} hover:shadow-2xl cursor-pointer h-full`}>
                        {/* Background gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-60 transition-all duration-500`}></div>
                        
                        {/* Animated border gradient */}
                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradientColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-0.5`}>
                          <div className="w-full h-full bg-white rounded-3xl"></div>
                        </div>

                        {course.featured && (
                          <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${gradientColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10`}>
                            BONUS
                          </div>
                        )}

                        {/* Content */}
                        <div className="relative p-6 h-full flex flex-col">
                          {/* Stats badge */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${gradientColor} text-white text-xs font-semibold`}>
                              {course.duration}
                            </div>
                          </div>

                          {/* Icon */}
                          <div className="relative mb-6 flex justify-center">
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradientColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                              <div className="text-white text-2xl">{course.icon}</div>
                            </div>
                            {/* Floating particles */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce"></div>
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                          </div>

                          {/* Title and description */}
                          <div className="text-center mb-6 flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-light-blue group-hover:to-yellow transition-all duration-300">
                              {course.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300 mb-4">
                              {course.description}
                            </p>
                            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <FaClock className="w-4 h-4" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaDollarSign className="w-4 h-4" />
                                <span>{course.price}</span>
                              </div>
                            </div>
                            <Badge variant="secondary" className={`mb-3 bg-gradient-to-r ${bgGradient} text-gray-800 border-gray-300`}>
                              {course.level}
                            </Badge>
                          </div>

                          {/* Action buttons */}
                          <div className="mt-auto">
                            <div className="space-y-2">
                              {user ? (
                                enrollmentStatus?.status === 'approved' ? (
                                  <Button 
                                    size="sm"
                                    onClick={() => router.push(`/course/${course.id}`)}
                                    className={`w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
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
                                    className={`w-full bg-gradient-to-r ${gradientColor} hover:opacity-90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                                    disabled={enrollmentStatus?.status === 'payment_submitted'}
                                  >
                                    {enrollmentStatus?.status === 'payment_submitted' ? 'Pending' : 'Enroll Now'}
                                  </Button>
                                )
                              ) : (
                                <div className="space-y-2">
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
                                    className={`w-full bg-gradient-to-r ${gradientColor} hover:opacity-90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                                  >
                                    Enroll
                                  </Button>
                                </div>
                              )}
                              {user && enrollmentStatus && (
                                <div className="text-xs text-center mt-2">
                                  <Badge 
                                    variant={
                                      enrollmentStatus.status === 'approved' ? 'default' :
                                      enrollmentStatus.status === 'payment_submitted' ? 'secondary' :
                                      'destructive'
                                    }
                                  >
                                    {enrollmentStatus.status === 'approved' ? 'Approved' :
                                     enrollmentStatus.status === 'payment_submitted' ? 'Payment Under Review' :
                                     'Payment Required'}
                                  </Badge>
                                </div>
                              )}
                            </div>

                          {/* Progress indicator */}
                          <div className="absolute bottom-4 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${gradientColor} transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}></div>
                            </div>
                          </div>
                        </div>

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradientColor} opacity-20 blur-xl transform scale-110`}></div>
                        </div>
                      </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => {
                  const enrollmentStatus = user ? checkEnrollmentStatus(course.id) : null;
                  const gradientColor = index % 4 === 0 ? 'from-blue-500 to-indigo-600' : 
                                      index % 4 === 1 ? 'from-green-500 to-emerald-600' : 
                                      index % 4 === 2 ? 'from-purple-500 to-pink-600' :
                                      'from-orange-500 to-red-600';
                  const bgGradient = index % 4 === 0 ? 'from-blue-50 to-indigo-50' : 
                                   index % 4 === 1 ? 'from-green-50 to-emerald-50' : 
                                   index % 4 === 2 ? 'from-purple-50 to-pink-50' :
                                   'from-orange-50 to-red-50';
                  const shadowColor = index % 4 === 0 ? 'shadow-blue-500/25' : 
                                    index % 4 === 1 ? 'shadow-green-500/25' : 
                                    index % 4 === 2 ? 'shadow-purple-500/25' :
                                    'shadow-orange-500/25';
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <div className={`group relative overflow-hidden rounded-3xl bg-white backdrop-blur-sm border border-gray-100 hover:border-gray-200 transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 ${shadowColor} hover:shadow-2xl cursor-pointer h-full`}>
                        {/* Background gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-60 transition-all duration-500`}></div>
                        
                        {/* Animated border gradient */}
                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradientColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-0.5`}>
                          <div className="w-full h-full bg-white rounded-3xl"></div>
                        </div>

                        {/* Content */}
                        <div className="relative p-6 h-full flex flex-col">
                          {/* Stats badge */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${gradientColor} text-white text-xs font-semibold`}>
                              {course.duration}
                            </div>
                          </div>

                          {/* Icon */}
                          <div className="relative mb-6 flex justify-center">
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradientColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                              <div className="text-white text-2xl">{course.icon}</div>
                            </div>
                            {/* Floating particles */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce"></div>
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                          </div>

                          {/* Title and description */}
                          <div className="text-center mb-6 flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-light-blue group-hover:to-yellow transition-all duration-300">
                              {course.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300 mb-4">
                              {course.description}
                            </p>
                            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <FaClock className="w-4 h-4" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaDollarSign className="w-4 h-4" />
                                <span>{course.price}</span>
                              </div>
                            </div>
                            <Badge variant="secondary" className={`mb-3 bg-gradient-to-r ${bgGradient} text-gray-800 border-gray-300`}>
                              {course.level}
                            </Badge>
                          </div>

                          {/* Action buttons */}
                          <div className="mt-auto">
                            <div className="space-y-2">
                              {user ? (
                                enrollmentStatus?.status === 'approved' ? (
                                  <Button 
                                    size="sm"
                                    onClick={() => router.push(`/course/${course.id}`)}
                                    className={`w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                                  >
                                    Access Course
                                  </Button>
                                ) : (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedCourse(course)}
                                      className="w-full border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
                                    >
                                      View Details
                                    </Button>
                                    <Button 
                                      size="sm"
                                      onClick={() => {
                                        setSelectedCourse(course);
                                        handleEnrollment(course);
                                      }}
                                      className={`w-full bg-gradient-to-r ${gradientColor} hover:opacity-90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                                      disabled={enrollmentStatus?.status === 'payment_submitted'}
                                    >
                                      {enrollmentStatus?.status === 'payment_submitted' ? 'Pending' : 'Enroll Now'}
                                    </Button>
                                  </>
                                )
                              ) : (
                                <div className="space-y-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedCourse(course)}
                                    className="w-full border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
                                  >
                                    View Details
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCourse(course);
                                      setShowAuthModal(true);
                                    }}
                                    className={`w-full bg-gradient-to-r ${gradientColor} hover:opacity-90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                                  >
                                    Enroll
                                  </Button>
                                </div>
                              )}
                              {user && enrollmentStatus && (
                                <div className="text-xs text-center mt-2">
                                  <Badge 
                                    variant={
                                      enrollmentStatus.status === 'approved' ? 'default' :
                                      enrollmentStatus.status === 'payment_submitted' ? 'secondary' :
                                      'destructive'
                                    }
                                  >
                                    {enrollmentStatus.status === 'approved' ? 'Approved' :
                                     enrollmentStatus.status === 'payment_submitted' ? 'Payment Under Review' :
                                     'Payment Required'}
                                  </Badge>
                                </div>
                              )}
                            </div>

                          {/* Progress indicator */}
                          <div className="absolute bottom-4 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${gradientColor} transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}></div>
                            </div>
                          </div>
                        </div>

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradientColor} opacity-20 blur-xl transform scale-110`}></div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <div className="flex flex-col lg:flex-row h-[75vh] mt-10 gap-6">
              {/* Course Content Section */}
              <div className="w-full lg:w-[35%] bg-card p-6 overflow-y-auto rounded-2xl shadow-elegant">
                <h3 className="text-2xl font-bold text-foreground mb-6">Contents</h3>
                {courseContents[selectedCourse.title]?.map((item, index) => (
                  <div
                    key={index}
                    className={`my-3 font-medium cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                      selectedTopic?.title === item.title
                        ? 'text-primary border-l-2 border-yellow bg-primary/10'
                        : 'text-foreground hover:bg-primary/10 hover:text-yellow hover:border-l-2 hover:border-yellow'
                    }`}
                    onClick={() => setSelectedTopic(item)}
                  >
                    {item.title}
                  </div>
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
                          <h2 className="text-3xl font-bold">{selectedCourse.title}</h2>
                          <p className="text-muted-foreground text-lg">{selectedCourse.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <FaClock className="text-blue-600" />
                              <div>
                                <p className="text-sm text-muted-foreground">Duration</p>
                                <p className="font-semibold">{selectedCourse.duration}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <FaDollarSign className="text-green-600" />
                              <div>
                                <p className="text-sm text-muted-foreground">Price</p>
                                <p className="font-semibold">{selectedCourse.price}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-3">Course Overview</h3>
                        <p className="text-muted-foreground">{selectedCourse.detailedDescription}</p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-3">What You'll Learn</h3>
                        <ul className="space-y-2">
                          {selectedCourse.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <FaStar className="text-yellow-500 mt-1 flex-shrink-0" />
                              <span className="text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">Instructor</h4>
                            <p className="text-sm text-muted-foreground">{selectedCourse.instructor}</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">Prerequisites</h4>
                            <p className="text-sm text-muted-foreground">{selectedCourse.prerequisites}</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="pt-4 border-t">
                        <Button 
                          size="lg"
                          onClick={() => handleEnrollment(selectedCourse)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={checkEnrollmentStatus(selectedCourse.id)?.status === 'approved'}
                        >
                          {checkEnrollmentStatus(selectedCourse.id)?.status === 'approved' ? 'Already Enrolled' : 
                           checkEnrollmentStatus(selectedCourse.id)?.status === 'payment_submitted' ? 'Payment Under Review' :
                           `Enroll Now - ${selectedCourse.price}`}
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
                onChange={(e) => setEnrollmentData(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={enrollmentData.email}
                onChange={(e) => setEnrollmentData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={enrollmentData.phone}
                onChange={(e) => setEnrollmentData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={enrollmentData.age}
                onChange={(e) => setEnrollmentData(prev => ({ ...prev, age: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={enrollmentData.address}
                onChange={(e) => setEnrollmentData(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowSignupModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
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
              Please upload your payment proof for {selectedCourse?.title} ({selectedCourse?.price}).
              Transfer to: Bank Account: 123-456-789 | Mobile: +1234567890
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePaymentUpload} className="space-y-4">
            <div>
              <Label htmlFor="paymentProof">Payment Proof (Image/PDF)</Label>
              <Input
                id="paymentProof"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setPaymentProof(e.target.files[0])}
                required
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>After uploading, please wait for admin approval. You will receive notification once approved.</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowPaymentModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
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