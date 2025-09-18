import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// const prisma = new PrismaClient();

// Validation schema for proof approval/rejection
const reviewProofSchema = z.object({
  comment: z.string().optional(),
});

/**
 * Reject payment proof and keep enrollment pending
 * Security: Admin-only access, validates proof exists and is pending
 * Updates PaymentProof.status to "rejected"
 * Sends notification email to student with reason
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication and admin privileges
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify admin role - only admins can approve/reject proofs
    if (!(session.user as any).isAdmin) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    const proofId = params.id;
    const body = await request.json();

    // Validate request body
    const validationResult = reviewProofSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid review data',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { comment } = validationResult.data;

    // Find the payment proof
    // For demo purposes, create mock data
    // In production, query database
    const paymentProof = {
      id: proofId,
      userId: 'user_123',
      courseId: 'course_456',
      s3Key: 'proof.jpg',
      status: 'pending',
      comment: null,
      uploadedAt: new Date().toISOString(),
      reviewedAt: null,
    };

    if (!paymentProof) {
      return NextResponse.json(
        { error: 'Payment proof not found' },
        { status: 404 }
      );
    }

    if (paymentProof.status !== 'pending') {
      return NextResponse.json(
        { error: 'Payment proof has already been reviewed' },
        { status: 409 }
      );
    }

    // Update payment proof status to rejected
    // For demo purposes, create mock data
    // In production, update database
    const updatedProof = {
      ...paymentProof,
      status: 'rejected',
      comment: comment || null,
      reviewedAt: new Date().toISOString(),
    };

    // Keep enrollment status as pending (student can resubmit proof)
    // For demo purposes, create mock data
    // In production, enrollment remains unchanged
    const enrollment = {
      id: 'enrollment_123',
      userId: paymentProof.userId,
      courseId: paymentProof.courseId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      approvedAt: null,
    };

    // Send email notification to student
    await sendStudentNotificationEmail({
      type: 'proof_rejected',
      userId: paymentProof.userId,
      courseId: paymentProof.courseId,
      proofId: proofId,
      comment: comment,
    });

    console.log('Payment proof rejected:', { updatedProof, enrollment });

    return NextResponse.json({
      success: true,
      message: 'Payment proof rejected',
      proofId: proofId,
      enrollmentStatus: 'pending',
      rejectedAt: updatedProof.reviewedAt,
      comment: comment,
    });

  } catch (error) {
    console.error('Error rejecting payment proof:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Send email notification to student about proof rejection
 * In production, integrate with SendGrid, Postmark, or SMTP
 */
async function sendStudentNotificationEmail(data: {
  type: 'proof_approved' | 'proof_rejected';
  userId: string;
  courseId: string;
  proofId: string;
  comment?: string;
}): Promise<void> {
  try {
    // TODO: Get user email from database
    // const user = await prisma.user.findUnique({ where: { id: data.userId } });
    // const course = await prisma.course.findUnique({ where: { id: data.courseId } });
    
    const userEmail = 'student@example.com'; // Mock email
    const courseName = 'Demo Course'; // Mock course name

    // TODO: Implement actual email sending
    // Example using SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const isApproved = data.type === 'proof_approved';
    const subject = isApproved ? 'Payment Approved - Access Granted' : 'Payment Rejected - Please Resubmit';
    
    const msg = {
      to: userEmail,
      from: 'noreply@tripleacademy.com',
      subject,
      html: `
        <h2>${isApproved ? 'Payment Approved!' : 'Payment Rejected'}</h2>
        <p>Your payment proof for <strong>${courseName}</strong> has been ${isApproved ? 'approved' : 'rejected'}.</p>
        ${isApproved ? 
          '<p>You now have access to the course content. You can start learning immediately!</p>' :
          '<p>Please review the feedback and submit a new payment proof.</p>'
        }
        ${data.comment ? `<p><strong>Admin Comment:</strong> ${data.comment}</p>` : ''}
        <p>Thank you for choosing Triple Academy!</p>
      `,
    };
    
    await sgMail.send(msg);
    */
    
    console.log('Student email notification sent (stub):', data);
  } catch (error) {
    console.error('Error sending student notification email:', error);
    // Don't throw - email failure shouldn't fail the rejection process
  }
}