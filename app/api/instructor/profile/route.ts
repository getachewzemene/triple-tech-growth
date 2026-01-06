import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/instructor/profile
 * Get instructor profile
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // In production, this would query the InstructorProfile table
    // For demo, return mock data
    const profile = {
      id: "profile_1",
      userId,
      bio: "Experienced software developer and educator with 10+ years in the industry. Passionate about teaching and helping students achieve their goals.",
      expertise: ["Web Development", "Mobile Apps", "Machine Learning"],
      qualifications: "MSc in Computer Science, AWS Certified, Google Cloud Certified",
      profileImage: null,
      socialLinks: {
        linkedin: "https://linkedin.com/in/instructor",
        twitter: "https://twitter.com/instructor",
        website: "https://instructor.dev",
      },
      applicationStatus: "APPROVED",
      totalStudents: 1250,
      totalCourses: 8,
      totalEarnings: 12500000, // In cents (125,000 ETB)
      averageRating: 4.8,
      createdAt: new Date(Date.now() - 86400000 * 365).toISOString(),
      courses: [
        {
          id: "course_1",
          title: "Web Development Masterclass",
          enrollments: 450,
          rating: 4.9,
          revenue: 5000000,
        },
        {
          id: "course_2",
          title: "React & Next.js Complete Guide",
          enrollments: 380,
          rating: 4.8,
          revenue: 4200000,
        },
        {
          id: "course_3",
          title: "Node.js Backend Development",
          enrollments: 320,
          rating: 4.7,
          revenue: 3300000,
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error fetching instructor profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructor profile" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/instructor/profile
 * Update instructor profile
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, bio, expertise, qualifications, socialLinks, profileImage } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // In production, this would update the InstructorProfile record
    // For demo, return success

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        userId,
        bio,
        expertise,
        qualifications,
        socialLinks,
        profileImage,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating instructor profile:", error);
    return NextResponse.json(
      { error: "Failed to update instructor profile" },
      { status: 500 }
    );
  }
}
