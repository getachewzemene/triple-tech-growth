'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/providers/AuthProvider';
import { safeLocalStorage } from '@/lib/hooks/useLocalStorage';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronRight, 
  ChevronDown, 
  Video, 
  FileText, 
  Lock, 
  CheckCircle,
  Play,
  Book,
  ArrowLeft,
  Download
} from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ContentDisplay from '@/components/course/ContentDisplay';

interface CourseFolder {
  id: string;
  title: string;
  description: string;
  instructor: string;
  priceCents: number;
  type: 'folder';
  topicsCount: number;
  createdAt: string;
}

interface Topic {
  id: string;
  courseFolderId: string;
  title: string;
  description: string;
  order: number;
  videoS3Key?: string;
  videoSize?: number;
  videoDuration?: number;
  pdfS3Key?: string;
  pdfSize?: number;
  createdAt: string;
  type: 'topic';
}

interface Enrollment {
  courseId: number;
  courseTitle: string;
  status: 'pending_payment' | 'payment_submitted' | 'approved' | 'rejected';
  enrolledAt: string;
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = params.courseId as string;

  const [courseFolder, setCourseFolder] = useState<CourseFolder | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);

  // Course data with instructor information (should match training page data)
  const courseInstructors = {
    "Video Editing": "Sarah Johnson - 10+ years industry experience",
    "Digital Marketing": "Mike Chen - Digital Marketing Expert", 
    "Web Development": "Alex Thompson - Senior Full-Stack Developer",
    "Mobile App Development": "Emma Wilson - Mobile App Specialist",
    "Graphic Design": "David Kim - Creative Director",
    "AI Automation": "Dr. James Wilson - AI Research Scientist",
  };

  const getInstructorInfo = (courseTitle: string) => {
    return courseInstructors[courseTitle] || "Expert Instructor";
  };

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
      return;
    }

    loadCourseData();
  }, [courseId, user]);

  const loadCourseData = () => {
    setLoading(true);

    // Get enrollment data
    const enrollments = safeLocalStorage.getItem('enrolledCourses', []);
    const userEnrollment = enrollments.find((e: Enrollment) => 
      e.courseId.toString() === courseId && e.status === 'approved'
    );

    if (!userEnrollment) {
      setLoading(false);
      return;
    }

    setEnrollment(userEnrollment);

    // Get course folder data
    const courseFolders = safeLocalStorage.getItem('adminCourseFolders', []);
    const folder = courseFolders.find((f: CourseFolder) => f.id === courseId);

    if (!folder) {
      setLoading(false);
      return;
    }

    setCourseFolder(folder);

    // Get topics for this course
    const allTopics = safeLocalStorage.getItem('adminTopics', []);
    const courseTopics = allTopics.filter((t: Topic) => 
      t.courseFolderId === courseId
    ).sort((a, b) => a.order - b.order);

    setTopics(courseTopics);

    // Load completed topics
    const completed = safeLocalStorage.getItem(`completedTopics_${courseId}`, []);
    setCompletedTopics(new Set(completed));

    // Auto-select first topic if none selected
    if (courseTopics.length > 0 && !selectedTopic) {
      setSelectedTopic(courseTopics[0]);
    }

    setLoading(false);
  };

  const markTopicComplete = (topicId: string) => {
    const newCompleted = new Set(completedTopics);
    newCompleted.add(topicId);
    setCompletedTopics(newCompleted);
    safeLocalStorage.setItem(`completedTopics_${courseId}`, Array.from(newCompleted));
  };

  const selectTopic = (topic: Topic) => {
    setContentLoading(true);
    setSelectedTopic(topic);
    
    // Simulate content loading delay for better UX
    setTimeout(() => {
      setContentLoading(false);
    }, 500);
  };

  const calculateProgress = () => {
    if (topics.length === 0) return 0;
    return (completedTopics.size / topics.length) * 100;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-96">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Please Log In</h2>
              <p className="text-muted-foreground mb-4">You need to be logged in to access course content.</p>
              <Button onClick={() => router.push('/admin/login')}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading course content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!enrollment || enrollment.status !== 'approved') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Alert className="max-w-md mx-auto">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              {!enrollment 
                ? "You are not enrolled in this course. Please enroll from the training page."
                : "Your enrollment is pending approval. Please wait for admin verification."
              }
            </AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button onClick={() => router.push('/training')}>
              Back to Training
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!courseFolder) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Alert className="max-w-md mx-auto">
            <AlertDescription>
              Course not found. Please contact support if you believe this is an error.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button onClick={() => router.push('/profile')}>
              Back to Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Course Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/profile')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{courseFolder.title}</h1>
                <p className="text-muted-foreground">{courseFolder.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <FaUser className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{getInstructorInfo(courseFolder.title)}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Progress</div>
              <div className="flex items-center space-x-2">
                <Progress value={calculateProgress()} className="w-32" />
                <span className="text-sm font-medium">{Math.round(calculateProgress())}%</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Instructor: {getInstructorInfo(courseFolder.title)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          
          {/* Course Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Book className="h-5 w-5" />
                  Course Content
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {completedTopics.size} of {topics.length} topics completed
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                  {topics.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No topics available yet</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {topics.map((topic, index) => {
                        const isSelected = selectedTopic?.id === topic.id;
                        const isCompleted = completedTopics.has(topic.id);
                        
                        return (
                          <motion.div
                            key={topic.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <button
                              onClick={() => selectTopic(topic)}
                              className={`w-full text-left p-4 border-b transition-all duration-200 hover:bg-muted/50 ${
                                isSelected 
                                  ? 'bg-blue-50 border-l-4 border-l-blue-500 text-blue-900' 
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    {topic.videoS3Key && (
                                      <Video className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                    )}
                                    {topic.pdfS3Key && (
                                      <FileText className="h-4 w-4 text-red-500 flex-shrink-0" />
                                    )}
                                    <span className="text-sm font-medium truncate">
                                      {topic.title}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {topic.description}
                                  </p>
                                  {(topic.videoDuration || topic.videoSize || topic.pdfSize) && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {topic.videoDuration && formatDuration(topic.videoDuration)}
                                      {topic.videoDuration && (topic.videoSize || topic.pdfSize) && ' • '}
                                      {topic.videoSize && formatFileSize(topic.videoSize)}
                                      {topic.pdfSize && formatFileSize(topic.pdfSize)}
                                    </div>
                                  )}
                                </div>
                                <div className="ml-2 flex-shrink-0">
                                  {isCompleted ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : isSelected ? (
                                    <ChevronRight className="h-5 w-5 text-blue-500" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                  )}
                                </div>
                              </div>
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Display Area */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              {selectedTopic ? (
                <div className="h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {selectedTopic.videoS3Key && <Video className="h-5 w-5 text-blue-500" />}
                          {selectedTopic.pdfS3Key && <FileText className="h-5 w-5 text-red-500" />}
                          {selectedTopic.title}
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">{selectedTopic.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {!completedTopics.has(selectedTopic.id) && (
                          <Button 
                            size="sm"
                            onClick={() => markTopicComplete(selectedTopic.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 p-0">
                    <AnimatePresence mode="wait">
                      {contentLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full flex items-center justify-center"
                        >
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">Loading content...</p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={selectedTopic.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="h-full"
                        >
                          {/* Content Display */}
                          <ContentDisplay
                            topic={selectedTopic}
                            onComplete={() => markTopicComplete(selectedTopic.id)}
                            isCompleted={completedTopics.has(selectedTopic.id)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </div>
              ) : (
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Book className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Welcome to {courseFolder.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      Select a topic from the sidebar to start learning
                    </p>
                    <Badge variant="outline">
                      {topics.length} {topics.length === 1 ? 'topic' : 'topics'} available
                    </Badge>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}