import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/discussions/[id]/reply
 * Reply to a discussion
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { authorId, content, parentId } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Discussion ID is required" },
        { status: 400 }
      );
    }

    if (!authorId || !content) {
      return NextResponse.json(
        { error: "Author ID and content are required" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Verify the user is enrolled in the course
    // 2. Create a DiscussionReply record
    // 3. Update the discussion's replyCount
    // 4. Notify the discussion author
    // 5. Return the created reply

    const replyId = `reply_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      message: "Reply posted successfully",
      data: {
        id: replyId,
        discussionId: id,
        parentId: parentId || null,
        content,
        author: {
          id: authorId,
          name: "Current User",
          avatarUrl: null,
        },
        isBestAnswer: false,
        upvotes: 0,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error posting reply:", error);
    return NextResponse.json(
      { error: "Failed to post reply" },
      { status: 500 }
    );
  }
}
