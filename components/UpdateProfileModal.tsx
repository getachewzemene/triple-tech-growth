"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
}

// Validation utilities
const validateEmail = (
  email: string,
): { isValid: boolean; message: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { isValid: false, message: "Email is required" };
  if (!emailRegex.test(email))
    return { isValid: false, message: "Please enter a valid email address" };
  return { isValid: true, message: "" };
};

const validatePhone = (
  phone: string,
): { isValid: boolean; message: string } => {
  if (!phone) return { isValid: true, message: "" }; // Optional field
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))) {
    return { isValid: false, message: "Please enter a valid phone number" };
  }
  return { isValid: true, message: "" };
};

const UpdateProfileModal = ({
  isOpen,
  onClose,
  onProfileUpdated,
}: UpdateProfileModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  const [errors, setErrors] = useState<Partial<ProfileData>>({});

  useEffect(() => {
    if (isOpen && user) {
      // Load existing profile data from enrolled courses or user data
      const enrolledCourses = safeLocalStorage.getItem("enrolledCourses", []);
      const firstCourse = enrolledCourses[0];

      setProfileData({
        fullName: firstCourse?.fullName || user.username || "",
        email: firstCourse?.email || "",
        phone: firstCourse?.phone || "",
        address: firstCourse?.address || "",
        bio: "", // This would come from user profile data if available
      });

      // Clear any previous errors/success messages
      setError("");
      setSuccess("");
      setErrors({});
    }
  }, [isOpen, user]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileData> = {};

    if (!profileData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    const emailValidation = validateEmail(profileData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    const phoneValidation = validatePhone(profileData.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // For now, we'll update the local storage data
      // In a real app, this would make an API call to update the user profile

      // Update enrolled courses data if it exists
      const enrolledCourses = safeLocalStorage.getItem("enrolledCourses", []);
      const updatedCourses = enrolledCourses.map((course: any) => ({
        ...course,
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
      }));

      safeLocalStorage.setItem("enrolledCourses", updatedCourses);

      // Save profile data separately
      safeLocalStorage.setItem("userProfile", profileData);

      setSuccess("Profile updated successfully!");

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });

      // Call the callback to refresh parent component
      if (onProfileUpdated) {
        onProfileUpdated();
      }

      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");

      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-light-blue">
            Update Profile
          </DialogTitle>
          <DialogDescription>
            Update your personal information and preferences
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="text-green-600">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={profileData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={`pl-10 ${errors.fullName ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.fullName && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-500">
                    {errors.fullName}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={profileData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-10 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.email && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-500">{errors.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={profileData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`pl-10 ${errors.phone ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.phone && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-500">{errors.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="address"
                type="text"
                placeholder="Enter your address"
                value={profileData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={profileData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} variant="gold">
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileModal;
