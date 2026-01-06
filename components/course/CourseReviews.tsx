"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaThumbsUp,
  FaUser,
  FaClock,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  rating: number;
  review: string | null;
  isHelpful: number;
  createdAt: string;
  updatedAt: string;
}

interface CourseReviewsProps {
  courseId: string;
  courseName: string;
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
  currentUserId?: string;
  userHasReviewed?: boolean;
  isEnrolled?: boolean;
  onSubmitReview?: (rating: number, review: string) => void;
  onUpdateReview?: (reviewId: string, rating: number, review: string) => void;
  onDeleteReview?: (reviewId: string) => void;
  onMarkHelpful?: (reviewId: string) => void;
}

// Star rating component
function StarRating({
  rating,
  onRatingChange,
  interactive = false,
  size = "md",
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;
    let StarIcon = FaRegStar;
    
    if (i <= Math.floor(displayRating)) {
      StarIcon = FaStar;
    } else if (i === Math.ceil(displayRating) && displayRating % 1 >= 0.5) {
      StarIcon = FaStarHalfAlt;
    }

    stars.push(
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => onRatingChange?.(i)}
        onMouseEnter={() => interactive && setHoverRating(i)}
        onMouseLeave={() => interactive && setHoverRating(0)}
        className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
      >
        <StarIcon className={`${sizeClasses[size]} text-yellow-500`} />
      </button>
    );
  }

  return <div className="flex items-center gap-1">{stars}</div>;
}

// Rating distribution bar
function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground w-6">{stars}★</span>
      <Progress value={percentage} className="h-2 flex-1" />
      <span className="text-sm text-muted-foreground w-8">{count}</span>
    </div>
  );
}

export function CourseReviews({
  courseId,
  courseName,
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  currentUserId,
  userHasReviewed = false,
  isEnrolled = false,
  onSubmitReview,
  onUpdateReview,
  onDeleteReview,
  onMarkHelpful,
}: CourseReviewsProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Sample reviews for demo
  const sampleReviews: Review[] = reviews.length > 0 ? reviews : [
    {
      id: "review_1",
      userId: "user_1",
      userName: "Abebe Kebede",
      userAvatar: null,
      rating: 5,
      review: "Excellent course! The instructor explains complex concepts in a very clear and understandable way. The hands-on projects really helped me solidify my learning. Highly recommended for anyone looking to master web development.",
      isHelpful: 24,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "review_2",
      userId: "user_2",
      userName: "Sara Tesfaye",
      userAvatar: null,
      rating: 4,
      review: "Great content and well-structured curriculum. I learned a lot from this course. The only improvement I would suggest is more quizzes to test understanding along the way.",
      isHelpful: 18,
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
      id: "review_3",
      userId: "user_3",
      userName: "Dawit Mulugeta",
      userAvatar: null,
      rating: 5,
      review: "Perfect for beginners! I had no prior experience and now I can build full-stack applications. The instructor's teaching style is engaging and the support in discussions is excellent.",
      isHelpful: 32,
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    },
    {
      id: "review_4",
      userId: "user_4",
      userName: "Tigist Haile",
      userAvatar: null,
      rating: 4,
      review: "Comprehensive course with practical examples. Would love to see more advanced topics covered in future updates.",
      isHelpful: 12,
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    },
  ];

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: sampleReviews.filter((r) => Math.floor(r.rating) === stars).length,
  }));

  const calculatedAverage = averageRating > 0 
    ? averageRating 
    : sampleReviews.length > 0
      ? sampleReviews.reduce((acc, r) => acc + r.rating, 0) / sampleReviews.length
      : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 1) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const handleSubmitReview = () => {
    if (editingReview) {
      onUpdateReview?.(editingReview.id, newRating, newReviewText);
    } else {
      onSubmitReview?.(newRating, newReviewText);
    }
    setNewRating(5);
    setNewReviewText("");
    setEditingReview(null);
    setIsReviewDialogOpen(false);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setNewRating(review.rating);
    setNewReviewText(review.review || "");
    setIsReviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            Course Reviews
          </CardTitle>
          <CardDescription>
            See what other students are saying about {courseName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-5xl font-bold text-yellow-500 mb-2">
                {calculatedAverage.toFixed(1)}
              </div>
              <StarRating rating={calculatedAverage} size="lg" />
              <p className="text-muted-foreground mt-2">
                {totalReviews > 0 ? totalReviews : sampleReviews.length} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ stars, count }) => (
                <RatingBar
                  key={stars}
                  stars={stars}
                  count={count}
                  total={sampleReviews.length}
                />
              ))}
            </div>
          </div>

          {/* Write Review Button */}
          {isEnrolled && !userHasReviewed && (
            <div className="mt-6 pt-6 border-t">
              <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <FaStar className="mr-2" />
                    Write a Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {editingReview ? "Edit Your Review" : "Write a Review"}
                    </DialogTitle>
                    <DialogDescription>
                      Share your experience with this course to help other learners.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Your Rating</Label>
                      <div className="mt-2">
                        <StarRating
                          rating={newRating}
                          onRatingChange={setNewRating}
                          interactive
                          size="lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="review">Your Review (Optional)</Label>
                      <Textarea
                        id="review"
                        placeholder="What did you like or dislike about this course?"
                        rows={5}
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsReviewDialogOpen(false);
                        setEditingReview(null);
                        setNewRating(5);
                        setNewReviewText("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitReview}>
                      {editingReview ? "Update Review" : "Submit Review"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {sampleReviews.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FaStar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground">
                Be the first to review this course!
              </p>
            </CardContent>
          </Card>
        ) : (
          sampleReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.userAvatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {review.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{review.userName}</span>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            <FaClock className="inline mr-1" />
                            {formatDate(review.createdAt)}
                          </span>
                          {currentUserId === review.userId && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleEditReview(review)}
                              >
                                <FaEdit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                                onClick={() => onDeleteReview?.(review.id)}
                              >
                                <FaTrash className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      {review.review && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {review.review}
                        </p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-blue-600"
                        onClick={() => onMarkHelpful?.(review.id)}
                      >
                        <FaThumbsUp className="mr-1" />
                        Helpful ({review.isHelpful})
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default CourseReviews;
