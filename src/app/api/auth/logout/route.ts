import { serialize } from 'cookie'
import { NextResponse } from 'next/server'

export async function POST() {
  const headers = new Headers()

  // Remove o cookie de autenticação
  headers.append(
    'Set-Cookie',
    serialize('auth', '', {
      httpOnly: true,
      secure: true,
      path: '/',
      expires: new Date(0), // Define a data de expiração como passada
    })
  )

  return NextResponse.json({ message: 'Logout successful' }, { headers })
}
