import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/discussions
 * List discussions for a course
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // In production, this would query the Discussion table
    // For demo, return mock data
    const discussions = [
      {
        id: "disc_1",
        courseId,
        title: "How to get started with the course?",
        content: "I just enrolled in this course. What's the best way to approach the material?",
        author: {
          id: "user_1",
          name: "Abebe Kebede",
          avatarUrl: null,
        },
        isPinned: true,
        isLocked: false,
        upvotes: 12,
        viewCount: 45,
        replyCount: 5,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "disc_2",
        courseId,
        title: "Question about Assignment 3",
        content: "I'm having trouble understanding the requirements for the third assignment. Can someone help?",
        author: {
          id: "user_2",
          name: "Sara Tesfaye",
          avatarUrl: null,
        },
        isPinned: false,
        isLocked: false,
        upvotes: 8,
        viewCount: 32,
        replyCount: 3,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "disc_3",
        courseId,
        title: "Share your project progress!",
        content: "Let's use this thread to share our projects and get feedback from each other.",
        author: {
          id: "user_3",
          name: "Dawit Mulugeta",
          avatarUrl: null,
        },
        isPinned: false,
        isLocked: false,
        upvotes: 15,
        viewCount: 67,
        replyCount: 12,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: discussions,
      pagination: {
        page,
        limit,
        total: discussions.length,
        totalPages: 1,
      },
    });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/discussions
 * Create a new discussion
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, authorId, title, content } = body;

    if (!courseId || !authorId || !title || !content) {
      return NextResponse.json(
        { error: "Course ID, author ID, title, and content are required" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Verify the user is enrolled in the course
    // 2. Create a Discussion record
    // 3. Notify course instructor
    // 4. Return the created discussion

    const discussionId = `disc_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      message: "Discussion created successfully",
      data: {
        id: discussionId,
        courseId,
        title,
        content,
        author: {
          id: authorId,
          name: "Current User",
        },
        isPinned: false,
        isLocked: false,
        upvotes: 0,
        viewCount: 0,
        replyCount: 0,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating discussion:", error);
    return NextResponse.json(
      { error: "Failed to create discussion" },
      { status: 500 }
    );
  }
}
