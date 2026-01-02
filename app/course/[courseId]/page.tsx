"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/providers/AuthProvider";
import { useAuthModal } from "@/app/providers/AuthModalProvider";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Video, FileText, CheckCircle, Book, ArrowLeft, ChevronRight } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ContentDisplay from "@/components/course/ContentDisplay";

type CourseFolder = {
  id: string;
  title: string;
  description?: string;
  instructor?: string;
  priceCents?: number;
};

type Topic = {
  id: string;
  courseFolderId: string;
  title: string;
  description: string; // required to match ContentDisplay
  order: number;
  videoS3Key?: string;
  videoSize?: number;
  videoDuration?: number;
  googleDriveVideoUrl?: string;
  pdfS3Key?: string;
  pdfSize?: number;
  createdAt: string;
  type: "topic";
};

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const courseId = params.courseId as string;

  const [courseFolder, setCourseFolder] = useState<CourseFolder | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    const loadCourse = () => {
      setLoading(true);
      const courseFolders = safeLocalStorage.getItem("adminCourseFolders", []);
      const folder = courseFolders.find((f: CourseFolder) => String(f.id) === String(courseId));
      if (!folder) {
        setCourseFolder(null);
        setTopics([]);
        setLoading(false);
        return;
      }

      setCourseFolder(folder);

      const allTopics = safeLocalStorage.getItem("adminTopics", []) as Topic[];
      const courseTopics = allTopics
        .filter((t: Topic) => String(t.courseFolderId) === String(courseId))
        .map((t: Topic) => ({
          // spread original topic first, then provide defaults so we don't
          // accidentally declare the same property twice (prevents TS2783)
          ...t,
          createdAt: t.createdAt ?? new Date().toISOString(),
          type: t.type ?? "topic",
          description: t.description ?? "",
        }))
        .sort((a: Topic, b: Topic) => a.order - b.order);

      setTopics(courseTopics);

      const completed = safeLocalStorage.getItem(`completedTopics_${courseId}`, []);
      setCompletedTopics(new Set(completed));

      if (courseTopics.length > 0) setSelectedTopic((prev) => prev ?? courseTopics[0]);

      setLoading(false);
    };

    loadCourse();
  }, [courseId]);

  const markTopicComplete = (topicId: string) => {
    const newCompleted = new Set(completedTopics);
    newCompleted.add(topicId);
    setCompletedTopics(newCompleted);
    safeLocalStorage.setItem(`completedTopics_${courseId}`, Array.from(newCompleted));
  };

  const selectTopic = (topic: Topic) => {
    setContentLoading(true);
    setSelectedTopic(topic);
    setTimeout(() => setContentLoading(false), 300);
  };

  const calculateProgress = () => (topics.length === 0 ? 0 : (completedTopics.size / topics.length) * 100);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-96">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Please Log In</h2>
              <p className="text-muted-foreground mb-4">You need to be logged in to access course content. Please sign in or create an account to continue.</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => openAuthModal("login")}>Sign In / Sign Up</Button>
                <Button variant="outline" onClick={() => router.push("/training")}>Back to Training</Button>
              </div>
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

  if (!courseFolder) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Alert className="max-w-md mx-auto">
            <AlertDescription>Course not found. Please contact support if you believe this is an error.</AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button onClick={() => router.push("/training")}>Back to Training</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/profile")} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{courseFolder.title}</h1>
                <p className="text-muted-foreground">{courseFolder.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <FaUser className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{courseFolder.instructor ?? "Instructor"}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Progress</div>
              <div className="flex items-center space-x-2">
                <Progress value={calculateProgress()} className="w-32" />
                <span className="text-sm font-medium">{Math.round(calculateProgress())}%</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">Instructor: {courseFolder.instructor ?? "Instructor"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Book className="h-5 w-5" />
                  Course Content
                </CardTitle>
                <div className="text-sm text-muted-foreground">{completedTopics.size} of {topics.length} topics completed</div>
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
                          <motion.div key={topic.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                            <button onClick={() => selectTopic(topic)} className={`w-full text-left p-4 border-b transition-all duration-200 hover:bg-muted/50 ${isSelected ? "bg-blue-50 border-l-4 border-l-blue-500 text-blue-900" : "hover:bg-gray-50"}`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    {topic.videoS3Key && <Video className="h-4 w-4 text-blue-500 flex-shrink-0" />}
                                    {topic.pdfS3Key && <FileText className="h-4 w-4 text-red-500 flex-shrink-0" />}
                                    <span className="text-sm font-medium truncate">{topic.title}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{topic.description}</p>
                                </div>
                                <div className="ml-2 flex-shrink-0">
                                  {isCompleted ? <CheckCircle className="h-5 w-5 text-green-500" /> : isSelected ? <ChevronRight className="h-5 w-5 text-blue-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
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

          <div className="md:col-span-3">
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
                          <Button size="sm" onClick={() => markTopicComplete(selectedTopic.id)} className="bg-green-600 hover:bg-green-700">
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
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">Loading content...</p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div key={selectedTopic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="h-full">
                          <ContentDisplay topic={selectedTopic} onComplete={() => markTopicComplete(selectedTopic.id)} isCompleted={completedTopics.has(selectedTopic.id)} />
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
                    <p className="text-muted-foreground mb-4">Select a topic from the sidebar to start learning</p>
                    <Badge variant="outline">{topics.length} {topics.length === 1 ? "topic" : "topics"} available</Badge>
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

