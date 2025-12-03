import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'

export interface JWTPayload {
  sub: string;
}

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// Ensure JWT_SECRET is available in production
const JWT_SECRET = process.env.JWT_SECRET || 'not_your_concern';
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production')
}


const secret = JWT_SECRET || (process.env.NODE_ENV === 'development' ? 'dev-secret-key' : '')

export async function createToken(username: string): Promise<string> {
  if (!secret) {
    throw new Error('JWT secret is not configured')
  }
  
  return jwt.sign(
    { username },
    secret,
    { expiresIn: '1h' }
  )
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth-token')?.value || null
}

export async function verifyToken(): Promise<true | string> {
  if (!secret) throw new Error('JWT secret is not configured')

  try {
    const token = await getAuthToken()
    if (!token) return 'No token found'

    const decoded = jwt.verify(token, secret) as DecodedToken
    const currentTime = Math.floor(Date.now() / 1000)
    if (decoded.exp < currentTime) {
      return 'Token is expired, please login again'
    }

    return true
  } catch (error) {
    console.error('JWT verify error:', error)
    return 'Invalid token'
  }
}


export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
    path: '/',
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

