import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/jwt'
import { ReactNode } from 'react'

export default async function EventManageLayout({
  children,
}: {
  children: ReactNode
}) {
  // Verify authentication token
  const authResult = await verifyToken()
  
  if (authResult !== true) {
    // Token is invalid, expired, or missing - redirect to login
    redirect('/manage')
  }

  return <>{children}</>
}
