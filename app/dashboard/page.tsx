// app/dashboard/page.tsx

//Diese Seite muss bei jedem Request neu gerendert werden." Das ist entscheidend, 
//damit Supabase Zugriff auf aktuelle Cookies (inkl. Session) hat.
export const dynamic = 'force-dynamic'; // <- WICHTIG!
//export const fetchCache = 'force-no-store'; 

import { supabaseServer } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import Dashboard from '@/components/Dashboard';


export default async function DashboardPage() {
  const supabase = supabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect('/auth/login');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id);
  if (projectsError) throw new Error(projectsError.message);

  const { data: invoices, error: invoicesError } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id);
  if (invoicesError) throw new Error(invoicesError.message);

  const { data: timeEntries, error: timeEntriesError } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', user.id);
  if (timeEntriesError) throw new Error(timeEntriesError.message);

  return (
    <Dashboard
      user={user}
      projects={projects}
      invoices={invoices}
      timeEntries={timeEntries}
    />
  );
}






// a) Supabase-Session prüfen
// Holt eine Instanz von Supabase (server-side, d.h. sicher auf dem Server, nicht im Browser).
// Prüft: Gibt es eine gültige Session?
// Nein: Weiterleitung zur Login-Seite (redirect('/auth/login')).
// Holt den eingeloggten Nutzer.
// Falls nicht gefunden: Erneut Redirect.

// b) Daten für Nutzer abfragen
// Projekte:
// Fragt alle Projekte ab, die zur User-ID passen:

// supabase.from('projects').select('*').eq('user_id', user.id)
// Rechnungen:
// Ähnlich für Rechnungen.

// Zeiteinträge:
// Fragt ebenfalls zeitspezifische Entries für den Nutzer ab.

// c) Rendering
// Gibt die Daten als Props an das Client-seitige Dashboard weiter:
// <Dashboard user={user} projects={...} invoices={...} timeEntries={...} />

