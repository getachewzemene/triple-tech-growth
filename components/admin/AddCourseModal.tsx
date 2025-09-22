'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, File, Play, Pause, CheckCircle } from 'lucide-react';

// Zod validation schema for course creation
const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  detail: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  instructor: z.string().min(1, 'Instructor name is required').max(100, 'Instructor name too long'),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface Course {
  id: string;
  title: string;
  detail: string;
  instructor: string;
  s3Key: string;
  duration?: number;
  size?: number;
}

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseSaved: (course: Course) => void;
}

interface UploadState {
  progress: number;
  status: 'idle' | 'uploading' | 'paused' | 'completed' | 'error';
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

export default function AddCourseModal({ isOpen, onClose, onCourseSaved }: AddCourseModalProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({ progress: 0, status: 'idle' });
  const [multipartState, setMultipartState] = useState<MultipartState>({ partNumber: 1, completedParts: [] });
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadController, setUploadController] = useState<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  /**
   * Handle file selection via input or drag & drop
   */
  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an MP4, WebM, MOV, or AVI video file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (1.5GB max)
    const maxSize = 1.5 * 1024 * 1024 * 1024; // 1.5GB in bytes
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please select a video file smaller than 1.5GB.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    setUploadState({
      progress: 0,
      status: 'idle',
      fileName: file.name,
      fileSize: file.size,
    });

    // Try to get video duration using HTML5 video element
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      setUploadState(prev => ({ ...prev, duration: Math.round(video.duration) }));
      window.URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(file);
  }, [toast]);

  /**
   * Handle drag and drop events
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  /**
   * Upload file using simple presigned URL (for files < 100MB)
   */
  const uploadFileSimple = async (file: File, s3Key: string): Promise<void> => {
    const controller = new AbortController();
    setUploadController(controller);

    try {
      // Request presigned URL from backend
      const urlResponse = await fetch('/api/admin/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: s3Key,
          contentType: file.type,
        }),
      });

      if (!urlResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl } = await urlResponse.json();

      // Upload file directly to S3 with progress tracking
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            setUploadState(prev => ({ ...prev, progress }));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadState(prev => ({
              ...prev,
              progress: 100,
              status: 'completed',
              s3Key,
            }));
            resolve();
          } else {
            reject(new Error('Failed to upload file'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('abort', () => {
          setUploadState(prev => ({ ...prev, status: 'paused' }));
          reject(new Error('Upload aborted'));
        });

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);

        // Store xhr reference for abort functionality
        controller.signal.addEventListener('abort', () => {
          xhr.abort();
        });
      });

    } catch (error) {
      if (error instanceof Error && error.message === 'Upload aborted') {
        setUploadState(prev => ({ ...prev, status: 'paused' }));
      } else {
        setUploadState(prev => ({
          ...prev,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
        }));
      }
      throw error;
    } finally {
      setUploadController(null);
    }
  };

  /**
   * Start file upload
   */
  const startUpload = async (): Promise<string> => {
    if (!selectedFile) {
      throw new Error('No file selected');
    }

    setUploadState(prev => ({ ...prev, status: 'uploading', progress: 0 }));

    // Generate S3 key
    const s3Key = `uploads/${Date.now()}_${Math.random().toString(36).substring(2)}_${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    try {
      // For now, use simple upload for all files (multipart can be added later)
      await uploadFileSimple(selectedFile, s3Key);
      return s3Key;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Pause ongoing upload
   */
  const pauseUpload = () => {
    if (uploadController) {
      uploadController.abort();
    }
  };

  /**
   * Resume paused upload
   */
  const resumeUpload = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      await startUpload();
    } catch (error) {
      // Error handling is done in upload functions
    }
  };

  /**
   * Cancel upload and clean up
   */
  const cancelUpload = () => {
    if (uploadController) {
      uploadController.abort();
    }
    setSelectedFile(null);
    setUploadState({ progress: 0, status: 'idle' });
    setMultipartState({ partNumber: 1, completedParts: [] });
  };

  /**
   * Handle form submission - create course after successful upload
   */
  const onSubmit = async (data: CourseFormData) => {
    try {
      if (!selectedFile) {
        toast({
          title: 'No file selected',
          description: 'Please select a video file to upload.',
          variant: 'destructive',
        });
        return;
      }

      // Start upload if not completed
      let s3Key = uploadState.s3Key;
      if (uploadState.status !== 'completed') {
        s3Key = await startUpload();
      }

      // Create course record
      const response = await fetch('/api/admin/courses/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          s3Key,
          videoSize: selectedFile.size,
          duration: uploadState.duration,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      const course = await response.json();

      toast({
        title: 'Course created successfully',
        description: `Course "${data.title}" has been created and is ready for students.`,
      });

      // Call success callback
      onCourseSaved(course);

      // Reset form and close modal
      reset();
      setSelectedFile(null);
      setUploadState({ progress: 0, status: 'idle' });
      setMultipartState({ partNumber: 1, completedParts: [] });
      onClose();

    } catch (error) {
      toast({
        title: 'Error creating course',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Format duration for display
   */
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Upload a video course and provide course details. Maximum file size: 1.5GB.
            Supported formats: MP4, WebM, MOV, AVI.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Course Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter course title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="detail">Course Description *</Label>
              <Textarea
                id="detail"
                {...register('detail')}
                placeholder="Enter detailed course description"
                rows={4}
                className={errors.detail ? 'border-red-500' : ''}
              />
              {errors.detail && (
                <p className="text-red-500 text-sm mt-1">{errors.detail.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="instructor">Instructor Name *</Label>
              <Input
                id="instructor"
                {...register('instructor')}
                placeholder="Enter instructor name"
                className={errors.instructor ? 'border-red-500' : ''}
              />
              {errors.instructor && (
                <p className="text-red-500 text-sm mt-1">{errors.instructor.message}</p>
              )}
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <Label>Video File *</Label>
            
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag & drop your video file here
                </p>
                <p className="text-gray-500 mb-4">or</p>
                <Button type="button" variant="outline" asChild>
                  <label>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="sr-only"
                    />
                    Choose File
                  </label>
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  MP4, WebM, MOV, AVI • Max 1.5GB
                </p>
              </div>
            ) : (
              <div className="border rounded-lg p-4 space-y-4">
                {/* File Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{uploadState.fileName}</p>
                      <p className="text-sm text-gray-500">
                        {uploadState.fileSize && formatFileSize(uploadState.fileSize)}
                        {uploadState.duration && ` • ${formatDuration(uploadState.duration)}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={cancelUpload}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Upload Progress */}
                {uploadState.status !== 'idle' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{uploadState.status}</span>
                      <span>{Math.round(uploadState.progress)}%</span>
                    </div>
                    <Progress value={uploadState.progress} className="h-2" />
                    
                    {/* Upload Controls */}
                    {uploadState.status === 'uploading' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={pauseUpload}
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    
                    {uploadState.status === 'paused' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={resumeUpload}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    )}

                    {uploadState.status === 'completed' && (
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Upload completed successfully
                      </div>
                    )}

                    {uploadState.status === 'error' && (
                      <p className="text-red-500 text-sm">{uploadState.error}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              disabled={isSubmitting || !selectedFile || uploadState.status === 'uploading'}
            >
              {isSubmitting ? 'Creating Course...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}