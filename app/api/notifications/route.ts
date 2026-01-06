import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/notifications
 * List user's notifications
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // In production, this would query the Notification table
    // For demo, return mock data
    const notifications = [
      {
        id: "notif_1",
        type: "enrollment",
        title: "Enrollment Approved!",
        content: "Your enrollment in 'Video Editing Masterclass' has been approved. You can now access the course.",
        link: "/course/course_1",
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "notif_2",
        type: "message",
        title: "New Message",
        content: "Abebe Kebede sent you a message in 'Web Development Study Group'",
        link: "/messages?conv=conv_2",
        isRead: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "notif_3",
        type: "discussion",
        title: "New Reply to Your Discussion",
        content: "Dr. Instructor replied to your discussion 'How to get started with the course?'",
        link: "/course/course_1/discussions/disc_1",
        isRead: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "notif_4",
        type: "announcement",
        title: "Course Announcement",
        content: "New lesson uploaded in 'Digital Marketing Essentials'",
        link: "/course/course_2",
        isRead: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "notif_5",
        type: "certificate",
        title: "Certificate Earned!",
        content: "Congratulations! You've earned a certificate for completing 'Graphic Design Fundamentals'",
        link: "/certificates/cert_1",
        isRead: true,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ];

    // Filter by unread if specified
    const filteredNotifications = unreadOnly 
      ? notifications.filter(n => !n.isRead)
      : notifications;

    // Calculate unread count
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return NextResponse.json({
      success: true,
      data: filteredNotifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total: filteredNotifications.length,
        totalPages: Math.ceil(filteredNotifications.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications
 * Mark notifications as read
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationIds, markAllAsRead, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // In production, this would update the Notification records
    // For demo, return success

    if (markAllAsRead) {
      return NextResponse.json({
        success: true,
        message: "All notifications marked as read",
      });
    }

    if (!notificationIds || notificationIds.length === 0) {
      return NextResponse.json(
        { error: "Notification IDs are required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${notificationIds.length} notification(s) marked as read`,
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
