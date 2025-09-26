/**
 * Security utilities for form validation and URL sanitization
 */

// URL validation and sanitization
export const validateURL = (
  url: string,
): { isValid: boolean; message: string; sanitized?: string } => {
  if (!url) return { isValid: false, message: "URL is required" };

  try {
    // Remove potentially dangerous protocols
    const dangerousProtocols = [
      "javascript:",
      "data:",
      "vbscript:",
      "file:",
      "ftp:",
    ];
    const lowercaseUrl = url.toLowerCase();

    for (const protocol of dangerousProtocols) {
      if (lowercaseUrl.startsWith(protocol)) {
        return { isValid: false, message: "Invalid URL protocol" };
      }
    }

    // Ensure URL starts with http or https
    let sanitizedUrl = url.trim();
    if (
      !sanitizedUrl.startsWith("http://") &&
      !sanitizedUrl.startsWith("https://")
    ) {
      sanitizedUrl = `https://${sanitizedUrl}`;
    }

    // Validate URL format
    const urlObj = new URL(sanitizedUrl);

    // Block localhost and private IPs in production
    if (process.env.NODE_ENV === "production") {
      const hostname = urlObj.hostname.toLowerCase();
      if (
        hostname === "localhost" ||
        hostname.startsWith("127.") ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        hostname.startsWith("172.")
      ) {
        return { isValid: false, message: "Private URLs are not allowed" };
      }
    }

    return { isValid: true, message: "Valid URL", sanitized: sanitizedUrl };
  } catch (error) {
    return { isValid: false, message: "Invalid URL format" };
  }
};

// XSS protection for text inputs
export const sanitizeText = (text: string): string => {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

// Validate file uploads
export const validateFile = (
  file: File,
  allowedTypes: string[],
  maxSize: number,
): { isValid: boolean; message: string } => {
  if (!file) return { isValid: false, message: "File is required" };

  // Check file type
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  if (
    !allowedTypes.some(
      (type) => fileType.includes(type) || fileName.endsWith(type),
    )
  ) {
    return {
      isValid: false,
      message: `File type not allowed. Allowed: ${allowedTypes.join(", ")}`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return {
      isValid: false,
      message: `File too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  // Check for suspicious file names
  const suspiciousPatterns = [
    ".exe",
    ".bat",
    ".cmd",
    ".scr",
    ".js",
    ".vbs",
    ".jar",
  ];
  if (suspiciousPatterns.some((pattern) => fileName.includes(pattern))) {
    return {
      isValid: false,
      message: "File type not allowed for security reasons",
    };
  }

  return { isValid: true, message: "File is valid" };
};

// Rate limiting check (client-side indication)
export const checkRateLimit = (
  key: string,
  maxAttempts: number,
  timeWindow: number,
): { isAllowed: boolean; remainingAttempts: number } => {
  const now = Date.now();
  const storageKey = `rate_limit_${key}`;

  try {
    const stored = localStorage.getItem(storageKey);
    const attempts = stored ? JSON.parse(stored) : [];

    // Remove old attempts outside time window
    const validAttempts = attempts.filter(
      (timestamp: number) => now - timestamp < timeWindow,
    );

    if (validAttempts.length >= maxAttempts) {
      return { isAllowed: false, remainingAttempts: 0 };
    }

    // Add current attempt
    validAttempts.push(now);
    localStorage.setItem(storageKey, JSON.stringify(validAttempts));

    return {
      isAllowed: true,
      remainingAttempts: maxAttempts - validAttempts.length,
    };
  } catch (error) {
    // If localStorage fails, allow the request
    return { isAllowed: true, remainingAttempts: maxAttempts - 1 };
  }
};

// CSRF-like token generation for forms
export const generateFormToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
};

// Validate form token
export const validateFormToken = (
  token: string,
  storedToken: string,
): boolean => {
  return token === storedToken && token.length === 64;
};

// Security headers check
export const getSecurityHeaders = () => ({
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
});

// Input validation for common patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  alphanumeric: /^[a-zA-Z0-9\s\-_.,()&]+$/,
  nameOnly: /^[a-zA-Z\s.'-]+$/,
  priceFormat: /^\d+(\.\d{1,2})?$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
};

// Password strength checker
export const checkPasswordStrength = (
  password: string,
): { score: number; feedback: string[] } => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push("At least 8 characters");

  if (password.length >= 12) score += 1;
  else if (password.length >= 8) feedback.push("12+ characters recommended");

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  else feedback.push("Mix of uppercase and lowercase");

  if (/\d/.test(password)) score += 1;
  else feedback.push("Include numbers");

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push("Include special characters");

  return { score, feedback };
};
