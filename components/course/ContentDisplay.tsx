"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  FileText,
  Video as VideoIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  type: "topic";
}

interface ContentDisplayProps {
  topic: Topic;
  onComplete?: () => void;
  isCompleted?: boolean;
}

const OptimizedVideoPlayer: React.FC<{
  src: string;
  title: string;
  onComplete?: () => void;
  duration?: number;
}> = ({ src, title, onComplete, duration }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoLength, setVideoLength] = useState(duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchProgress, setWatchProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setLoading(false);
      setVideoLength(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progress = (video.currentTime / video.duration) * 100;
      setWatchProgress(progress);

      // Auto-complete when user watches 90% of the video
      if (progress > 90 && onComplete) {
        onComplete();
      }
    };

    const handleError = () => {
      setLoading(false);
      setError("Failed to load video. Please try again.");
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) {
        onComplete();
      }
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * videoLength;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden group">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-center text-white">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading video...</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        preload="metadata"
        playsInline
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="space-y-2">
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <span className="text-white text-sm min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[videoLength > 0 ? (currentTime / videoLength) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="flex-1"
            />
            <span className="text-white text-sm min-w-[40px]">
              {formatTime(videoLength)}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  className="w-20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {watchProgress > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {Math.round(watchProgress)}% watched
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OptimizedPDFViewer: React.FC<{
  src: string;
  title: string;
  onComplete?: () => void;
}> = ({ src, title, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError("Failed to load PDF. Please try again or download the file.");
  };

  const markAsRead = () => {
    if (onComplete) {
      onComplete();
    }
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">PDF Load Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild>
              <a
                href={src}
                download={title}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading PDF...</p>
          </div>
        </div>
      )}

      {/* PDF Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-red-500" />
          <span className="font-medium truncate">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={markAsRead}
            className="bg-green-600 hover:bg-green-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Mark as Read
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a
              href={src}
              download={title}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 relative">
        <iframe
          src={`${src}#toolbar=1&navpanes=1&scrollbar=1`}
          title={title}
          className="w-full h-full border-none"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default function ContentDisplay({
  topic,
  onComplete,
  isCompleted,
}: ContentDisplayProps) {
  const [hasContentError, setHasContentError] = useState(false);

  // For demo purposes, we'll create placeholder content URLs
  // In production, these would be actual S3 URLs or CDN URLs
  const getContentUrl = (key?: string, type: "video" | "pdf" = "video") => {
    if (!key) return null;

    // Demo URLs - in production these would be actual S3/CDN URLs
    if (type === "video") {
      return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    } else {
      return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    }
  };

  const videoUrl = getContentUrl(topic.videoS3Key, "video");
  const pdfUrl = getContentUrl(topic.pdfS3Key, "pdf");

  if (!videoUrl && !pdfUrl) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg m-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Content Available</h3>
          <p className="text-muted-foreground mb-4">
            This topic doesn't have any content yet. Please check back later.
          </p>
          <Badge variant="outline">Content coming soon</Badge>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      {videoUrl && (
        <OptimizedVideoPlayer
          src={videoUrl}
          title={topic.title}
          onComplete={onComplete}
          duration={topic.videoDuration}
        />
      )}

      {!videoUrl && pdfUrl && (
        <OptimizedPDFViewer
          src={pdfUrl}
          title={topic.title}
          onComplete={onComplete}
        />
      )}
    </motion.div>
  );
}
