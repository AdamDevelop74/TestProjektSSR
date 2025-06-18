// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  
  console.log('Middleware is running...') // 👈 sichtbar im Terminal

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  
  // 👇 PRÜFUNG HINZUFÜGEN!
  if (!session) {
    // Nicht eingeloggt → redirect zu Login
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }




  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*', // schützt das Dashboard
    '/api/auth/:path*', // 👈 wichtig!
    ], 
}

