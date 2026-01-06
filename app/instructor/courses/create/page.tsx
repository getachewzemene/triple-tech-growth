"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaBook,
  FaSave,
  FaImage,
  FaMoneyBillWave,
  FaComments,
  FaCertificate,
  FaEye,
  FaTimes,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const categories = [
  "Development",
  "Business",
  "Design",
  "Marketing",
  "Photography",
  "Music",
  "Languages",
  "Finance",
  "Health & Fitness",
  "Teaching & Academics",
  "Other",
];

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  priceCents: number;
  enableDiscussion: boolean;
  enableCertificate: boolean;
}

export default function CreateCoursePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    category: "",
    priceCents: 0,
    enableDiscussion: true,
    enableCertificate: true,
  });

  // Check if user is an instructor
  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <FaBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You need to be an approved instructor to create courses.
            </p>
            <Button onClick={() => router.push("/instructor/dashboard")}>
              Go to Instructor Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/instructor/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instructorId: user.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      const result = await response.json();
      
      // Redirect to the instructor dashboard with success message
      router.push("/instructor/dashboard?created=true");
    } catch (err) {
      setError("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePriceChange = (value: string) => {
    // Convert ETB to cents (multiply by 100)
    const price = parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, priceCents: Math.round(price * 100) }));
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
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
              <p className="text-muted-foreground">
                Fill in the details below to create your course. You can add
                lessons and content after creating the course.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaBook className="text-blue-600" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Essential details about your course
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Course Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Web Development Masterclass"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Choose a clear, descriptive title for your course
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what students will learn in this course..."
                        rows={5}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        A compelling description helps students understand what
                        they will gain
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-green-600" />
                      Pricing
                    </CardTitle>
                    <CardDescription>
                      Set the price for your course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="price">Price (ETB)</Label>
                      <div className="relative">
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.priceCents / 100 || ""}
                          onChange={(e) => handlePriceChange(e.target.value)}
                          className="pl-12"
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          ETB
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Set to 0 for a free course
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Course Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaComments className="text-purple-600" />
                      Course Features
                    </CardTitle>
                    <CardDescription>
                      Enable or disable features for your course
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaComments className="text-blue-600" />
                        </div>
                        <div>
                          <Label htmlFor="discussion" className="text-base">
                            Discussion Forum
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Allow students to discuss and ask questions
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="discussion"
                        checked={formData.enableDiscussion}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            enableDiscussion: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FaCertificate className="text-green-600" />
                        </div>
                        <div>
                          <Label htmlFor="certificate" className="text-base">
                            Completion Certificate
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Issue certificates when students complete the course
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="certificate"
                        checked={formData.enableCertificate}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            enableCertificate: checked,
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Preview */}
                <Card className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaEye className="text-blue-600" />
                      Course Preview
                    </CardTitle>
                    <CardDescription>
                      How your course will appear to students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border">
                      <div className="flex items-start gap-4">
                        <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <FaImage className="text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {formData.title || "Course Title"}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {formData.description || "Course description..."}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {formData.category && (
                              <Badge variant="secondary">
                                {formData.category}
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {formData.priceCents > 0
                                ? `${(formData.priceCents / 100).toFixed(2)} ETB`
                                : "Free"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
                    <FaTimes className="flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/instructor/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !formData.title ||
                      !formData.description ||
                      !formData.category
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Create Course
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
