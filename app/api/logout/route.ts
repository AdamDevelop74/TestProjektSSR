// /app/api/logout/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'  // falls genutzt

export async function POST(req: Request) {
  // Supabase bereit machen (TypeScript)
  const supabase = createServerComponentClient({ cookies: () => cookies()  })

  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/login', req.url))
}

