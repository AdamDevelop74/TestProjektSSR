import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Beispiel: Redirect auf /login wenn nicht eingeloggt
  return NextResponse.next();
}

// Optional, um nur bestimmte Pfade zu verarbeiten
export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};