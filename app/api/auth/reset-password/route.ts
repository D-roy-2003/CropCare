import { NextRequest, NextResponse } from 'next/server'
import { resetPasswordSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rate-limit'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, 5, 15 * 60 * 1000) // 5 requests per 15 minutes
    
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
    const validatedData = resetPasswordSchema.parse(body)
    
    await connectDB()
    
    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: validatedData.token,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+password')
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }
    
    // Update password
    user.password = validatedData.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    
    // Reset login attempts if any
    user.loginAttempts = 0
    user.lockUntil = undefined
    
    await user.save()
    
    return NextResponse.json({
      message: 'Password reset successfully! You can now log in with your new password.'
    })
    
  } catch (error: any) {
    console.error('Reset password error:', error)
    
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