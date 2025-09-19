'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { FolderPlus, Upload, X, AlertTriangle, CheckCircle2, Shield, DollarSign, User, FileText } from 'lucide-react';
import { SecurityMetrics } from '@/components/ui/security-metrics';
import { checkRateLimit, generateFormToken } from '@/lib/security';

// Enhanced validation schema with security checks
const courseFolderSchema = z.object({
  title: z.string()
    .min(1, 'Course folder name is required')
    .max(200, 'Name too long')
    .regex(/^[a-zA-Z0-9\s&\-.,()]+$/, 'Name contains invalid characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description too long'),
  instructorName: z.string()
    .min(1, 'Instructor full name is required')
    .max(100, 'Instructor name too long')
    .regex(/^[a-zA-Z\s.]+$/, 'Name can only contain letters, spaces, and periods'),
  instructorProfession: z.string()
    .min(1, 'Instructor profession is required')
    .max(150, 'Profession too long'),
  instructorExperience: z.string()
    .min(20, 'Experience description must be at least 20 characters')
    .max(1000, 'Experience too long'),
  instructorProfileImage: z.string().optional(),
  priceCents: z.number()
    .min(0, 'Price must be positive')
    .max(100000, 'Price cannot exceed $1,000'),
});

type CourseFolderFormData = z.infer<typeof courseFolderSchema>;

// Security validation utilities
const validateTitle = (title: string): { isValid: boolean; message: string } => {
  if (!title) return { isValid: false, message: 'Course name is required' };
  if (title.length < 1) return { isValid: false, message: 'Course name is too short' };
  if (title.length > 200) return { isValid: false, message: 'Course name is too long' };
  if (!/^[a-zA-Z0-9\s&\-.,()]+$/.test(title)) {
    return { isValid: false, message: 'Course name contains invalid characters' };
  }
  return { isValid: true, message: 'Valid course name' };
};

const validatePrice = (price: number): { isValid: boolean; message: string } => {
  if (price < 0) return { isValid: false, message: 'Price cannot be negative' };
  if (price > 100000) return { isValid: false, message: 'Price cannot exceed $1,000' };
  if (price % 1 !== 0) return { isValid: false, message: 'Price must be a whole number' };
  return { isValid: true, message: 'Valid price' };
};

// Security indicator component for form validation
const SecurityIndicator = ({ isValid, message }: { isValid: boolean; message: string }) => {
  if (!message) return null;
  
  return (
    <div className={`flex items-center gap-1 mt-1 text-xs ${isValid ? 'text-green-600' : 'text-red-500'}`}>
      {isValid ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <AlertTriangle className="h-3 w-3" />
      )}
      <span>{message}</span>
    </div>
  );
};

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
  const [fieldValidations, setFieldValidations] = useState({
    title: { isValid: true, message: '' },
    price: { isValid: true, message: '' }
  });
  const [formToken] = useState(() => generateFormToken());
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    trigger
  } = useForm<CourseFolderFormData>({
    resolver: zodResolver(courseFolderSchema),
    defaultValues: {
      priceCents: 9900, // Default $99.00
    },
  });

  const watchedTitle = watch('title');
  const watchedPrice = watch('priceCents');

  // Real-time validation for title
  React.useEffect(() => {
    if (watchedTitle !== undefined) {
      const validation = validateTitle(watchedTitle);
      setFieldValidations(prev => ({
        ...prev,
        title: validation
      }));
    }
  }, [watchedTitle]);

  // Real-time validation for price
  React.useEffect(() => {
    if (watchedPrice !== undefined) {
      const validation = validatePrice(watchedPrice);
      setFieldValidations(prev => ({
        ...prev,
        price: validation
      }));
    }
  }, [watchedPrice]);

  // Calculate security metrics
  const getValidationCount = () => {
    let passed = 0;
    const title = watchedTitle || '';
    const price = watchedPrice || 0;
    
    if (title && fieldValidations.title.isValid && !errors.title) passed++;
    if (price && fieldValidations.price.isValid && !errors.priceCents) passed++;
    if (watch('description') && !errors.description) passed++;
    if (watch('instructorName') && !errors.instructorName) passed++;
    if (watch('instructorProfession') && !errors.instructorProfession) passed++;
    if (watch('instructorExperience') && !errors.instructorExperience) passed++;
    
    return { passed, total: 6 };
  };

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
              <Label htmlFor="title" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Course Folder Name *
              </Label>
              <div className="relative">
                <Input
                  id="title"
                  placeholder="e.g., Digital Marketing, Web Development, AI & Machine Learning"
                  {...register('title')}
                  className={`${errors.title ? 'border-red-500 focus:border-red-500' : 
                    fieldValidations.title.isValid && watchedTitle ? 'border-green-500 focus:border-green-500' : ''}`}
                />
              </div>
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.title.message}
                </p>
              )}
              {watchedTitle && !errors.title && (
                <SecurityIndicator 
                  isValid={fieldValidations.title.isValid} 
                  message={fieldValidations.title.message} 
                />
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
            <div className="space-y-4 border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Instructor Information
                <Shield className="h-4 w-4 text-green-600 ml-auto" />
              </h3>
              
              <div>
                <Label htmlFor="instructorName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Instructor Full Name *
                </Label>
                <Input
                  id="instructorName"
                  placeholder="e.g., Dr. Sarah Johnson, Alex Thompson"
                  {...register('instructorName')}
                  className={errors.instructorName ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}
                />
                {errors.instructorName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.instructorName.message}
                  </p>
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
              <Label htmlFor="priceCents" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Course Price (USD) *
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 font-medium">$</span>
                <Input
                  id="priceCents"
                  type="number"
                  min="0"
                  max="1000"
                  step="0.01"
                  placeholder="99.00"
                  {...register('priceCents', { 
                    valueAsNumber: true,
                    setValueAs: (value) => Math.round(value * 100) // Convert to cents
                  })}
                  className={`${errors.priceCents ? 'border-red-500 focus:border-red-500' : 
                    fieldValidations.price.isValid && watchedPrice ? 'border-green-500 focus:border-green-500' : ''}`}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">
                    = {formatPrice(watchedPrice || 0)}
                  </span>
                  {fieldValidations.price.isValid && watchedPrice && (
                    <Shield className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
              {errors.priceCents && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.priceCents.message}
                </p>
              )}
              {watchedPrice !== undefined && !errors.priceCents && (
                <SecurityIndicator 
                  isValid={fieldValidations.price.isValid} 
                  message={fieldValidations.price.message} 
                />
              )}
            </div>
          </div>

          {/* Security Metrics */}
          <SecurityMetrics 
            formType="course-creation" 
            validationsPassed={getValidationCount().passed}
            totalValidations={getValidationCount().total}
            showDetails={true}
          />

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