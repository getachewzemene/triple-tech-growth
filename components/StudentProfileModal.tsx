"use client";

import { useState, useEffect, useRef } from "react";
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
  Camera,
  Upload,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";

interface StudentProfileModalProps {
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
  profilePicture: string;
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

const StudentProfileModal = ({
  isOpen,
  onClose,
  onProfileUpdated,
}: StudentProfileModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    profilePicture: "",
  });

  const [errors, setErrors] = useState<Partial<ProfileData>>({});

  useEffect(() => {
    if (isOpen && user) {
      // Load existing profile data
      const savedProfile = safeLocalStorage.getItem("userProfile", null);
      const enrolledCourses = safeLocalStorage.getItem("enrolledCourses", []);
      const firstCourse = enrolledCourses[0];

      setProfileData({
        fullName: savedProfile?.fullName || firstCourse?.fullName || user.username || "",
        email: savedProfile?.email || firstCourse?.email || "",
        phone: savedProfile?.phone || firstCourse?.phone || "",
        address: savedProfile?.address || firstCourse?.address || "",
        bio: savedProfile?.bio || "",
        profilePicture: savedProfile?.profilePicture || "",
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, GIF)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfileData((prev) => ({ ...prev, profilePicture: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto pb-12">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl font-bold text-light-blue">
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your personal information and profile picture
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

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center space-y-3">
            <Label className="text-sm font-medium">Profile Picture</Label>
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center border-4 border-white dark:border-gray-600 shadow-lg">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-blue-400 dark:text-gray-400" />
                )}
              </div>
              {profileData.profilePicture && (
                <button
                  type="button"
                  onClick={removeProfilePicture}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-md"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click the camera icon to upload (max 5MB)
            </p>
          </div>

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
              {!errors.fullName && profileData.fullName.trim().length >= 2 && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">Valid name</span>
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
              {!errors.email && profileData.email && validateEmail(profileData.email).isValid && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">Valid email</span>
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
              {!errors.phone && profileData.phone && validatePhone(profileData.phone).isValid && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">Valid phone number</span>
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
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileModal;
