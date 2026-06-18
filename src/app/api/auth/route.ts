import { NextRequest, NextResponse } from 'next/server'
import { readCollection } from '@/lib/db'

interface UserRecord {
  id: string
  email: string
  password: string
  active: boolean
  name: string
  role: string
  createdAt: string
  updatedAt: string
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  const users = readCollection<UserRecord>('users')
  const user = users.find((u) => 
    u.email === email && u.password === password && u.active
  )
  
  if (!user) {
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 })
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return NextResponse.json({ 
    user: userWithoutPassword, 
    token: `token-${user.id}-${Date.now()}` 
  })
}
