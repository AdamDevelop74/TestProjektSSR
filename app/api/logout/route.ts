// /app/api/logout/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'

export async function POST(req: Request) {
  // Hol die Cookies für Supabase
  const cookieStore = cookies()

  // Nutze createServerActionClient für API-Handler!
  const supabase = createServerActionClient<{ cookies: typeof cookieStore }>({
    cookies: () => cookieStore
  })
  
  // Logout
  await supabase.auth.signOut()

  // Redirect zurück zum Login
  return NextResponse.redirect(new URL('/login', req.url))
}