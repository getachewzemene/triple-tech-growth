import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    courseId: string;
  }>;
}

/**
 * GET /api/courses/[courseId]/reviews
 * Get reviews for a course
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { courseId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "recent"; // recent, helpful, rating

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // In production, this would query the CourseReview table
    // For demo, return mock data
    const reviews = [
      {
        id: "review_1",
        courseId,
        userId: "user_1",
        userName: "Abebe Kebede",
        userAvatar: null,
        rating: 5,
        review: "Excellent course! The instructor explains complex concepts in a very clear and understandable way. The hands-on projects really helped me solidify my learning.",
        isHelpful: 24,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "review_2",
        courseId,
        userId: "user_2",
        userName: "Sara Tesfaye",
        userAvatar: null,
        rating: 4,
        review: "Great content and well-structured curriculum. I learned a lot from this course. Would recommend!",
        isHelpful: 18,
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: "review_3",
        courseId,
        userId: "user_3",
        userName: "Dawit Mulugeta",
        userAvatar: null,
        rating: 5,
        review: "Perfect for beginners! I had no prior experience and now I can build full-stack applications.",
        isHelpful: 32,
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
    ];

    // Sort reviews based on sortBy parameter
    let sortedReviews = [...reviews];
    if (sortBy === "helpful") {
      sortedReviews.sort((a, b) => b.isHelpful - a.isHelpful);
    } else if (sortBy === "rating") {
      sortedReviews.sort((a, b) => b.rating - a.rating);
    } else {
      sortedReviews.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const ratingDistribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    return NextResponse.json({
      success: true,
      data: sortedReviews,
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
      },
      pagination: {
        page,
        limit,
        total: totalReviews,
        totalPages: Math.ceil(totalReviews / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses/[courseId]/reviews
 * Create a new review for a course
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { courseId } = await params;
    const body = await request.json();
    const { userId, rating, review } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    if (!userId || !rating) {
      return NextResponse.json(
        { error: "User ID and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Verify the user is enrolled in the course
    // 2. Check if the user has already reviewed this course
    // 3. Create a CourseReview record
    // 4. Update the course's average rating
    // 5. Return the created review

    const reviewId = crypto.randomUUID();

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      data: {
        id: reviewId,
        courseId,
        userId,
        rating,
        review: review || null,
        isHelpful: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/courses/[courseId]/reviews
 * Update a review
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { courseId } = await params;
    const body = await request.json();
    const { reviewId, userId, rating, review } = body;

    if (!courseId || !reviewId) {
      return NextResponse.json(
        { error: "Course ID and Review ID are required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate rating range if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Verify the user owns this review
    // 2. Update the CourseReview record
    // 3. Recalculate the course's average rating
    // 4. Return the updated review

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
      data: {
        id: reviewId,
        courseId,
        userId,
        rating,
        review: review || null,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/courses/[courseId]/reviews
 * Delete a review
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { courseId } = await params;
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");
    const userId = searchParams.get("userId");

    if (!courseId || !reviewId) {
      return NextResponse.json(
        { error: "Course ID and Review ID are required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Verify the user owns this review or is an admin
    // 2. Delete the CourseReview record
    // 3. Recalculate the course's average rating
    // 4. Return success

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
