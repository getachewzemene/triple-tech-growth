"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Upload,
  X,
  File,
  Play,
  Pause,
  CheckCircle,
  Video,
  FileText,
  Plus,
} from "lucide-react";
import AddCourseModal from "@/components/admin/AddCourseModal";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";
import Select, {
  components as selectComponents,
  StylesConfig,
} from "react-select";
import { motion, AnimatePresence } from "framer-motion";

const selectStyles: StylesConfig = {
  control: (provided: any) => ({
    ...provided,
    minHeight: 40,
    boxShadow: "none",
  }),
  menu: (provided: any) => ({ ...provided, zIndex: 60 }),
  option: (provided: any, state: any) => ({
    ...provided,
    background: state.isFocused ? "var(--bg-muted)" : "transparent",
    color: "inherit",
  }),
};

// Zod validation schema for topic creation
const topicSchema = z
  .object({
    title: z
      .string()
      .min(1, "Topic title is required")
      .max(200, "Title too long"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(1000, "Description too long"),
    order: z.number().min(1, "Order must be at least 1"),
    courseId: z.string().optional().nullable(),
    // helper field updated from component state to allow schema-level validation
    fileRequired: z.boolean().optional(),
  })
  .refine((d) => Boolean(d.fileRequired), {
    message: "Please upload at least one file (video or PDF).",
    path: ["fileRequired"],
  });

type TopicFormData = z.infer<typeof topicSchema>;

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
  type: "topic";
}

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  // optional: when opened from a folder context we'll receive folder info
  courseFolderId?: string | null;
  courseFolderTitle?: string | null;
  // allow passing available courses so user can pick which course the topic belongs to
  courses?: { id: string; title: string }[];
  // existing topics for default ordering (folder or course scope)
  existingTopics?: Topic[];
  onTopicSaved: (topic: Topic) => void;
}

interface UploadState {
  progress: number;
  status: "idle" | "uploading" | "paused" | "completed" | "error";
  fileName?: string;
  fileSize?: number;
  duration?: number;
  error?: string;
  s3Key?: string;
}

interface MultipartState {
  uploadId?: string;
  partNumber: number;
  completedParts: Array<{ ETag: string; PartNumber: number }>;
}

