"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaBook,
  FaSave,
  FaEye,
  FaCog,
} from "react-icons/fa";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvancedCourseBuilder, { Section } from "@/components/instructor/AdvancedCourseBuilder";

export default function EditCoursePage() {
  const params = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [courseName, setCourseName] = useState("Loading...");
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    // In production, fetch course details from API
    // For demo, use mock data
    setCourseName("Web Development Masterclass");
  }, [courseId]);

  // Check if user is an instructor
  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <FaBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You need to be an approved instructor to edit courses.
            </p>
            <Button onClick={() => router.push("/instructor/dashboard")}>
              Go to Instructor Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveCourse = async (sections: Section[]) => {
    try {
      // In production, save sections to API
      console.log("Saving course sections:", sections);
      // Show success message
    } catch (error) {
      console.error("Failed to save course:", error);
    }
  };

  const handlePublishCourse = async () => {
    try {
      // In production, publish course via API
      console.log("Publishing course:", courseId);
      // Show success message and redirect
    } catch (error) {
      console.error("Failed to publish course:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/instructor/dashboard")}
                className="text-white hover:bg-white/10"
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{courseName}</h1>
                <p className="text-white/80 text-sm">Edit course content</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white dark:bg-slate-800 p-1 rounded-xl shadow-md">
              <TabsTrigger
                value="content"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6"
              >
                <FaBook />
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6"
              >
                <FaCog />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <AdvancedCourseBuilder
                courseId={courseId}
                courseName={courseName}
                onSave={handleSaveCourse}
                onPublish={handlePublishCourse}
              />
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Course Settings</CardTitle>
                  <CardDescription>
                    Configure additional settings for your course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Course settings will be available here. You can configure
                    pricing, visibility, discussion forums, certificates, and more.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
