'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaVideo, FaChartLine, FaCode, FaMobileAlt, FaPaintBrush, FaRobot, FaClock, FaUser, FaDollarSign, FaStar } from "react-icons/fa";
import Header from "@/components/Header";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/app/providers/AuthProvider";
import Footer from "@/components/Footer";

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
    prerequisites: "Basic computer skills"
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
    prerequisites: "None"
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
    prerequisites: "Basic computer literacy"
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
    prerequisites: "Basic programming knowledge"
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
    prerequisites: "Design interest and creativity"
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
    prerequisites: "Basic math and logic skills"
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
  const [enrollmentData, setEnrollmentData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    address: ''
  });
  const [paymentProof, setPaymentProof] = useState(null);
  const { user, registerUser } = useAuth();

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
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const newEnrollment = {
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      ...enrollmentData,
      enrolledAt: new Date().toISOString(),
      status: 'pending_payment'
    };
    enrolledCourses.push(newEnrollment);
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
    
    setShowSignupModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentUpload = (e) => {
    e.preventDefault();
    if (paymentProof) {
      // In a real app, this would upload to a server
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      const updatedCourses = enrolledCourses.map(course => 
        course.courseId === selectedCourse.id 
          ? { ...course, status: 'payment_submitted', paymentProof: paymentProof.name }
          : course
      );
      localStorage.setItem('enrolledCourses', JSON.stringify(updatedCourses));
      
      // Simulate admin notification
      const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      adminNotifications.push({
        id: Date.now(),
        type: 'payment_proof',
        studentName: enrollmentData.fullName,
        courseTitle: selectedCourse.title,
        timestamp: new Date().toISOString(),
        paymentProof: paymentProof.name
      });
      localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
      
      setShowPaymentModal(false);
      setPaymentProof(null);
      alert('Payment proof uploaded successfully! Waiting for admin approval.');
    }
  };

  const checkEnrollmentStatus = (courseId) => {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    return enrolledCourses.find(course => course.courseId === courseId);
  };

  return (
    <div className="min-h-screen bg-background mt-6">
      <Header />
      <div className="px-4 py-16 md:px-8 lg:px-16">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {courses.map((course) => {
              const enrollmentStatus = checkEnrollmentStatus(course.id);
              return (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg group">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-blue-600 group-hover:text-yellow transition-colors duration-300">
                          {course.icon}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{course.title}</CardTitle>
                          <CardDescription className="mt-1">{course.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FaClock className="w-4 h-4" />
                        <span>{course.duration}</span>
                        <FaDollarSign className="w-4 h-4 ml-2" />
                        <span>{course.price}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {course.level}
                          </Badge>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {course.detailedDescription}
                          </p>
                        </div>
                        <div className="flex gap-2">
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
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={enrollmentStatus?.status === 'approved'}
                          >
                            {enrollmentStatus?.status === 'approved' ? 'Enrolled' : 
                             enrollmentStatus?.status === 'payment_submitted' ? 'Pending' :
                             'Enroll Now'}
                          </Button>
                        </div>
                        {enrollmentStatus && (
                          <div className="text-xs text-center">
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
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
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

      <Footer />
    </div>
  );
}