export default function AddTopicModal({
  isOpen,
  onClose,
  courseFolderId = null,
  courseFolderTitle = null,
  courses = [],
  existingTopics = [],
  onTopicSaved,
}: AddTopicModalProps) {
  const { toast } = useToast();
  // local copy of courses to support in-place creation and searching
  const [coursesLocal, setCoursesLocal] = useState(courses || []);
  const [courseQuery, setCourseQuery] = useState("");
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(
    courses && courses.length > 0 ? courses[0].id : undefined,
  );
  const [ariaMessage, setAriaMessage] = useState("");
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedPDFFile, setSelectedPDFFile] = useState<File | null>(null);
  const [videoUploadState, setVideoUploadState] = useState<UploadState>({
    progress: 0,
    status: "idle",
  });
  const [pdfUploadState, setPdfUploadState] = useState<UploadState>({
    progress: 0,
    status: "idle",
  });
  const [videoMultipartState, setVideoMultipartState] =
    useState<MultipartState>({ partNumber: 1, completedParts: [] });
  const [pdfMultipartState, setPdfMultipartState] = useState<MultipartState>({
    partNumber: 1,
    completedParts: [],
  });
  const [videoUploadController, setVideoUploadController] =
    useState<AbortController | null>(null);
  const [pdfUploadController, setPdfUploadController] =
    useState<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    // watch,
    setValue,
  } = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      order: (existingTopics?.length || 0) + 1,
      courseId: courses && courses.length > 0 ? courses[0].id : undefined,
      fileRequired: false,
    },
  });

  // keep local courses in sync when prop changes
  useEffect(() => {
    setCoursesLocal(courses || []);
  }, [courses]);

  // if form has no course selected and we have local courses, preselect the first
  useEffect(() => {
    try {
      // defer to form value if already set
      // @ts-ignore
      const current =
        typeof window !== "undefined" && (window as any)
          ? undefined
          : undefined;
      // only set when there is no courseId and coursesLocal available
    } catch (e) {
      // noop
    }
    // If there is no selected course in the form, set to first local course
    // @ts-ignore getValues is available on the form instance
    const val =
      typeof window !== "undefined" && (window as any) ? undefined : undefined;
    // Safe simple preselect logic: prefer existing selectedCourseId or pick first
    if (
      (!selectedCourseId || selectedCourseId === "") &&
      coursesLocal &&
      coursesLocal.length > 0
    ) {
      setSelectedCourseId(coursesLocal[0].id);
      setValue("courseId", coursesLocal[0].id);
    } else if (selectedCourseId) {
      // ensure form has the selected id
      setValue("courseId", selectedCourseId);
    }
  }, [coursesLocal, setValue]);

  // Keep form-level indicator in sync with component file state so zod can validate
  useEffect(() => {
    const hasAnyFile = Boolean(
      selectedVideoFile ||
        selectedPDFFile ||
        videoUploadState.s3Key ||
        pdfUploadState.s3Key,
    );
    // update the hidden helper field and trigger validation when files change
    setValue("fileRequired", hasAnyFile, { shouldValidate: true });
  }, [
    selectedVideoFile,
    selectedPDFFile,
    videoUploadState.s3Key,
    pdfUploadState.s3Key,
    setValue,
  ]);

  const handleFileSelect = useCallback(
    (file: File, type: "video" | "pdf") => {
      const maxSize =
        type === "video" ? 1.5 * 1024 * 1024 * 1024 : 100 * 1024 * 1024; // 1.5GB for video, 100MB for PDF

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${type === "video" ? "Video" : "PDF"} file must be smaller than ${type === "video" ? "1.5GB" : "100MB"}.`,
          variant: "destructive",
        });
        return;
      }

      // NOTE: Accept file regardless of MIME type here — keep accept attr on input to help file pickers,
      // but don't enforce MIME checks. Show accepted formats in the UI instead.
      if (type === "video") {
        setSelectedVideoFile(file);
        setVideoUploadState({
          progress: 0,
          status: "idle",
          fileName: file.name,
          fileSize: file.size,
        });
      } else {
        setSelectedPDFFile(file);
        setPdfUploadState({
          progress: 0,
          status: "idle",
          fileName: file.name,
          fileSize: file.size,
        });
      }
    },
    [toast],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, type: "video" | "pdf") => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0], type);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Simplified upload function for demo purposes
  const startUpload = async (
    file: File,
    type: "video" | "pdf",
  ): Promise<string> => {
    const setUploadState =
      type === "video" ? setVideoUploadState : setPdfUploadState;

    try {
      setUploadState((prev) => ({ ...prev, status: "uploading" }));

      // Generate a mock S3 key
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileExtension = file.name.split(".").pop();
      const s3Key = `${type}s/${timestamp}_${randomString}.${fileExtension}`;

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setUploadState((prev) => ({ ...prev, progress }));
      }

      setUploadState((prev) => ({
        ...prev,
        status: "completed",
        progress: 100,
        s3Key,
        duration:
          type === "video" ? Math.floor(Math.random() * 600) + 60 : undefined, // Mock duration for video
      }));

      return s3Key;
    } catch (error) {
      setUploadState((prev) => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      }));
      throw error;
    }
  };

  const onSubmit = async (data: TopicFormData) => {
    try {
      // enforce at least one uploaded file (either a selected file or an already completed upload)
      const hasAnyFile = Boolean(
        selectedVideoFile ||
          selectedPDFFile ||
          videoUploadState.s3Key ||
          pdfUploadState.s3Key,
      );
      if (!hasAnyFile) {
        // set a form error so UI shows validation message
        // @ts-ignore - react-hook-form setError accepts any registered name; fileRequired is in schema
        // but ensure the user gets a toast as well
        toast({
          title: "Validation required",
          description:
            "Please upload at least one file (video or PDF) before creating a topic.",
          variant: "destructive",
        });
        return;
      }
      let videoS3Key: string | undefined;
      let pdfS3Key: string | undefined;
      // Upload video if a file was selected (or reuse completed upload)
      if (selectedVideoFile && videoUploadState.status !== "completed") {
        videoS3Key = await startUpload(selectedVideoFile, "video");
      } else if (videoUploadState.s3Key) {
        videoS3Key = videoUploadState.s3Key;
      }

      // Upload PDF if a file was selected (or reuse completed upload)
      if (selectedPDFFile && pdfUploadState.status !== "completed") {
        pdfS3Key = await startUpload(selectedPDFFile, "pdf");
      } else if (pdfUploadState.s3Key) {
        pdfS3Key = pdfUploadState.s3Key;
      }

      // Create topic data (include optional courseId if selected)
      const topic: any = {
        id: `topic_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        // keep folder association when provided (optional)
        courseFolderId: courseFolderId || undefined,
        // courseId will be attached via a select input below (if provided)
        title: data.title,
        description: data.description,
        order: data.order,
        videoS3Key,
        videoSize: selectedVideoFile?.size,
        videoDuration: videoUploadState.duration,
        pdfS3Key,
        pdfSize: selectedPDFFile?.size,
        createdAt: new Date().toISOString(),
        type: "topic",
      } as Topic & { courseId?: string };

      // attach courseId from the form data if provided
      if ((data as any).courseId) {
        topic.courseId = (data as any).courseId;
      }

      // Call the callback to save the topic
      onTopicSaved(topic);

      toast({
        title: "Topic created",
        description: `${data.title} has been added${topic.courseId ? ` to course` : ""}${courseFolderTitle ? ` / ${courseFolderTitle}` : ""} successfully.`,
      });

      // Reset form and close modal
      handleClose();
    } catch (error: any) {
      console.error("Error creating topic:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create topic. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    // Cancel any ongoing uploads
    if (videoUploadController) {
      videoUploadController.abort();
    }
    if (pdfUploadController) {
      pdfUploadController.abort();
    }

    // Reset form and state
    reset();
    setSelectedVideoFile(null);
    setSelectedPDFFile(null);
    setVideoUploadState({ progress: 0, status: "idle" });
    setPdfUploadState({ progress: 0, status: "idle" });
    setVideoMultipartState({ partNumber: 1, completedParts: [] });
    setPdfMultipartState({ partNumber: 1, completedParts: [] });
    setVideoUploadController(null);
    setPdfUploadController(null);
    onClose();
  };

  // Handler when a new course is created via the in-place AddCourseModal
  const handleCourseCreated = (course: any) => {
    try {
      // persist to demo storage
      const savedCourses = safeLocalStorage.getItem("adminCourses", []);
      const updated = [course, ...savedCourses];
      safeLocalStorage.setItem("adminCourses", updated);
      // update local state
      setCoursesLocal(updated);
      // select the newly created course in the form
      setValue("courseId", course.id);
      // close the create modal
      setIsAddCourseOpen(false);
      toast({
        title: "Course created",
        description: `${course.title} was added.`,
      });
    } catch (err) {
      console.error("Error saving course locally", err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>
                {courses && courses.length > 0
                  ? "Add Topic (select course)"
                  : "Add Topic"}
                {courseFolderTitle ? ` — ${courseFolderTitle}` : ""}
              </span>
            </DialogTitle>
            <DialogDescription>
              Add a new topic with video content, PDF content, or both. Select a
              course to associate the topic with, and optionally a folder.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Course selection (optional) - always visible; searchable and supports create-in-place */}
            <div>
              <Label htmlFor="topic-course-select">Target Course</Label>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  {/* react-select typeahead for better UX with animations */}
                  <div>
                    <Select
                      inputId="topic-course-select"
                      isClearable
                      placeholder={
                        coursesLocal && coursesLocal.length > 0
                          ? "Search courses..."
                          : "No courses available"
                      }
                      options={coursesLocal.map((c) => ({
                        value: c.id,
                        label: c.title,
                      }))}
                      value={
                        coursesLocal.find((c) => c.id === selectedCourseId)
                          ? {
                              value: selectedCourseId,
                              label: coursesLocal.find(
                                (c) => c.id === selectedCourseId,
                              )?.title,
                            }
                          : null
                      }
                      onChange={(opt: any) => {
                        if (!opt) {
                          setSelectedCourseId(undefined);
                          setValue("courseId", undefined);
                          setAriaMessage("Course selection cleared");
                          return;
                        }
                        setSelectedCourseId(opt.value);
                        setValue("courseId", opt.value);
                        setAriaMessage(`${opt.label} selected`);
                      }}
                      onInputChange={(val: string) => {
                        setCourseQuery(val);
                        setComboboxOpen(true);
                      }}
                      filterOption={(option: any, input: string) =>
                        option.label
                          .toLowerCase()
                          .includes((input || "").toLowerCase())
                      }
                      styles={selectStyles}
                      components={{
                        DropdownIndicator: selectComponents.DropdownIndicator,
                      }}
                      noOptionsMessage={() => "No courses match"}
                      menuPlacement="auto"
                      menuPortalTarget={
                        typeof window !== "undefined"
                          ? document.body
                          : undefined
                      }
                    />
                    {/* hidden input for react-hook-form */}
                    <input type="hidden" {...register("courseId")} />
                    {/* ARIA live region for screen reader announcements */}
                    <div aria-live="polite" className="sr-only" role="status">
                      {ariaMessage}
                    </div>
                  </div>
                  {(!coursesLocal || coursesLocal.length === 0) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      No courses available — create one below.
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddCourseOpen(true)}
                  >
                    + Create
                  </Button>
                </div>
              </div>
            </div>
            {/* Topic Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Topic Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to SEO, Setting Up Analytics, Video Editing Basics"
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Topic Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this topic covers and what students will learn..."
                  rows={3}
                  {...register("description")}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="order">Topic Order *</Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  {...register("order", { valueAsNumber: true })}
                  className={errors.order ? "border-red-500" : ""}
                />
                {errors.order && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.order.message}
                  </p>
                )}
              </div>

              {/* File upload tabs (video & PDF) — checkboxes removed; users can upload either or both */}
            </div>

            {/* File Upload Sections */}
            <Tabs defaultValue={"video"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="video">
                  <Video className="h-4 w-4 mr-2" />
                  Video Upload
                </TabsTrigger>
                <TabsTrigger value="pdf">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF Upload
                </TabsTrigger>
              </TabsList>

              {/* Video Upload Tab */}
              <TabsContent value="video" className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Video Content Upload</h3>
                  {!selectedVideoFile ? (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                      onDrop={(e) => handleDrop(e, "video")}
                      onDragOver={handleDragOver}
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drag & drop your video file here
                      </p>
                      <p className="text-gray-500 mb-4">or</p>
                      <Button type="button" variant="outline" asChild>
                        <label>
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                            onChange={(e) =>
                              e.target.files?.[0] &&
                              handleFileSelect(e.target.files[0], "video")
                            }
                            className="sr-only"
                          />
                          Choose Video File
                        </label>
                      </Button>
                      <div className="text-xs text-gray-500 mt-2">
                        <p className="mb-1">Accepted video formats:</p>
                        <ul className="list-disc list-inside">
                          <li>MP4 (.mp4)</li>
                          <li>WebM (.webm)</li>
                          <li>MOV (.mov)</li>
                          <li>AVI (.avi)</li>
                        </ul>
                        <p className="mt-1">Max size: 1.5GB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <File className="h-8 w-8 text-blue-500" />
                          <div>
                            <p className="font-medium">
                              {videoUploadState.fileName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {videoUploadState.fileSize &&
                                formatFileSize(videoUploadState.fileSize)}
                              {videoUploadState.duration &&
                                ` • ${formatDuration(videoUploadState.duration)}`}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedVideoFile(null);
                            setVideoUploadState({
                              progress: 0,
                              status: "idle",
                            });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {videoUploadState.status === "uploading" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{videoUploadState.progress}%</span>
                          </div>
                          <Progress value={videoUploadState.progress} />
                        </div>
                      )}

                      {videoUploadState.status === "completed" && (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span>Upload completed successfully</span>
                        </div>
                      )}

                      {videoUploadState.status === "error" && (
                        <div className="text-red-600 text-sm">
                          <p>Upload failed: {videoUploadState.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* PDF Upload Tab */}
              <TabsContent value="pdf" className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">PDF Content Upload</h3>
                  {!selectedPDFFile ? (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                      onDrop={(e) => handleDrop(e, "pdf")}
                      onDragOver={handleDragOver}
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drag & drop your PDF file here
                      </p>
                      <p className="text-gray-500 mb-4">or</p>
                      <Button type="button" variant="outline" asChild>
                        <label>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) =>
                              e.target.files?.[0] &&
                              handleFileSelect(e.target.files[0], "pdf")
                            }
                            className="sr-only"
                          />
                          Choose PDF File
                        </label>
                      </Button>
                      <div className="text-xs text-gray-500 mt-2">
                        <p className="mb-1">Accepted document formats:</p>
                        <ul className="list-disc list-inside">
                          <li>PDF (.pdf)</li>
                        </ul>
                        <p className="mt-1">Max size: 100MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-red-500" />
                          <div>
                            <p className="font-medium">
                              {pdfUploadState.fileName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {pdfUploadState.fileSize &&
                                formatFileSize(pdfUploadState.fileSize)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPDFFile(null);
                            setPdfUploadState({ progress: 0, status: "idle" });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {pdfUploadState.status === "uploading" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{pdfUploadState.progress}%</span>
                          </div>
                          <Progress value={pdfUploadState.progress} />
                        </div>
                      )}

                      {pdfUploadState.status === "completed" && (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span>Upload completed successfully</span>
                        </div>
                      )}

                      {pdfUploadState.status === "error" && (
                        <div className="text-red-600 text-sm">
                          <p>Upload failed: {pdfUploadState.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gold" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Add Topic"}
              </Button>
            </div>
            {/* Inline validation hint for required file */}
            {!selectedVideoFile &&
              !selectedPDFFile &&
              !videoUploadState.s3Key &&
              !pdfUploadState.s3Key && (
                <p className="text-sm text-red-500 mt-2">
                  Please upload at least one file (video or PDF) before
                  submitting.
                </p>
              )}
          </form>
        </DialogContent>
      </Dialog>
      <AddCourseModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
        onCourseSaved={handleCourseCreated}
      />
    </>
  );
}
