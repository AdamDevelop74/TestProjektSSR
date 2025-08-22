// lib/supabaseServerClient.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export function createSupabaseServerClient() {
  return createServerComponentClient({ cookies }); // KEINE Übergabe von Url und Key nötig!
}




// Wofür:Server Components und SSR (Server Side Rendering) in Next.js.
// Wie:Mit createServerComponentClient, nutzt ebenfalls Next.js-Cookies.
// Wann nutzen:Innerhalb von Server Components oder Server Actions (besonders, wenn Session/Auth benötigt wird).
// Wichtig:Nicht im Browser importieren!


