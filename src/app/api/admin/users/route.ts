import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    })

    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching users', error },
      { status: 500 }
    )
  }
}
