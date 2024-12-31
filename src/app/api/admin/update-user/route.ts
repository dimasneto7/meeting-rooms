import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function PATCH(req: Request) {
  const { userId, status, role } = await req.json()

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status, role },
    })
    return NextResponse.json(
      { message: 'User updated successfully', user },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating user', error },
      { status: 500 }
    )
  }
}
