import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Here we would decode the JWT or get the session
  const token = request.cookies.get('token')?.value;
  // Mock parsed token
  const user = token ? { role: 'SUPER_ADMIN', slug: 'demo-org' } : null;

  // Rotas /(auth)/* → públicas, redirecionar para dashboard se já autenticado
  if (pathname.startsWith('/login') || pathname.startsWith('/cadastro') || pathname.startsWith('/reset-senha')) {
    if (user) {
      return NextResponse.redirect(new URL(`/${user.slug}/dashboard`, request.url));
    }
    return NextResponse.next();
  }

  // Rotas /admin/* → exigem role: SUPER_ADMIN no JWT. Se não, redirect para /[slug]/dashboard
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL(`/${user.slug}/dashboard`, request.url));
    }
    return NextResponse.next();
  }

  // Rotas /(tenant)/[slug]/* → exigem JWT válido e membro ativo na organização do slug
  // Simplified for boilerplate
  if (pathname.match(/^\/[^/]+\/dashboard/)) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
