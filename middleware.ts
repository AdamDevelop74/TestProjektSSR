import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/profile', '/settings'];

export function middleware(request: NextRequest) {
  const { cookies, nextUrl } = request;
  const isProtected = PROTECTED_PATHS.some((p) => nextUrl.pathname.startsWith(p));
  const token = cookies.get('sb-access-token')?.value;

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if ((nextUrl.pathname === '/login' || nextUrl.pathname === '/') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*', '/login', '/'],
};