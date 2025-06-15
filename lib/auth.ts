import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import User, { IUser } from '@/models/User'
import connectDB from '@/lib/mongodb'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  email: string
  username: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}

export async function getUserFromToken(token: string): Promise<IUser | null> {
  try {
    const decoded = verifyToken(token)
    await connectDB()
    const user = await User.findById(decoded.userId).select('-password')
    return user
  } catch (error) {
    return null
  }
}

export async function getAuthUser(request: NextRequest): Promise<IUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value || 
                 request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) return null
    
    return await getUserFromToken(token)
  } catch (error) {
    return null
  }
}

export function createAuthResponse(user: IUser) {
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    username: user.username
  })

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      isEmailVerified: user.isEmailVerified
    },
    token
  }
}