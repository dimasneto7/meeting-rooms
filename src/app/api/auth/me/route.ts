import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verify } from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    // Obtenha o token do cookie
    const token = req.cookies.get('auth')?.value

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Verifique e decodifique o token (ajuste conforme a chave secreta do seu JWT)
    const decoded: any = verify(token, process.env.JWT_SECRET as string)

    // Recupere os dados do usuário com base no ID decodificado
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    })

    // Se o usuário não for encontrado, retorna erro
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Retorne as informações do usuário
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
