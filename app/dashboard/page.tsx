"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Time {
  id: string;
  started_at: string;
  ended_at: string | null;
  description: string | null;
}

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [times, setTimes] = useState<Time[]>([]);
  const [desc, setDesc] = useState("");
  const [working, setWorking] = useState(false);
  const router = useRouter();

  // Session holen (client-side)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) router.replace("/login");
      else fetchTimes();
    });
    supabase.auth.onAuthStateChange((_, session) => setSession(session));
    // eslint-disable-next-line
  }, []);

  async function fetchTimes() {
    const { data } = await supabase.from("times").select("*").order("started_at", { ascending: false });
    setTimes(data || []);
    setWorking(data?.[0] && !data[0].ended_at);
  }

  async function handleStart() {
    await supabase.from("times").insert({ user_id: session.user.id, started_at: new Date().toISOString(), description: desc });
    setDesc("");
    fetchTimes();
  }

  async function handleStop(id: string) {
    await supabase.from("times").update({ ended_at: new Date().toISOString() }).eq("id", id);
    fetchTimes();
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
      <Link href="/profile"><button>Profil</button></Link>
      <Link href="/settings"><button>Account</button></Link>
      <hr />
      <div>
        <input
          type="text"
          placeholder="Beschreibung (optional)"
          value={desc}
          disabled={working}
          onChange={e => setDesc(e.target.value)}
        />
        {!working ?
          <button onClick={handleStart}>Zeit starten</button>
          :
          <button onClick={() => handleStop(times[0].id)}>Zeit stoppen</button>
        }
      </div>
      <h3>Letzte Zeiteinträge</h3>
      <table>
        <thead>
          <tr><th>Start</th><th>Ende</th><th>Dauer</th><th>Beschreibung</th></tr>
        </thead>
        <tbody>
        {times.map(t => (
          <tr key={t.id}>
            <td>{new Date(t.started_at).toLocaleString()}</td>
            <td>{t.ended_at ? new Date(t.ended_at).toLocaleString() : "-"}</td>
            <td>{t.ended_at ? `${((new Date(t.ended_at).getTime() - new Date(t.started_at).getTime())/60000).toFixed(1)} min` : "-"}</td>
            <td>{t.description}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </main>
  );
}