// /app/api/logout/route.ts

import { NextResponse } from 'next/server'
//import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  // Supabase bereit machen (TypeScript)
  //const supabase = createServerComponentClient({ req, res: null })
  //await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/login', req.url))
}