import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth')?.value // Acesse o valor do cookie
  const url = req.nextUrl.clone()

  // Se o usuário não estiver autenticado e tentar acessar uma página protegida
  if (!token && url.pathname.startsWith('/dashboard')) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const user = token ? JSON.parse(token) : null

  // Se o usuário não for admin e tentar acessar uma página restrita
  if (url.pathname.startsWith('/admin') && user?.role !== 'admin') {
    url.pathname = '/403' // Página de erro (não autorizado)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
