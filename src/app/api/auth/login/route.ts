import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { serialize } from 'cookie'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { email, password } = await req.json()

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        { message: 'Account is inactive' },
        { status: 403 }
      )
    }

    const token = JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    const headers = new Headers()

    headers.append(
      'Set-Cookie',
      serialize('auth', token, { httpOnly: true, secure: true, path: '/' })
    )

    return NextResponse.json(
      { message: 'Login successful', role: user.role },
      { headers }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error logging in', error },
      { status: 500 }
    )
  }
}
