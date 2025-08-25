// app/api/auth/set-session/route.ts
//Login-> Token im Cookie speichern
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { access_token, refresh_token, expires_in } = await req.json()

    if (!access_token || !refresh_token) {
      console.error("❌ Tokens fehlen in der Anfrage.")
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 })
    }

    // Optional: Ablauf (expires_in) vom Supabase-Tokenset holen, sonst 1h
    const accessTokenMaxAge = expires_in ? parseInt(expires_in) : 60 * 60 * 24 * 1 // 1 Tag
    const refreshTokenMaxAge = 60 * 60 * 24 * 30 // 30 Tage

    const response = NextResponse.json({ success: true })

    // Access-Token als HttpOnly-Cookie setzen (für Server Components & SSR!)
    response.cookies.set('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: accessTokenMaxAge, // Sekunden (1h default)
    })

    // Refresh-Token als HttpOnly-Cookie setzen (länger gültig)
    response.cookies.set('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: refreshTokenMaxAge, // 30 Tage
    })

    console.log("route/access_token", access_token)
    console.log("route/refresh_token", refresh_token)

    return response
  } catch (err) {
    console.error("❌ Unerwarteter Fehler:", err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}



// Setzt die Session-Tokens per POST (z.B. aus Magic Link oder OAuth-Callback).
// Nutzt explizit supabase.auth.setSession({...}), was dann auch die Auth-Cookies korrekt aktualisiert.
// Erfolgreich? Gibt { success: true } zurück.