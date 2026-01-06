import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/instructor/courses
 * List instructor's courses
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status"); // "draft", "published", "unlisted"

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // In production, this would query the Course table
    // For demo, return mock data
    const courses = [
      {
        id: "course_1",
        title: "Web Development Masterclass",
        slug: "web-development-masterclass",
        description: "Complete guide to modern web development with React, Next.js, and more.",
        thumbnail: null,
        priceCents: 499900, // 4,999 ETB
        visibility: "PUBLISHED",
        category: "Development",
        enrollments: 450,
        totalRevenue: 5000000,
        averageRating: 4.9,
        totalReviews: 128,
        lessonsCount: 45,
        createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "course_2",
        title: "React & Next.js Complete Guide",
        slug: "react-nextjs-complete-guide",
        description: "Master React and Next.js from zero to hero.",
        thumbnail: null,
        priceCents: 399900,
        visibility: "PUBLISHED",
        category: "Development",
        enrollments: 380,
        totalRevenue: 4200000,
        averageRating: 4.8,
        totalReviews: 95,
        lessonsCount: 38,
        createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: "course_3",
        title: "Node.js Backend Development",
        slug: "nodejs-backend-development",
        description: "Build scalable backend applications with Node.js.",
        thumbnail: null,
        priceCents: 349900,
        visibility: "DRAFT",
        category: "Development",
        enrollments: 0,
        totalRevenue: 0,
        averageRating: 0,
        totalReviews: 0,
        lessonsCount: 12,
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ];

    // Filter by status if specified
    const filteredCourses = status
      ? courses.filter(c => c.visibility === status.toUpperCase())
      : courses;

    // Calculate stats
    const stats = {
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.visibility === "PUBLISHED").length,
      draftCourses: courses.filter(c => c.visibility === "DRAFT").length,
      totalEnrollments: courses.reduce((sum, c) => sum + c.enrollments, 0),
      totalRevenue: courses.reduce((sum, c) => sum + c.totalRevenue, 0),
      averageRating: courses.filter(c => c.averageRating > 0).length > 0
        ? courses.filter(c => c.averageRating > 0).reduce((sum, c) => sum + c.averageRating, 0) / courses.filter(c => c.averageRating > 0).length
        : 0,
    };

    return NextResponse.json({
      success: true,
      data: filteredCourses,
      stats,
    });
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/instructor/courses
 * Create a new course
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      instructorId,
      title,
      description,
      category,
      priceCents,
      enableDiscussion,
      enableCertificate,
    } = body;

    if (!instructorId || !title) {
      return NextResponse.json(
        { error: "Instructor ID and title are required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // In production, this would:
    // 1. Verify the user is an approved instructor
    // 2. Create a Course record with DRAFT visibility
    // 3. Return the created course

    const courseId = `course_${Date.now()}`;

    return NextResponse.json({
      success: true,
      message: "Course created successfully",
      data: {
        id: courseId,
        slug: `${slug}-${courseId.slice(-6)}`,
        title,
        description: description || "",
        category: category || "General",
        priceCents: priceCents || 0,
        visibility: "DRAFT",
        enableDiscussion: enableDiscussion ?? true,
        enableCertificate: enableCertificate ?? true,
        instructorId,
        lessonsCount: 0,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
