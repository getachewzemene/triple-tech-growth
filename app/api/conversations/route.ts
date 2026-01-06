import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/conversations
 * List user's conversations
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type"); // "direct", "group", "course"

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // In production, this would query the Conversation and ConversationParticipant tables
    // For demo, return mock data
    const conversations = [
      {
        id: "conv_1",
        type: "DIRECT",
        name: null,
        participants: [
          { id: "user_1", name: "Abebe Kebede", avatarUrl: null, isOnline: true },
          { id: userId, name: "You", avatarUrl: null, isOnline: true },
        ],
        lastMessage: {
          id: "msg_1",
          content: "Thanks for the help with the assignment!",
          senderId: "user_1",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        unreadCount: 2,
        lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "conv_2",
        type: "GROUP",
        name: "Web Development Study Group",
        avatarUrl: null,
        participants: [
          { id: "user_1", name: "Abebe Kebede", avatarUrl: null },
          { id: "user_2", name: "Sara Tesfaye", avatarUrl: null },
          { id: "user_3", name: "Dawit Mulugeta", avatarUrl: null },
          { id: userId, name: "You", avatarUrl: null },
        ],
        lastMessage: {
          id: "msg_2",
          content: "Anyone want to do a group study session tomorrow?",
          senderId: "user_2",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        unreadCount: 5,
        lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "conv_3",
        type: "COURSE",
        name: "Video Editing Course Chat",
        courseId: "course_1",
        avatarUrl: null,
        participants: [
          { id: "instructor_1", name: "Dr. Instructor", avatarUrl: null, isInstructor: true },
        ],
        memberCount: 45,
        lastMessage: {
          id: "msg_3",
          content: "New lesson uploaded! Check it out.",
          senderId: "instructor_1",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        unreadCount: 1,
        lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    // Filter by type if specified
    const filteredConversations = type 
      ? conversations.filter(c => c.type === type.toUpperCase())
      : conversations;

    return NextResponse.json({
      success: true,
      data: filteredConversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations
 * Create a new conversation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, participantIds, courseId } = body;

    if (!type || !participantIds || participantIds.length === 0) {
      return NextResponse.json(
        { error: "Type and participants are required" },
        { status: 400 }
      );
    }

    // Validate conversation type
    if (!["DIRECT", "GROUP", "COURSE"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid conversation type" },
        { status: 400 }
      );
    }

    // For group conversations, a name is recommended
    if (type === "GROUP" && !name) {
      return NextResponse.json(
        { error: "Group name is required for group conversations" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Create a Conversation record
    // 2. Create ConversationParticipant records for all participants
    // 3. Return the created conversation

    const conversationId = `conv_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      message: "Conversation created successfully",
      data: {
        id: conversationId,
        type,
        name: name || null,
        courseId: courseId || null,
        participants: participantIds.map((id: string) => ({ id })),
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
