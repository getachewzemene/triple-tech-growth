import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/instructor/apply
 * Apply to become an instructor
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, bio, expertise, qualifications, socialLinks } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // In a production environment, this would:
    // 1. Verify the user exists and is not already an instructor
    // 2. Create an InstructorProfile record with PENDING status
    // 3. Notify admins of the new application
    // 4. Send confirmation email to the applicant

    // For demo purposes, we'll return a success response
    const applicationId = `app_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      message: "Your instructor application has been submitted successfully. Our team will review your application and get back to you within 3-5 business days.",
      applicationId,
      data: {
        userId,
        status: "PENDING",
        submittedAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error("Error submitting instructor application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/instructor/apply
 * Check instructor application status
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
    // For demo, return a mock response
    return NextResponse.json({
      success: true,
      data: {
        userId,
        status: "PENDING", // PENDING, APPROVED, REJECTED
        submittedAt: null,
        reviewedAt: null,
        note: null,
      }
    });
  } catch (error) {
    console.error("Error checking application status:", error);
    return NextResponse.json(
      { error: "Failed to check application status" },
      { status: 500 }
    );
  }
}
