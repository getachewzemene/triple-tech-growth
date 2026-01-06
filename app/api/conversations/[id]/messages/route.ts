import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/conversations/[id]/messages
 * Get messages for a conversation
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const before = searchParams.get("before"); // For pagination
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!id) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    // In production, this would query the Message table
    // For demo, return mock data
    const messages = [
      {
        id: "msg_1",
        conversationId: id,
        content: "Hey everyone! Welcome to the study group.",
        sender: {
          id: "user_1",
          name: "Abebe Kebede",
          avatarUrl: null,
        },
        attachments: null,
        isEdited: false,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "msg_2",
        conversationId: id,
        content: "Thanks for creating this! I think it will be really helpful.",
        sender: {
          id: "user_2",
          name: "Sara Tesfaye",
          avatarUrl: null,
        },
        attachments: null,
        isEdited: false,
        createdAt: new Date(Date.now() - 86400000 * 1.9).toISOString(),
      },
      {
        id: "msg_3",
        conversationId: id,
        content: "Has anyone started on the first project yet?",
        sender: {
          id: "user_3",
          name: "Dawit Mulugeta",
          avatarUrl: null,
        },
        attachments: null,
        isEdited: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "msg_4",
        conversationId: id,
        content: "Yes! I just finished the setup. Here's what I learned...",
        sender: {
          id: "user_1",
          name: "Abebe Kebede",
          avatarUrl: null,
        },
        attachments: [
          {
            type: "image",
            url: "/placeholder.svg",
            name: "screenshot.png",
            size: 245000,
          },
        ],
        isEdited: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "msg_5",
        conversationId: id,
        content: "That looks great! Can you share the code?",
        sender: {
          id: "user_2",
          name: "Sara Tesfaye",
          avatarUrl: null,
        },
        attachments: null,
        isEdited: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        hasMore: false,
        nextCursor: null,
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations/[id]/messages
 * Send a message to a conversation
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { senderId, content, attachments } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    if (!senderId || !content) {
      return NextResponse.json(
        { error: "Sender ID and content are required" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Verify the user is a participant in the conversation
    // 2. Create a Message record
    // 3. Update the conversation's lastMessageAt
    // 4. Send real-time notification to other participants
    // 5. Return the created message

    const messageId = `msg_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      data: {
        id: messageId,
        conversationId: id,
        content,
        sender: {
          id: senderId,
          name: "Current User",
          avatarUrl: null,
        },
        attachments: attachments || null,
        isEdited: false,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
