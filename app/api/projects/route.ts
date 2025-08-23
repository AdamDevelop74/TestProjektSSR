// app/api/projects/route.ts
// import { supabaseServer } from '@/lib/supabaseServer';
// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   const supabase = supabaseServer();

//   const { name, description } = await request.json();
//   const { data: userData } = await supabase.auth.getUser();

//   if (!userData?.user) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const { data, error } = await supabase
//     .from('projects')
//     .insert([
//       {
//         name,
//         description,
//         user_id: userData.user.id, // falls du Userbindung hast
//       },
//     ])
//     .select();

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   return NextResponse.json({ project: data[0] });
// }

// app/api/projects/route.ts
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();

  const { name, description } = await request.json();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        name,
        description,
        user_id: userData.user.id,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data?.[0] });
}




// Beispiel für eine Server-API, die einen Project-Record für den eingeloggten User anlegt.
// Holt User mit supabase.auth.getUser() (Account muss authentifiziert sein – sonst 401).
// Nutzt supabaseServer() (korrekt!).
// Schreibt einen Eintrag in projects, verknüpft mit User-ID.