import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`
  
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM!,
    subject: 'Verify your email address - Crop Care',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">Crop Care</h1>
        </div>
        
        <h2 style="color: #16a34a; margin-bottom: 20px;">Welcome to Crop Care!</h2>
        
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          Thank you for signing up for Crop Care. To complete your registration and start using our AI-powered agricultural solutions, please verify your email address.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="display: inline-block; 
                    background-color: #16a34a; 
                    color: white; 
                    padding: 14px 28px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    font-size: 16px;">
            Verify Email Address
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
          If the button doesn't work, you can copy and paste this link into your browser:
        </p>
        <p style="word-break: break-all; color: #666; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 14px;">
          ${verificationUrl}
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
            <strong>Important:</strong> This verification link will expire in 24 hours.
          </p>
          <p style="font-size: 14px; color: #666;">
            If you didn't create an account with Crop Care, you can safely ignore this email.
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
          <p>© 2025 Crop Care. All rights reserved.</p>
        </div>
      </div>
    `
  }

  try {
    await sgMail.send(msg)
    console.log('Verification email sent successfully')
  } catch (error) {
    console.error('SendGrid error:', error)
    throw new Error('Failed to send verification email')
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM!,
    subject: 'Reset your password - Crop Care',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">Crop Care</h1>
        </div>
        
        <h2 style="color: #16a34a; margin-bottom: 20px;">Password Reset Request</h2>
        
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          You requested to reset your password for your Crop Care account. Click the button below to set a new password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="display: inline-block; 
                    background-color: #16a34a; 
                    color: white; 
                    padding: 14px 28px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    font-size: 16px;">
            Reset Password
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
          If the button doesn't work, you can copy and paste this link into your browser:
        </p>
        <p style="word-break: break-all; color: #666; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 14px;">
          ${resetUrl}
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
            <strong>Important:</strong> This password reset link will expire in 1 hour.
          </p>
          <p style="font-size: 14px; color: #666;">
            If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
          <p>© 2025 Crop Care. All rights reserved.</p>
        </div>
      </div>
    `
  }

  try {
    await sgMail.send(msg)
    console.log('Password reset email sent successfully')
  } catch (error) {
    console.error('SendGrid error:', error)
    throw new Error('Failed to send password reset email')
  }
}