import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const {
    name,
    email,
    password,
    role = 'user',
    status = 'active',
  } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Missing email or password' },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, status },
    })
    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating user', error },
      { status: 500 }
    )
  }
}
