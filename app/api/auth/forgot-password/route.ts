import { NextRequest, NextResponse } from 'next/server'
import { forgotPasswordSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rate-limit'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - more restrictive for password reset
    const rateLimitResult = rateLimit(request, 3, 15 * 60 * 1000) // 3 requests per 15 minutes
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toISOString()
          }
        }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = forgotPasswordSchema.parse(body)
    
    await connectDB()
    
    // Find user by email
    const user = await User.findOne({ email: validatedData.email })
    
    // Always return success message for security (don't reveal if email exists)
    const successMessage = 'If an account with that email exists, we have sent a password reset link.'
    
    if (!user) {
      return NextResponse.json({ message: successMessage })
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    
    // Save reset token to user
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetTokenExpires
    await user.save()
    
    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Don't fail the request if email fails, but log it
    }
    
    return NextResponse.json({ message: successMessage })
    
  } catch (error: any) {
    console.error('Forgot password error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}