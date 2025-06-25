"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) router.replace("/login");
      else fetchProfile(session.user.id);
    });
    // eslint-disable-next-line
  }, []);

  async function fetchProfile(uid: string) {
    const { data } = await supabase.from('profiles').select('username').eq('id', uid).single();
    setUsername(data?.username || "");
  }

  async function updateProfile() {
    setLoading(true);
    await supabase.from('profiles').upsert({ id: session.user.id, username });
    setLoading(false);
    alert("Profil aktualisiert!");
  }

  if (!session) return null;

  return (
    <main>
      <h2>Profil bearbeiten</h2>
      <label>
        Name: <input value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <button onClick={updateProfile} disabled={loading}>Speichern</button>
    </main>
  );
}