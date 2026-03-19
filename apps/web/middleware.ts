import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseJwt(token: string): { role?: string; slug?: string } | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Se o token for "mock-token" (nosso bypass), simula um usuário
  const token = request.cookies.get('token')?.value;
  const user = (token === 'mock-token' || token === 'token') 
    ? { slug: 'dashboard', role: 'USER' } // Bypass para desenvolvimento
    : (token ? parseJwt(token) : null);

  // Rotas públicas: redireciona para dashboard se já autenticado
  if (pathname.startsWith('/login') || pathname.startsWith('/cadastro') || pathname.startsWith('/reset-senha')) {
    if (user?.slug) {
      return NextResponse.redirect(new URL(`/${user.slug}/dashboard`, request.url));
    }
    return NextResponse.next();
  }

  // Rotas admin: exige SUPER_ADMIN
  if (pathname.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url));
    if (user.role !== 'SUPER_ADMIN') return NextResponse.redirect(new URL(`/${user.slug}/dashboard`, request.url));
    return NextResponse.next();
  }

  // Rotas protegidas do tenant (dashboard e configurações)
  if (pathname.match(/^\/[^/]+\/(dashboard|settings)/)) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
