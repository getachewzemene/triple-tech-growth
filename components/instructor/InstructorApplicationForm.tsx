"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaGraduationCap,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaCheck,
  FaClock,
  FaTimes,
  FaFileAlt,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InstructorApplicationFormProps {
  userId?: string;
  userName?: string;
  userEmail?: string;
  onSubmit?: (data: InstructorApplicationData) => void;
  applicationStatus?: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
}

interface InstructorApplicationData {
  userId: string;
  bio: string;
  expertise: string[];
  qualifications: string;
  experience: string;
  sampleCourseIdea: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

const expertiseOptions = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Cloud Computing",
  "DevOps",
  "Cybersecurity",
  "Digital Marketing",
  "Graphic Design",
  "Video Editing",
  "Business & Finance",
  "Languages",
  "Photography",
  "Music",
  "Other",
];

export function InstructorApplicationForm({
  userId = "",
  userName = "",
  userEmail = "",
  onSubmit,
  applicationStatus = "NONE",
}: InstructorApplicationFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<InstructorApplicationData>({
    userId,
    bio: "",
    expertise: [],
    qualifications: "",
    experience: "",
    sampleCourseIdea: "",
    socialLinks: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleExpertiseToggle = (expertise: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter((e) => e !== expertise)
        : [...prev.expertise, expertise],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // In production, this would call the API
      const response = await fetch("/api/instructor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      onSubmit?.(formData);
      setStep(4); // Success step
    } catch (error) {
      setSubmitError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bio">About You</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself, your background, and why you want to teach..."
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be displayed on your instructor profile
              </p>
            </div>
            <div>
              <Label>Areas of Expertise</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {expertiseOptions.map((expertise) => (
                  <Badge
                    key={expertise}
                    variant={formData.expertise.includes(expertise) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleExpertiseToggle(expertise)}
                  >
                    {formData.expertise.includes(expertise) && <FaCheck className="mr-1" />}
                    {expertise}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Select all that apply (minimum 1)
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="qualifications">Qualifications & Certifications</Label>
              <Textarea
                id="qualifications"
                placeholder="List your degrees, certifications, and relevant qualifications..."
                rows={3}
                value={formData.qualifications}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, qualifications: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="experience">Teaching/Professional Experience</Label>
              <Textarea
                id="experience"
                placeholder="Describe your teaching experience or professional background in your field..."
                rows={3}
                value={formData.experience}
                onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="courseIdea">Sample Course Idea</Label>
              <Textarea
                id="courseIdea"
                placeholder="Describe a course you would like to create..."
                rows={3}
                value={formData.sampleCourseIdea}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sampleCourseIdea: e.target.value }))
                }
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <div className="relative">
                <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/your-profile"
                  className="pl-10"
                  value={formData.socialLinks.linkedin || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="twitter">Twitter/X Profile</Label>
              <div className="relative">
                <FaTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-500" />
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/your-handle"
                  className="pl-10"
                  value={formData.socialLinks.twitter || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="website">Personal Website/Portfolio</Label>
              <div className="relative">
                <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  id="website"
                  placeholder="https://your-website.com"
                  className="pl-10"
                  value={formData.socialLinks.website || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, website: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
            {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
          </div>
        );

      case 4:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
            <p className="text-muted-foreground mb-4">
              Thank you for your interest in becoming an instructor. Our team will review your
              application and get back to you within 3-5 business days.
            </p>
            <p className="text-sm text-muted-foreground">
              You will receive an email notification once your application has been reviewed.
            </p>
          </div>
        );
    }
  };

  // If already applied, show status
  if (applicationStatus !== "NONE") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaChalkboardTeacher className="text-blue-600" />
            Instructor Application Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {applicationStatus === "PENDING" && (
              <>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FaClock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Application Under Review</h3>
                  <p className="text-muted-foreground text-sm">
                    Your application is being reviewed by our team. We'll notify you once a decision
                    has been made.
                  </p>
                </div>
              </>
            )}
            {applicationStatus === "APPROVED" && (
              <>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-600">Application Approved!</h3>
                  <p className="text-muted-foreground text-sm">
                    Congratulations! You can now create courses and start teaching.
                  </p>
                  <Button className="mt-2" size="sm">
                    Go to Instructor Dashboard
                  </Button>
                </div>
              </>
            )}
            {applicationStatus === "REJECTED" && (
              <>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTimes className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-600">Application Not Approved</h3>
                  <p className="text-muted-foreground text-sm">
                    Unfortunately, your application was not approved at this time. Please contact
                    support for more information.
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <FaChalkboardTeacher className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Become an Instructor</h2>
            <p className="text-white/80">Share your knowledge and earn money teaching online</p>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <FaUsers className="w-6 h-6 text-blue-600" />
            <div>
              <div className="font-semibold">Reach Students</div>
              <div className="text-sm text-muted-foreground">Teach thousands of learners</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <FaDollarSign className="w-6 h-6 text-green-600" />
            <div>
              <div className="font-semibold">Earn Money</div>
              <div className="text-sm text-muted-foreground">Get paid for your expertise</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <FaFileAlt className="w-6 h-6 text-purple-600" />
            <div>
              <div className="font-semibold">Easy Tools</div>
              <div className="text-sm text-muted-foreground">Simple course creation</div>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
              <FaGraduationCap className="mr-2" />
              Apply to Become an Instructor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Instructor Application</DialogTitle>
              <DialogDescription>
                {step < 4 ? `Step ${step} of 3` : "Application Complete"}
              </DialogDescription>
            </DialogHeader>

            {/* Progress indicator */}
            {step < 4 && (
              <div className="flex items-center justify-center gap-2 my-4">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      s === step
                        ? "bg-blue-600"
                        : s < step
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}

            {renderStep()}

            {step < 4 && (
              <div className="flex justify-between mt-4">
                {step > 1 ? (
                  <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                {step < 3 ? (
                  <Button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={
                      step === 1 && (formData.bio.length < 50 || formData.expertise.length === 0)
                    }
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </div>
            )}

            {step === 4 && (
              <Button onClick={() => setIsDialogOpen(false)} className="w-full">
                Close
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default InstructorApplicationForm;
