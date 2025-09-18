'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { FolderPlus, Upload, X } from 'lucide-react';

// Zod validation schema for course folder creation
const courseFolderSchema = z.object({
  title: z.string().min(1, 'Course folder name is required').max(200, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  instructorName: z.string().min(1, 'Instructor full name is required').max(100, 'Instructor name too long'),
  instructorProfession: z.string().min(1, 'Instructor profession is required').max(150, 'Profession too long'),
  instructorExperience: z.string().min(1, 'Instructor experience is required').max(1000, 'Experience too long'),
  instructorProfileImage: z.string().optional(),
  priceCents: z.number().min(0, 'Price must be positive'),
});

type CourseFolderFormData = z.infer<typeof courseFolderSchema>;

interface CourseFolder {
  id: string;
  title: string;
  description: string;
  instructor: string; // Keep for backward compatibility - will be constructed from new fields
  instructorName: string;
  instructorProfession: string;
  instructorExperience: string;
  instructorProfileImage?: string;
  priceCents: number;
  type: 'folder';
  topicsCount: number;
  createdAt: string;
}

interface AddCourseFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseFolderSaved: (courseFolder: CourseFolder) => void;
}

export default function AddCourseFolderModal({ isOpen, onClose, onCourseFolderSaved }: AddCourseFolderModalProps) {
  const { toast } = useToast();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CourseFolderFormData>({
    resolver: zodResolver(courseFolderSchema),
    defaultValues: {
      priceCents: 0,
    },
  });

  const priceValue = watch('priceCents');

  // Handle profile image file selection
  const handleProfileImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file (PNG, JPG, etc.)',
          variant: 'destructive',
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Profile image must be smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }

      setProfileImageFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  // Remove profile image
  const removeProfileImage = () => {
    setProfileImageFile(null);
    if (profileImagePreview) {
      URL.revokeObjectURL(profileImagePreview);
      setProfileImagePreview(null);
    }
  };

  const onSubmit = async (data: CourseFolderFormData) => {
    try {
      // Create course folder data
      const courseFolder: CourseFolder = {
        id: `folder_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        title: data.title,
        description: data.description,
        instructor: `${data.instructorName} - ${data.instructorProfession}`, // Backward compatibility
        instructorName: data.instructorName,
        instructorProfession: data.instructorProfession,
        instructorExperience: data.instructorExperience,
        instructorProfileImage: data.instructorProfileImage,
        priceCents: data.priceCents,
        type: 'folder',
        topicsCount: 0,
        createdAt: new Date().toISOString(),
      };

      // Call the callback to save the course folder
      onCourseFolderSaved(courseFolder);

      toast({
        title: 'Course folder created',
        description: `${data.title} course folder has been created successfully. You can now add topics to it.`,
      });

      // Reset form and close modal
      reset();
      removeProfileImage();
      onClose();
    } catch (error: any) {
      console.error('Error creating course folder:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create course folder. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    reset();
    removeProfileImage();
    onClose();
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FolderPlus className="h-5 w-5" />
            <span>Create Course Folder</span>
          </DialogTitle>
          <DialogDescription>
            Create a main course folder that will contain multiple topics. Each topic can have video content, PDF content, or both.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Course Folder Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Course Folder Name *</Label>
              <Input
                id="title"
                placeholder="e.g., Digital Marketing, Web Development, AI & Machine Learning"
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Course Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a comprehensive description of what this course covers, target audience, and learning outcomes..."
                rows={4}
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Instructor Information Section */}
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">Instructor Information</h3>
              
              <div>
                <Label htmlFor="instructorName">Instructor Full Name *</Label>
                <Input
                  id="instructorName"
                  placeholder="e.g., Dr. Sarah Johnson, Alex Thompson"
                  {...register('instructorName')}
                  className={errors.instructorName ? 'border-red-500' : ''}
                />
                {errors.instructorName && (
                  <p className="text-red-500 text-sm mt-1">{errors.instructorName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="instructorProfession">Profession/Title *</Label>
                <Input
                  id="instructorProfession"
                  placeholder="e.g., Senior Full-Stack Developer, Digital Marketing Expert, AI Research Scientist"
                  {...register('instructorProfession')}
                  className={errors.instructorProfession ? 'border-red-500' : ''}
                />
                {errors.instructorProfession && (
                  <p className="text-red-500 text-sm mt-1">{errors.instructorProfession.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="instructorExperience">Experience & Background *</Label>
                <Textarea
                  id="instructorExperience"
                  placeholder="Describe the instructor's experience, qualifications, achievements, and relevant background..."
                  rows={3}
                  {...register('instructorExperience')}
                  className={errors.instructorExperience ? 'border-red-500' : ''}
                />
                {errors.instructorExperience && (
                  <p className="text-red-500 text-sm mt-1">{errors.instructorExperience.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="profileImage">Profile Image (Optional)</Label>
                <div className="space-y-2">
                  {!profileImagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <div className="text-sm text-gray-600 mb-2">
                        Upload instructor profile image
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageSelect}
                        className="max-w-xs"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-4 border rounded-lg p-3 bg-white">
                      <img
                        src={profileImagePreview}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {profileImageFile?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {profileImageFile && `${(profileImageFile.size / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeProfileImage}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="priceCents">Course Price (USD) *</Label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">$</span>
                <Input
                  id="priceCents"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="99.00"
                  {...register('priceCents', { 
                    valueAsNumber: true,
                    setValueAs: (value) => Math.round(value * 100) // Convert to cents
                  })}
                  className={errors.priceCents ? 'border-red-500' : ''}
                />
                <span className="text-sm text-gray-500">
                  = {formatPrice(priceValue || 0)}
                </span>
              </div>
              {errors.priceCents && (
                <p className="text-red-500 text-sm mt-1">{errors.priceCents.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Course Folder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}