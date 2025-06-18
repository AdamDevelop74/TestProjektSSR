// lib/supabaseClient.ts
import { createBrowserClient } from "@supabase/ssr"; //Nur hier darf supabase-Client gebaut und exportiert werden!!!
import { Database } from "@/types/supabase"; // Optional: eigenes Typing von Supabase

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);




// Wofür: Der Supabase Client für den Browser (Client-Komponenten, Hooks, etc.)
// Wie: createBrowserClient von @supabase/ssr.
// Wichtig: Nur hier wird der Client als Singleton exportiert.
// Wann nutzen: Nur importieren in Komponenten, die im Browser laufen (z.B. React-Clientkomponenten; nicht in API-Routes oder Server Components).
// Client (Browser), RouteHandler (API), Server (SSR/Server Components) – jeweils getrennt.
// Über /api/auth/set-session wird die Session serverseitig gesetzt — und das ist essenziell, wenn du SSR (Server Side-Protected) APIs


// **Wichtige Best Practices & Unterschiede:
// Datei/Modul	                Für Umfeld	                Wann verwenden?	                               Wie handled Auth/Session?
// lib/supabaseClient.ts	      Browser (Client)	          React-Clientkomponenten	                       Lokaler Storage (Client)
// lib/supabaseServer.ts	      Server Components, SSR	    Server-Komponenten/Aktionen im App Router	     Cookies über Next.js
// lib/supabaseRouteHandler.ts	Route Handlers (API)	      app/api/.../route.ts	                         Cookies über Next.js