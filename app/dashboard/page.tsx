"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Time {
  id: string;
  started_at: string;
  ended_at: string | null;
  note: string | null;
  duration_minutes: number | null;
  project_id: string | null;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface Invoice {
  id: string;
  invoice_number: string | null;
  amount: number | null;
  status: string | null;
  issued_at: string | null;
  due_date: string | null;
  project_id: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [times, setTimes] = useState<Time[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [note, setNote] = useState("");
  const [working, setWorking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) router.replace("/login");
      else {
        fetchAllData(session.user.id);
      }
    });
    supabase.auth.onAuthStateChange((_, session) => setSession(session));
    // eslint-disable-next-line
  }, []);

  async function fetchAllData(userId: string) {
    // Zeiteinträge holen
    const { data: timeData } = await supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false });
    setTimes(timeData || []);
    setWorking(timeData && timeData[0] && !timeData[0].ended_at);

    // Projekte holen
    const { data: projectData } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setProjects(projectData || []);

    // Rechnungen holen
    const { data: invoiceData } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setInvoices(invoiceData || []);
  }

  async function handleStart() {
    await supabase.from("time_entries").insert({
      user_id: session.user.id,
      started_at: new Date().toISOString(),
      note,
    });
    setNote("");
    fetchAllData(session.user.id);
  }

  async function handleStop(id: string) {
    const endedAt = new Date().toISOString();
    // Optionale automatische Dauerberechnung
    const entry = times.find((t) => t.id === id);
    let duration = null;
    if (entry) {
      duration =
        Math.round(
          (new Date(endedAt).getTime() - new Date(entry.started_at).getTime()) /
            60000
        );
    }

    await supabase
      .from("time_entries")
      .update({ ended_at: endedAt, duration_minutes: duration })
      .eq("id", id);
    fetchAllData(session.user.id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (!session) return null;

  return (
    <main>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <Link href="/profile">
        <button>Profil</button>
      </Link>
      <Link href="/settings">
        <button>Settings</button>
      </Link>
      <hr />

      {/* ZEITERFASSUNG */}
      <div>
        <input
          type="text"
          placeholder="Beschreibung (optional)"
          value={note}
          disabled={working}
          onChange={(e) => setNote(e.target.value)}
        />
        {!working ? (
          <button onClick={handleStart}>Zeit starten</button>
        ) : (
          <button onClick={() => handleStop(times[0].id)}>
            Zeit stoppen
          </button>
        )}
      </div>

      <h3>Letzte Zeiteinträge</h3>
      <table>
        <thead>
          <tr>
            <th>Start</th>
            <th>Ende</th>
            <th>Dauer</th>
            <th>Notiz</th>
          </tr>
        </thead>
        <tbody>
          {times.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.started_at).toLocaleString()}</td>
              <td>
                {t.ended_at ? new Date(t.ended_at).toLocaleString() : "-"}
              </td>
              <td>
                {t.duration_minutes !== null
                  ? `${t.duration_minutes} min`
                  : t.ended_at
                  ? `${(
                      (new Date(t.ended_at).getTime() -
                        new Date(t.started_at).getTime()) /
                      60000
                    ).toFixed(1)} min`
                  : "-"}
              </td>
              <td>{t.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PROJEKTE */}
      <h3>Projekte</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Beschreibung</th>
            <th>Erstellt am</th>
            <th>Projekt-ID</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{new Date(p.created_at).toLocaleString()}</td>
              <td>{p.id}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* RECHNUNGEN */}
      <h3>Rechnungen</h3>
      <table>
        <thead>
          <tr>
            <th>Nummer</th>
            <th>Betrag</th>
            <th>Status</th>
            <th>Erstellt am</th>
            <th>Fällig am</th>
            <th>Projekt-ID</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.invoice_number || "-"}</td>
              <td>{inv.amount ? `${inv.amount.toFixed(2)}` : "-"}</td>
              <td>{inv.status || "-"}</td>
              <td>
                {inv.issued_at
                  ? new Date(inv.issued_at).toLocaleDateString()
                  : "-"}
              </td>
              <td>
                {inv.due_date
                  ? new Date(inv.due_date).toLocaleDateString()
                  : "-"}
              </td>
              <td>{inv.project_id || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}