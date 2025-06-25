"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function SettingsPage() {
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) router.replace("/login");
    });
    // eslint-disable-next-line
  }, []);

  async function updatePassword() {
    if(password.length < 6) return alert("Mind. 6 Zeichen");
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) alert("Passwort geändert!");
    else alert(error.message);
  }

  if (!session) return null;

  return (
    <main>
       <h2>Account Einstellungen</h2>
      <Link href="/dashboard"><button>Dashboard</button></Link>
      <Link href="/profile"><button>Profil</button></Link>
       <hr />       
      <label>
        Neues Passwort:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button onClick={updatePassword}>Passwort ändern</button>
    </main>
  );
}