"use client";

import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Lock,
  User,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SecurityMetrics } from "@/components/ui/security-metrics";
import { checkRateLimit, generateFormToken } from "@/lib/security";
import Image from "next/image";

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Security validation utilities
const validateEmail = (
  email: string,
): { isValid: boolean; message: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { isValid: false, message: "Email is required" };
  if (!emailRegex.test(email))
    return { isValid: false, message: "Please enter a valid email address" };
  return { isValid: true, message: "" };
};

const validatePassword = (
  password: string,
): { isValid: boolean; message: string; strength: number } => {
  if (!password)
    return { isValid: false, message: "Password is required", strength: 0 };
  if (password.length < 8)
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
      strength: 1,
    };

  let strength = 1;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength < 3)
    return {
      isValid: false,
      message: "Password must contain uppercase, lowercase, and number",
      strength,
    };
  return { isValid: true, message: "Strong password", strength };
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

// Security indicator component
const SecurityIndicator = ({ level }: { level: number }) => {
  const getColor = () => {
    if (level >= 4) return "text-green-600";
    if (level >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getMessage = () => {
    if (level >= 4) return "Very Strong";
    if (level >= 3) return "Strong";
    if (level >= 2) return "Fair";
    return "Weak";
  };

  return (
    <div className="flex items-center gap-2 mt-1">
      <Shield className={`h-4 w-4 ${getColor()}`} />
      <span className={`text-xs font-medium ${getColor()}`}>
        {getMessage()}
      </span>
      <div className="flex gap-1 ml-auto">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i <= level ? getColor().replace("text-", "bg-") : "bg-gray-200"}`}
          />
        ))}
      </div>
    </div>
  );
};

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserAuthModal = ({ isOpen, onClose }: UserAuthModalProps) => {
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login, registerUser } = useAuth();
  const { toast } = useToast();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" });

  // Registration form state
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [signupErrors, setSignupErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotErrors, setForgotErrors] = useState({ email: "" });

  // Security metrics tracking
  const [formToken] = useState(() => generateFormToken());
  const [rateLimitStatus, setRateLimitStatus] = useState({
    remaining: 5,
    isAllowed: true,
  });

  // Calculate security metrics
  const getLoginValidationCount = () => {
    let passed = 0;
    if (loginData.email && !loginErrors.email) passed++;
    if (loginData.password && !loginErrors.password) passed++;
    return { passed, total: 2 };
  };

  const getSignupValidationCount = () => {
    let passed = 0;
    if (signupData.fullName && !signupErrors.fullName) passed++;
    if (signupData.email && !signupErrors.email) passed++;
    if (signupData.password && !signupErrors.password && passwordStrength >= 3)
      passed++;
    if (signupData.confirmPassword && !signupErrors.confirmPassword) passed++;
    if (!signupData.phone || !signupErrors.phone) passed++; // Optional field
    return { passed, total: 5 };
  };

  // Real-time validation functions
  const validateLoginField = (field: string, value: string) => {
    const newErrors = { ...loginErrors };

    switch (field) {
      case "email":
        const emailValidation = validateEmail(value);
        newErrors.email = emailValidation.isValid
          ? ""
          : emailValidation.message;
        break;
      case "password":
        newErrors.password = value ? "" : "Password is required";
        break;
    }

    setLoginErrors(newErrors);
  };

  const validateSignupField = (field: string, value: string) => {
    const newErrors = { ...signupErrors };

    switch (field) {
      case "fullName":
        if (!value.trim()) {
          newErrors.fullName = "Full name is required";
        } else if (value.trim().length < 2) {
          newErrors.fullName = "Name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          newErrors.fullName = "Name can only contain letters and spaces";
        } else {
          newErrors.fullName = "";
        }
        break;
      case "email":
        const emailValidation = validateEmail(value);
        newErrors.email = emailValidation.isValid
          ? ""
          : emailValidation.message;
        break;
      case "password":
        const passwordValidation = validatePassword(value);
        newErrors.password = passwordValidation.isValid
          ? ""
          : passwordValidation.message;
        setPasswordStrength(passwordValidation.strength);

        // Re-validate confirm password if it exists
        if (signupData.confirmPassword) {
          newErrors.confirmPassword =
            value === signupData.confirmPassword
              ? ""
              : "Passwords do not match";
        }
        break;
      case "confirmPassword":
        newErrors.confirmPassword =
          value === signupData.password ? "" : "Passwords do not match";
        break;
      case "phone":
        const phoneValidation = validatePhone(value);
        newErrors.phone = phoneValidation.isValid
          ? ""
          : phoneValidation.message;
        break;
    }

    setSignupErrors(newErrors);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check rate limiting
    const rateCheck = checkRateLimit("login", 5, 15 * 60 * 1000); // 5 attempts per 15 minutes
    setRateLimitStatus({
      remaining: rateCheck.remainingAttempts,
      isAllowed: rateCheck.isAllowed,
    });

    if (!rateCheck.isAllowed) {
      setError("Too many login attempts. Please try again in 15 minutes.");
      toast({
        title: "Rate limit exceeded",
        description:
          "Too many login attempts. Please wait before trying again.",
        variant: "destructive",
      });
      return;
    }

    // Validate all fields
    const emailValidation = validateEmail(loginData.email);
    const newErrors = {
      email: emailValidation.isValid ? "" : emailValidation.message,
      password: loginData.password ? "" : "Password is required",
    };

    setLoginErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      setError("Please fix the errors above");
      return;
    }

    const success = login(loginData.email, loginData.password);
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        variant: "default",
      });
      onClose();
      // Reset form
      setLoginData({ email: "", password: "" });
      setLoginErrors({ email: "", password: "" });
    } else {
      setError("Invalid email or password");
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate all fields
    const emailValidation = validateEmail(signupData.email);
    const passwordValidation = validatePassword(signupData.password);
    const phoneValidation = validatePhone(signupData.phone);

    const validations = {
      fullName: signupData.fullName.trim() ? "" : "Full name is required",
      email: emailValidation.isValid ? "" : emailValidation.message,
      password: passwordValidation.isValid ? "" : passwordValidation.message,
      confirmPassword:
        signupData.password === signupData.confirmPassword
          ? ""
          : "Passwords do not match",
      phone: phoneValidation.isValid ? "" : phoneValidation.message,
      address: "",
    };

    setSignupErrors(validations);

    const hasErrors = Object.values(validations).some((error) => error !== "");
    if (hasErrors) {
      setError("Please fix the errors above");
      return;
    }

    // Check if user already exists
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]",
    );
    const existingUser = registeredUsers.find(
      (u: { email?: string }) => u.email === signupData.email,
    );

    if (existingUser) {
      setSignupErrors((prev) => ({
        ...prev,
        email: "An account with this email already exists",
      }));
      setError("An account with this email already exists");
      return;
    }

    try {
      registerUser(signupData);
      toast({
        title: "Account created successfully!",
        description: "Welcome to Triple Technologies. You are now logged in.",
        variant: "default",
      });

      setTimeout(() => {
        onClose();
        // Reset form
        setSignupData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
        });
        setSignupErrors({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
        });
        setPasswordStrength(0);
      }, 1000);
    } catch (err) {
      setError("Failed to create account. Please try again.");
      toast({
        title: "Registration failed",
        description:
          "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailValidation = validateEmail(forgotEmail);
    setForgotErrors({
      email: emailValidation.isValid ? "" : emailValidation.message,
    });

    if (!emailValidation.isValid) {
      setError("Please enter a valid email address");
      return;
    }

    // In a real app, this would send a password reset email
    toast({
      title: "Password reset sent",
      description: "Check your email for password reset instructions.",
      variant: "default",
    });

    setSuccess(
      "Password reset instructions have been sent to your email address.",
    );
    setForgotEmail("");
    setForgotErrors({ email: "" });
    setTimeout(() => {
      setShowForgotPassword(false);
      setSuccess("");
    }, 2000);
  };

  const resetForms = () => {
    setLoginData({ email: "", password: "" });
    setSignupData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
    });
    setForgotEmail("");
    setError("");
    setSuccess("");
    setLoginErrors({ email: "", password: "" });
    setSignupErrors({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
    });
    setForgotErrors({ email: "" });
    setPasswordStrength(0);
    setShowForgotPassword(false);
    setActiveTab("login");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForms();
      onClose();
    }
  };

  // Input change handlers with validation
  const handleLoginChange = (field: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    validateLoginField(field, value);
  };

  const handleSignupChange = (field: string, value: string) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
    validateSignupField(field, value);
  };

  const handleForgotEmailChange = (value: string) => {
    setForgotEmail(value);
    const emailValidation = validateEmail(value);
    setForgotErrors({
      email: emailValidation.isValid ? "" : emailValidation.message,
    });
  };

  if (showForgotPassword) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        {/* Slightly wider modal to accommodate inputs in some locales */}
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="Triple Technologies Logo"
                width={64}
                height={64}
              />
            </div>
            <DialogTitle className="text-2xl font-bold text-light-blue">
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you password reset
              instructions
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription className="text-green-600">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => handleForgotEmailChange(e.target.value)}
                  className={`pl-10 ${forgotErrors.email ? "border-red-500 focus:border-red-500" : ""}`}
                />
                {forgotErrors.email && forgotEmail && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-500">
                      {forgotErrors.email}
                    </span>
                  </div>
                )}
                {!forgotErrors.email &&
                  forgotEmail &&
                  validateEmail(forgotEmail).isValid && (
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500">
                        Valid email
                      </span>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="gold" className="flex-1">
                Send Reset Link
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1"
              >
                Back to Login
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* When on the login tab we hide the vertical scrollbar; for signup/forgot we allow scrolling */}
      {/* Keep modal scrollable and add safe padding at bottom so actions (forgot link) are visible on small screens */}
      <DialogContent
        className={`sm:max-w-lg overflow-y-auto max-h-[90vh] pb-12`}
      >
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Triple Technologies Logo"
              width={64}
              height={64}
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-light-blue">
            Welcome
          </DialogTitle>
          <DialogDescription>
            Join our community or sign in to your account
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => handleLoginChange("email", e.target.value)}
                    className={`pl-10 ${loginErrors.email ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  {loginErrors.email && loginData.email && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-500">
                        {loginErrors.email}
                      </span>
                    </div>
                  )}
                  {!loginErrors.email &&
                    loginData.email &&
                    validateEmail(loginData.email).isValid && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500">
                          Valid email
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      handleLoginChange("password", e.target.value)
                    }
                    className={`pl-10 pr-10 ${loginErrors.password ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-2.5 p-1 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showLoginPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  {loginErrors.password && loginData.password && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-500">
                        {loginErrors.password}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Metrics */}
              <SecurityMetrics
                formType="login"
                validationsPassed={getLoginValidationCount().passed}
                totalValidations={getLoginValidationCount().total}
                rateLimitRemaining={rateLimitStatus.remaining}
                showDetails={false}
              />

              <Button
                type="submit"
                variant="gold"
                className="w-full"
                disabled={!rateLimitStatus.isAllowed}
              >
                Sign In
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-light-blue hover:text-light-blue/80 dark:text-card-foreground dark:hover:text-card-foreground/80"
                >
                  Forgot your password?
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription className="text-green-600">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signupData.fullName}
                    onChange={(e) =>
                      handleSignupChange("fullName", e.target.value)
                    }
                    className={`pl-10 ${signupErrors.fullName ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  {signupErrors.fullName && signupData.fullName && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-500">
                        {signupErrors.fullName}
                      </span>
                    </div>
                  )}
                  {!signupErrors.fullName &&
                    signupData.fullName &&
                    signupData.fullName.length >= 2 && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500">
                          Valid name
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) =>
                      handleSignupChange("email", e.target.value)
                    }
                    className={`pl-10 ${signupErrors.email ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  {signupErrors.email && signupData.email && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-500">
                        {signupErrors.email}
                      </span>
                    </div>
                  )}
                  {!signupErrors.email &&
                    signupData.email &&
                    validateEmail(signupData.email).isValid && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500">
                          Valid email
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="Enter your phone number (optional)"
                    value={signupData.phone}
                    onChange={(e) =>
                      handleSignupChange("phone", e.target.value)
                    }
                    className={`pl-10 ${signupErrors.phone ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  {signupErrors.phone && signupData.phone && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-500">
                        {signupErrors.phone}
                      </span>
                    </div>
                  )}
                  {!signupErrors.phone &&
                    signupData.phone &&
                    validatePhone(signupData.phone).isValid && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500">
                          Valid phone number
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-address"
                    type="text"
                    placeholder="Enter your address (optional)"
                    value={signupData.address}
                    onChange={(e) =>
                      handleSignupChange("address", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={signupData.password}
                    onChange={(e) =>
                      handleSignupChange("password", e.target.value)
                    }
                    className={`pl-10 pr-10 ${signupErrors.password ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-2.5 p-1 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showSignupPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showSignupPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {signupData.password && (
                  <SecurityIndicator level={passwordStrength} />
                )}
                {signupErrors.password && signupData.password && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-500">
                      {signupErrors.password}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-confirm-password"
                    type={showSignupConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      handleSignupChange("confirmPassword", e.target.value)
                    }
                    className={`pl-10 pr-10 ${signupErrors.confirmPassword ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupConfirm(!showSignupConfirm)}
                    className="absolute right-3 top-2.5 p-1 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showSignupConfirm ? "Hide password" : "Show password"
                    }
                  >
                    {showSignupConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {signupErrors.confirmPassword && signupData.confirmPassword && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-500">
                      {signupErrors.confirmPassword}
                    </span>
                  </div>
                )}
                {!signupErrors.confirmPassword &&
                  signupData.confirmPassword &&
                  signupData.password === signupData.confirmPassword &&
                  signupData.password && (
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500">
                        Passwords match
                      </span>
                    </div>
                  )}
              </div>

              {/* Security Metrics */}
              <SecurityMetrics
                formType="signup"
                validationsPassed={getSignupValidationCount().passed}
                totalValidations={getSignupValidationCount().total}
                rateLimitRemaining={rateLimitStatus.remaining}
                showDetails={false}
              />

              <Button
                type="submit"
                variant="gold"
                className="w-full"
                disabled={!rateLimitStatus.isAllowed}
              >
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserAuthModal;
