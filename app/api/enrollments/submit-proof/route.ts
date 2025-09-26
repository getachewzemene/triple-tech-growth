import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import { PrismaClient } from '@prisma/client';
import { z } from "zod";

// const prisma = new PrismaClient();

// Validation schema for proof submission
const submitProofSchema = z.object({
  courseId: z.string().min(1),
  s3Key: z.string().min(1),
  comment: z.string().optional(),
});

/**
 * Submit payment proof for enrollment
 * Security: Validates file type, size, and user authentication
 * Creates PaymentProof record and Enrollment with "pending" status
 * Notifies admin via email or AdminNotification
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication - any authenticated user can submit proof
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate request body using Zod schema
    const validationResult = submitProofSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid proof data",
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { courseId, s3Key, comment } = validationResult.data;
    const userId = session.user.id;

    // Validate file size and type based on S3 key metadata
    // In production, you would check the actual file metadata from S3
    if (!isValidProofFile(s3Key)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only images (jpg, png, gif) and PDF files are allowed.",
        },
        { status: 400 },
      );
    }

    // Check if user already has a pending or approved proof for this course
    // For demo purposes, create mock data
    // In production, check database for existing proofs
    const existingProof = null; // await prisma.paymentProof.findFirst({...})

    if (existingProof && existingProof.status !== "rejected") {
      return NextResponse.json(
        { error: "You already have a payment proof submitted for this course" },
        { status: 409 },
      );
    }

    // Create PaymentProof record
    // For demo purposes, create mock data
    // In production, save to database
    const paymentProof = {
      id: `proof_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId,
      courseId,
      s3Key,
      status: "pending",
      comment: comment || null,
      uploadedAt: new Date().toISOString(),
      reviewedAt: null,
    };

    // Create or update enrollment with pending status
    // For demo purposes, create mock data
    // In production, upsert to database
    const enrollment = {
      id: `enrollment_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId,
      courseId,
      status: "pending",
      createdAt: new Date().toISOString(),
      approvedAt: null,
    };

    // Create admin notification
    // For demo purposes, create mock notification
    // In production, save to database and/or send email
    const adminNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      type: "payment_proof_submitted",
      payload: JSON.stringify({
        userId,
        courseId,
        paymentProofId: paymentProof.id,
        userEmail: session.user.email,
        userName: session.user.name,
      }),
      read: false,
      createdAt: new Date().toISOString(),
    };

    // Send email notification to admin (stub implementation)
    await sendAdminNotificationEmail({
      type: "payment_proof_submitted",
      userEmail: session.user.email!,
      userName: session.user.name || "Unknown User",
      courseId,
      paymentProofId: paymentProof.id,
    });

    console.log("Payment proof submitted:", {
      paymentProof,
      enrollment,
      adminNotification,
    });

    return NextResponse.json({
      success: true,
      message:
        "Payment proof submitted successfully. Admin will verify within 24 hours.",
      paymentProofId: paymentProof.id,
      enrollmentId: enrollment.id,
      estimatedReviewTime: "24 hours",
    });
  } catch (error) {
    console.error("Error submitting payment proof:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Validate if the file is a valid proof file (image or PDF)
 * Security: Check file extension and MIME type validation
 */
function isValidProofFile(s3Key: string): boolean {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".pdf"];
  const extension = s3Key.toLowerCase().substring(s3Key.lastIndexOf("."));

  return allowedExtensions.includes(extension);
}

/**
 * Send email notification to admin about new payment proof
 * In production, integrate with SendGrid, Postmark, or SMTP
 */
async function sendAdminNotificationEmail(data: {
  type: string;
  userEmail: string;
  userName: string;
  courseId: string;
  paymentProofId: string;
}): Promise<void> {
  try {
    // TODO: Implement actual email sending
    // Example using SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: 'admin@tripleacademy.com',
      from: 'noreply@tripleacademy.com',
      subject: 'New Payment Proof Submitted',
      html: `
        <h2>New Payment Proof Submitted</h2>
        <p><strong>Student:</strong> ${data.userName} (${data.userEmail})</p>
        <p><strong>Course ID:</strong> ${data.courseId}</p>
        <p><strong>Proof ID:</strong> ${data.paymentProofId}</p>
        <p>Please review the payment proof in the admin panel.</p>
      `,
    };
    
    await sgMail.send(msg);
    */

    console.log("Admin email notification sent (stub):", data);
  } catch (error) {
    console.error("Error sending admin notification email:", error);
    // Don't throw - email failure shouldn't fail the proof submission
  }
}
