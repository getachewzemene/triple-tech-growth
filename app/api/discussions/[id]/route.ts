import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/discussions/[id]
 * Get a specific discussion with its replies
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Discussion ID is required" },
        { status: 400 }
      );
    }

    // In production, this would query the Discussion table with replies
    // For demo, return mock data
    const discussion = {
      id,
      courseId: "course_1",
      title: "How to get started with the course?",
      content: "I just enrolled in this course. What's the best way to approach the material? I want to make sure I'm learning effectively.",
      author: {
        id: "user_1",
        name: "Abebe Kebede",
        avatarUrl: null,
      },
      isPinned: true,
      isLocked: false,
      upvotes: 12,
      viewCount: 46, // Incremented for this view
      replyCount: 3,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      replies: [
        {
          id: "reply_1",
          discussionId: id,
          content: "Welcome to the course! I recommend starting with the first module and watching all videos in order. Take notes as you go.",
          author: {
            id: "user_instructor",
            name: "Dr. Instructor",
            avatarUrl: null,
            isInstructor: true,
          },
          isBestAnswer: true,
          upvotes: 8,
          createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        },
        {
          id: "reply_2",
          discussionId: id,
          content: "I found it helpful to complete the exercises after each lesson before moving on. Good luck!",
          author: {
            id: "user_2",
            name: "Sara Tesfaye",
            avatarUrl: null,
            isInstructor: false,
          },
          isBestAnswer: false,
          upvotes: 5,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "reply_3",
          discussionId: id,
          content: "Don't forget to join the study group chat! It's really helpful to discuss with other students.",
          author: {
            id: "user_3",
            name: "Dawit Mulugeta",
            avatarUrl: null,
            isInstructor: false,
          },
          isBestAnswer: false,
          upvotes: 3,
          createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    console.error("Error fetching discussion:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussion" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/discussions/[id]
 * Update a discussion (author or moderator only)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, isPinned, isLocked } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Discussion ID is required" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Verify the user is the author or a moderator
    // 2. Update the Discussion record
    // 3. Return the updated discussion

    return NextResponse.json({
      success: true,
      message: "Discussion updated successfully",
      data: {
        id,
        title: title ?? undefined,
        content: content ?? undefined,
        isPinned: isPinned ?? false,
        isLocked: isLocked ?? false,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating discussion:", error);
    return NextResponse.json(
      { error: "Failed to update discussion" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/discussions/[id]
 * Delete a discussion (author or moderator only)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Discussion ID is required" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Verify the user is the author or a moderator
    // 2. Delete the Discussion record and all replies
    // 3. Return success

    return NextResponse.json({
      success: true,
      message: "Discussion deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    return NextResponse.json(
      { error: "Failed to delete discussion" },
      { status: 500 }
    );
  }
}
