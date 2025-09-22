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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, File, Play, Pause, CheckCircle, Video, FileText, Plus } from 'lucide-react';

// Zod validation schema for topic creation
const topicSchema = z.object({
  title: z.string().min(1, 'Topic title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  order: z.number().min(1, 'Order must be at least 1'),
  hasVideo: z.boolean(),
  hasPDF: z.boolean(),
}).refine(data => data.hasVideo || data.hasPDF, {
  message: "Topic must have at least video content or PDF content",
  path: ["hasVideo"]
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
  type: 'topic';
}

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseFolderId: string;
  courseFolderTitle: string;
  existingTopics: Topic[];
  onTopicSaved: (topic: Topic) => void;
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

export default function AddTopicModal({ 
  isOpen, 
  onClose, 
  courseFolderId, 
  courseFolderTitle, 
  existingTopics,
  onTopicSaved 
}: AddTopicModalProps) {
  const { toast } = useToast();
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedPDFFile, setSelectedPDFFile] = useState<File | null>(null);
  const [videoUploadState, setVideoUploadState] = useState<UploadState>({ progress: 0, status: 'idle' });
  const [pdfUploadState, setPdfUploadState] = useState<UploadState>({ progress: 0, status: 'idle' });
  const [videoMultipartState, setVideoMultipartState] = useState<MultipartState>({ partNumber: 1, completedParts: [] });
  const [pdfMultipartState, setPdfMultipartState] = useState<MultipartState>({ partNumber: 1, completedParts: [] });
  const [videoUploadController, setVideoUploadController] = useState<AbortController | null>(null);
  const [pdfUploadController, setPdfUploadController] = useState<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      order: existingTopics.length + 1,
      hasVideo: false,
      hasPDF: false,
    },
  });

  const hasVideo = watch('hasVideo');
  const hasPDF = watch('hasPDF');

  const handleFileSelect = useCallback((file: File, type: 'video' | 'pdf') => {
    const maxSize = type === 'video' ? 1.5 * 1024 * 1024 * 1024 : 100 * 1024 * 1024; // 1.5GB for video, 100MB for PDF
    
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: `${type === 'video' ? 'Video' : 'PDF'} file must be smaller than ${type === 'video' ? '1.5GB' : '100MB'}.`,
        variant: 'destructive',
      });
      return;
    }

    if (type === 'video') {
      const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
      if (!videoTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a valid video file (MP4, WebM, MOV, AVI).',
          variant: 'destructive',
        });
        return;
      }
      setSelectedVideoFile(file);
      setVideoUploadState({ progress: 0, status: 'idle', fileName: file.name, fileSize: file.size });
    } else {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please select a valid PDF file.',
          variant: 'destructive',
        });
        return;
      }
      setSelectedPDFFile(file);
      setPdfUploadState({ progress: 0, status: 'idle', fileName: file.name, fileSize: file.size });
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, type: 'video' | 'pdf') => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0], type);
    }
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Simplified upload function for demo purposes
  const startUpload = async (file: File, type: 'video' | 'pdf'): Promise<string> => {
    const setUploadState = type === 'video' ? setVideoUploadState : setPdfUploadState;
    
    try {
      setUploadState(prev => ({ ...prev, status: 'uploading' }));
      
      // Generate a mock S3 key
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileExtension = file.name.split('.').pop();
      const s3Key = `${type}s/${timestamp}_${randomString}.${fileExtension}`;
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadState(prev => ({ ...prev, progress }));
      }
      
      setUploadState(prev => ({ 
        ...prev, 
        status: 'completed', 
        progress: 100, 
        s3Key,
        duration: type === 'video' ? Math.floor(Math.random() * 600) + 60 : undefined // Mock duration for video
      }));
      
      return s3Key;
    } catch (error) {
      setUploadState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Upload failed'
      }));
      throw error;
    }
  };

  const onSubmit = async (data: TopicFormData) => {
    try {
      let videoS3Key: string | undefined;
      let pdfS3Key: string | undefined;

      // Upload video file if selected and hasVideo is true
      if (data.hasVideo && selectedVideoFile && videoUploadState.status !== 'completed') {
        videoS3Key = await startUpload(selectedVideoFile, 'video');
      } else if (data.hasVideo && videoUploadState.s3Key) {
        videoS3Key = videoUploadState.s3Key;
      }

      // Upload PDF file if selected and hasPDF is true
      if (data.hasPDF && selectedPDFFile && pdfUploadState.status !== 'completed') {
        pdfS3Key = await startUpload(selectedPDFFile, 'pdf');
      } else if (data.hasPDF && pdfUploadState.s3Key) {
        pdfS3Key = pdfUploadState.s3Key;
      }

      // Validate that files are uploaded if content types are selected
      if (data.hasVideo && !videoS3Key) {
        toast({
          title: 'Video file required',
          description: 'Please upload a video file since video content is selected.',
          variant: 'destructive',
        });
        return;
      }

      if (data.hasPDF && !pdfS3Key) {
        toast({
          title: 'PDF file required',
          description: 'Please upload a PDF file since PDF content is selected.',
          variant: 'destructive',
        });
        return;
      }

      // Create topic data
      const topic: Topic = {
        id: `topic_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        courseFolderId,
        title: data.title,
        description: data.description,
        order: data.order,
        videoS3Key,
        videoSize: selectedVideoFile?.size,
        videoDuration: videoUploadState.duration,
        pdfS3Key,
        pdfSize: selectedPDFFile?.size,
        createdAt: new Date().toISOString(),
        type: 'topic',
      };

      // Call the callback to save the topic
      onTopicSaved(topic);

      toast({
        title: 'Topic created',
        description: `${data.title} has been added to ${courseFolderTitle} successfully.`,
      });

      // Reset form and close modal
      handleClose();
    } catch (error: any) {
      console.error('Error creating topic:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create topic. Please try again.',
        variant: 'destructive',
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
    setVideoUploadState({ progress: 0, status: 'idle' });
    setPdfUploadState({ progress: 0, status: 'idle' });
    setVideoMultipartState({ partNumber: 1, completedParts: [] });
    setPdfMultipartState({ partNumber: 1, completedParts: [] });
    setVideoUploadController(null);
    setPdfUploadController(null);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Topic to {courseFolderTitle}</span>
          </DialogTitle>
          <DialogDescription>
            Add a new topic with video content, PDF content, or both. Each topic will be a separate lesson within the course folder.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Topic Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Topic Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to SEO, Setting Up Analytics, Video Editing Basics"
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Topic Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what this topic covers and what students will learn..."
                rows={3}
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="order">Topic Order *</Label>
              <Input
                id="order"
                type="number"
                min="1"
                {...register('order', { valueAsNumber: true })}
                className={errors.order ? 'border-red-500' : ''}
              />
              {errors.order && (
                <p className="text-red-500 text-sm mt-1">{errors.order.message}</p>
              )}
            </div>

            {/* Content Type Selection */}
            <div className="space-y-3">
              <Label>Content Types *</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasVideo"
                    checked={hasVideo}
                    onCheckedChange={(checked) => setValue('hasVideo', checked as boolean)}
                  />
                  <Label htmlFor="hasVideo" className="flex items-center space-x-2">
                    <Video className="h-4 w-4" />
                    <span>Video Content</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasPDF"
                    checked={hasPDF}
                    onCheckedChange={(checked) => setValue('hasPDF', checked as boolean)}
                  />
                  <Label htmlFor="hasPDF" className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>PDF Content</span>
                  </Label>
                </div>
              </div>
              {errors.hasVideo && (
                <p className="text-red-500 text-sm mt-1">{errors.hasVideo.message}</p>
              )}
            </div>
          </div>

          {/* File Upload Sections */}
          <Tabs defaultValue={hasVideo ? "video" : "pdf"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="video" disabled={!hasVideo}>
                <Video className="h-4 w-4 mr-2" />
                Video Upload
              </TabsTrigger>
              <TabsTrigger value="pdf" disabled={!hasPDF}>
                <FileText className="h-4 w-4 mr-2" />
                PDF Upload
              </TabsTrigger>
            </TabsList>

            {/* Video Upload Tab */}
            <TabsContent value="video" className="space-y-4">
              {hasVideo && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Video Content Upload</h3>
                  {!selectedVideoFile ? (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                      onDrop={(e) => handleDrop(e, 'video')}
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
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'video')}
                            className="sr-only"
                          />
                          Choose Video File
                        </label>
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        MP4, WebM, MOV, AVI • Max 1.5GB
                      </p>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <File className="h-8 w-8 text-blue-500" />
                          <div>
                            <p className="font-medium">{videoUploadState.fileName}</p>
                            <p className="text-sm text-gray-500">
                              {videoUploadState.fileSize && formatFileSize(videoUploadState.fileSize)}
                              {videoUploadState.duration && ` • ${formatDuration(videoUploadState.duration)}`}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedVideoFile(null);
                            setVideoUploadState({ progress: 0, status: 'idle' });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {videoUploadState.status === 'uploading' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{videoUploadState.progress}%</span>
                          </div>
                          <Progress value={videoUploadState.progress} />
                        </div>
                      )}

                      {videoUploadState.status === 'completed' && (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span>Upload completed successfully</span>
                        </div>
                      )}

                      {videoUploadState.status === 'error' && (
                        <div className="text-red-600 text-sm">
                          <p>Upload failed: {videoUploadState.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* PDF Upload Tab */}
            <TabsContent value="pdf" className="space-y-4">
              {hasPDF && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">PDF Content Upload</h3>
                  {!selectedPDFFile ? (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                      onDrop={(e) => handleDrop(e, 'pdf')}
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
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'pdf')}
                            className="sr-only"
                          />
                          Choose PDF File
                        </label>
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        PDF • Max 100MB
                      </p>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-red-500" />
                          <div>
                            <p className="font-medium">{pdfUploadState.fileName}</p>
                            <p className="text-sm text-gray-500">
                              {pdfUploadState.fileSize && formatFileSize(pdfUploadState.fileSize)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPDFFile(null);
                            setPdfUploadState({ progress: 0, status: 'idle' });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {pdfUploadState.status === 'uploading' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{pdfUploadState.progress}%</span>
                          </div>
                          <Progress value={pdfUploadState.progress} />
                        </div>
                      )}

                      {pdfUploadState.status === 'completed' && (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span>Upload completed successfully</span>
                        </div>
                      )}

                      {pdfUploadState.status === 'error' && (
                        <div className="text-red-600 text-sm">
                          <p>Upload failed: {pdfUploadState.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" disabled={isSubmitting || (!hasVideo && !hasPDF)}>
              {isSubmitting ? 'Creating...' : 'Add Topic'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}