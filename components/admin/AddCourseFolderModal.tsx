'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { FolderPlus } from 'lucide-react';

// Zod validation schema for course folder creation
const courseFolderSchema = z.object({
  title: z.string().min(1, 'Course folder name is required').max(200, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  instructor: z.string().min(1, 'Instructor name is required').max(100, 'Instructor name too long'),
  priceCents: z.number().min(0, 'Price must be positive'),
});

type CourseFolderFormData = z.infer<typeof courseFolderSchema>;

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

interface AddCourseFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseFolderSaved: (courseFolder: CourseFolder) => void;
}

export default function AddCourseFolderModal({ isOpen, onClose, onCourseFolderSaved }: AddCourseFolderModalProps) {
  const { toast } = useToast();
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

  const onSubmit = async (data: CourseFolderFormData) => {
    try {
      // Create course folder data
      const courseFolder: CourseFolder = {
        id: `folder_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        title: data.title,
        description: data.description,
        instructor: data.instructor,
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

            <div>
              <Label htmlFor="instructor">Instructor Name *</Label>
              <Input
                id="instructor"
                placeholder="e.g., John Smith, Dr. Jane Doe"
                {...register('instructor')}
                className={errors.instructor ? 'border-red-500' : ''}
              />
              {errors.instructor && (
                <p className="text-red-500 text-sm mt-1">{errors.instructor.message}</p>
              )}
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