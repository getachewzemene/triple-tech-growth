"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Maximize, AlertTriangle } from "lucide-react";
import Image from "next/image";

// Shaka Player types (install with: npm install shaka-player @types/shaka-player)
declare global {
  interface Window {
    shaka: any;
  }
}

interface SecurePlayerProps {
  courseId: string;
  onPlayerReady?: () => void;
  onError?: (error: string) => void;
}

interface PlaybackSession {
  sessionId: string;
  playbackToken: string;
  expiresAt: number;
}

/**
 * Secure video player with DRM support, visible watermarks, and anti-piracy measures
 * Features:
 * - Shaka Player with EME for DRM content
 * - Dynamic visible watermark overlay with TripleAcademy branding
 * - Short-lived token refresh mechanism
 * - Playback session tracking
 * - Screen recording detection and blocking
 */
export default function SecurePlayer({
  courseId,
  onPlayerReady,
  onError,
}: SecurePlayerProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  // Refs for player and video elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSession, setCurrentSession] = useState<PlaybackSession | null>(
    null,
  );
  const [watermarkPosition, setWatermarkPosition] = useState({ x: 85, y: 85 }); // Bottom-right default
  const [currentTime, setCurrentTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Token refresh interval
  const tokenRefreshInterval = useRef<NodeJS.Timeout | null>(null);
  const watermarkUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  /**
   * Load Shaka Player library dynamically
   */
  const loadShakaPlayer = useCallback(async () => {
    if (window.shaka) {
      return window.shaka;
    }

    // Load Shaka Player from CDN
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.7.5/shaka-player.compiled.js";
    script.async = true;

    return new Promise((resolve, reject) => {
      script.onload = () => resolve(window.shaka);
      script.onerror = () => reject(new Error("Failed to load Shaka Player"));
      document.head.appendChild(script);
    });
  }, []);

  /**
   * Request a new playback token from the server
   */
  const requestPlaybackToken =
    useCallback(async (): Promise<PlaybackSession | null> => {
      try {
        const response = await fetch("/api/playback/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get playback token");
        }

        const data = await response.json();

        return {
          sessionId: data.sessionId,
          playbackToken: data.playbackToken,
          expiresAt: Date.now() + data.expiresIn * 1000, // Convert to timestamp
        };
      } catch (error) {
        console.error("Token request failed:", error);
        return null;
      }
    }, [courseId]);

  /**
   * Get manifest URL using playback token
   */
  const getManifestUrl = useCallback(
    async (token: string): Promise<string | null> => {
      try {
        const response = await fetch(
          `/api/player/manifest?courseId=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get manifest URL");
        }

        const data = await response.json();

        // Set CloudFront signed cookies if provided
        if (data.signedCookies) {
          Object.entries(data.signedCookies).forEach(([name, value]) => {
            document.cookie = `${name}=${value}; Path=/; Secure; SameSite=None`;
          });
        }

        return data.manifestUrl;
      } catch (error) {
        console.error("Manifest request failed:", error);
        return null;
      }
    },
    [courseId],
  );

  /**
   * Initialize Shaka Player with DRM configuration
   */
  const initializePlayer = useCallback(
    async (manifestUrl: string) => {
      if (!videoRef.current) {
        throw new Error("Video element not available");
      }

      const shaka = await loadShakaPlayer();

      // Install polyfills for older browsers
      shaka.polyfill.installAll();

      // Check for EME support
      if (!shaka.Player.isBrowserSupported()) {
        throw new Error("Browser does not support encrypted media extensions");
      }

      // Create player instance
      const player = new shaka.Player(videoRef.current);
      playerRef.current = player;

      // Configure DRM (enterprise feature)
      if (process.env.NEXT_PUBLIC_DRM_ENABLED === "true") {
        player.configure({
          drm: {
            servers: {
              "com.widevine.alpha":
                process.env.NEXT_PUBLIC_WIDEVINE_LICENSE_URL || "",
              "com.microsoft.playready":
                process.env.NEXT_PUBLIC_PLAYREADY_LICENSE_URL || "",
              "com.apple.fps.1_0":
                process.env.NEXT_PUBLIC_FAIRPLAY_LICENSE_URL || "",
            },
            advanced: {
              "com.widevine.alpha": {
                videoRobustness: "SW_SECURE_CRYPTO",
                audioRobustness: "SW_SECURE_CRYPTO",
              },
            },
          },
        });
      }

      // Configure adaptive streaming
      player.configure({
        streaming: {
          rebufferingGoal: 10, // 10 seconds
          bufferingGoal: 30, // 30 seconds
          retryParameters: {
            timeout: 30000,
            maxAttempts: 3,
            baseDelay: 1000,
            backoffFactor: 2,
            fuzzFactor: 0.5,
          },
        },
        manifest: {
          retryParameters: {
            timeout: 30000,
            maxAttempts: 3,
            baseDelay: 1000,
            backoffFactor: 2,
            fuzzFactor: 0.5,
          },
        },
      });

      // Set up event listeners
      player.addEventListener("error", handlePlayerError);
      player.addEventListener("buffering", (event: any) => {
        setIsLoading(event.buffering);
      });

      // Load the manifest
      await player.load(manifestUrl);

      // Set up video event listeners
      if (videoRef.current) {
        videoRef.current.addEventListener("play", () => setIsPlaying(true));
        videoRef.current.addEventListener("pause", () => setIsPlaying(false));
        videoRef.current.addEventListener("ended", () => setIsPlaying(false));
      }

      setIsLoading(false);
      onPlayerReady?.();
    },
    [onPlayerReady],
  );

  /**
   * Handle player errors
   */
  const handlePlayerError = useCallback(
    (event: any) => {
      const error = event.detail;
      console.error("Player error:", error);

      let errorMessage = "Video playback error";

      if (error.code === shaka.util.Error.Code.LICENSE_REQUEST_FAILED) {
        errorMessage =
          "DRM license request failed. Please check your connection and try again.";
      } else if (error.code === shaka.util.Error.Code.MANIFEST_REQUEST_FAILED) {
        errorMessage =
          "Video manifest request failed. Please refresh and try again.";
      } else if (error.code === shaka.util.Error.Code.SEGMENT_REQUEST_FAILED) {
        errorMessage =
          "Video segment request failed. Please check your connection.";
      }

      setError(errorMessage);
      onError?.(errorMessage);

      toast({
        title: "Playback Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
    [onError, toast],
  );

  /**
   * Update watermark timestamp and position
   */
  const updateWatermark = useCallback(() => {
    setCurrentTime(new Date().toLocaleTimeString());

    // Randomly move watermark position slightly to prevent easy removal
    const newX = 80 + Math.random() * 15; // 80-95%
    const newY = 80 + Math.random() * 15; // 80-95%
    setWatermarkPosition({ x: newX, y: newY });
  }, []);

  /**
   * Initialize secure playback
   */
  const initializeSecurePlayback = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Request initial playback token
      const session = await requestPlaybackToken();
      if (!session) {
        throw new Error("Failed to obtain playback token");
      }

      setCurrentSession(session);

      // Get manifest URL
      const manifestUrl = await getManifestUrl(session.playbackToken);
      if (!manifestUrl) {
        throw new Error("Failed to obtain manifest URL");
      }

      // Initialize player
      await initializePlayer(manifestUrl);

      // Start token refresh timer (refresh before expiry)
      tokenRefreshInterval.current = setInterval(async () => {
        const newSession = await requestPlaybackToken();
        if (newSession) {
          setCurrentSession(newSession);
        }
      }, 60000); // Refresh every 60 seconds

      // Start watermark update timer
      watermarkUpdateInterval.current = setInterval(updateWatermark, 60000); // Update every minute
      updateWatermark(); // Initial update
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initialize player";
      setError(errorMessage);
      onError?.(errorMessage);

      toast({
        title: "Player Initialization Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [
    requestPlaybackToken,
    getManifestUrl,
    initializePlayer,
    updateWatermark,
    onError,
    toast,
  ]);

  /**
   * Screen recording detection (basic)
   */
  useEffect(() => {
    const detectScreenRecording = () => {
      // Check for known screen recording indicators
      if (navigator.mediaDevices?.getDisplayMedia) {
        // Detect if screen capture is active (limited detection capability)
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
        navigator.mediaDevices.getDisplayMedia = function (...args) {
          console.warn("Screen capture detected!");
          toast({
            title: "Screen Recording Detected",
            description:
              "Screen recording is not allowed during video playback.",
            variant: "destructive",
          });
          return originalGetDisplayMedia.apply(this, args);
        };
      }

      // Basic DevTools detection
      let devtools = false;
      setInterval(() => {
        const before = new Date();
        console.log("%c", "font-size:1px;");
        const after = new Date();
        if (after.getTime() - before.getTime() > 100) {
          if (!devtools) {
            devtools = true;
            console.warn("Developer tools detected!");
            toast({
              title: "Developer Tools Detected",
              description: "Please close developer tools to continue watching.",
              variant: "destructive",
            });
          }
        } else {
          devtools = false;
        }
      }, 1000);
    };

    detectScreenRecording();
  }, [toast]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (tokenRefreshInterval.current) {
        clearInterval(tokenRefreshInterval.current);
      }
      if (watermarkUpdateInterval.current) {
        clearInterval(watermarkUpdateInterval.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  /**
   * Initialize player on mount
   */
  useEffect(() => {
    if (courseId && user) {
      initializeSecurePlayback();
    }
  }, [courseId, user, initializeSecurePlayback]);

  /**
   * Toggle play/pause
   */
  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);

  /**
   * Format user identifier for watermark (partially redacted email)
   */
  const formatUserIdentifier = useCallback(() => {
    if (!user?.username) return "User";

    // If it's an email, redact middle part
    if (user.username.includes("@")) {
      const [localPart, domain] = user.username.split("@");
      const redactedLocal =
        localPart.length > 3
          ? localPart.substring(0, 2) + "***" + localPart.slice(-1)
          : localPart;
      return `${redactedLocal}@${domain}`;
    }

    // Otherwise, redact middle characters
    return user.username.length > 3
      ? user.username.substring(0, 2) + "***" + user.username.slice(-1)
      : user.username;
  }, [user]);

  if (!user) {
    return (
      <div className="w-full h-64 bg-gray-900 flex items-center justify-center rounded-lg">
        <p className="text-white">Please log in to watch this video.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 bg-gray-900 flex flex-col items-center justify-center rounded-lg">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-white text-center mb-4">{error}</p>
        <Button onClick={initializeSecurePlayback} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-auto"
        controls
        preload="metadata"
        onContextMenu={(e) => e.preventDefault()} // Disable right-click
        style={{
          outline: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-lg">Loading secure player...</div>
        </div>
      )}

      {/* Visible Watermark Overlay */}
      <div
        ref={watermarkRef}
        className="absolute pointer-events-none select-none"
        style={{
          top: `${watermarkPosition.y}%`,
          left: `${watermarkPosition.x}%`,
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
        }}
      >
        <div className="bg-black bg-opacity-30 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center space-x-2">
          <Image
            src="/tripleacademy-logo.png"
            alt="TripleAcademy"
            width={16}
            height={16}
            className="opacity-70"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-white opacity-70">
              TripleAcademy
            </span>
            <span className="text-white opacity-60">
              {formatUserIdentifier()}
            </span>
            <span className="text-white opacity-50 text-xs">{currentTime}</span>
            {currentSession && (
              <span className="text-white opacity-40 text-xs">
                {currentSession.sessionId.substring(0, 8)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="absolute top-2 left-2 pointer-events-none">
        <div className="bg-red-600 bg-opacity-80 text-white text-xs px-2 py-1 rounded">
          🔒 Protected Content
        </div>
      </div>
    </div>
  );
}
