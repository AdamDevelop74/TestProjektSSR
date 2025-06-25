"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function ProfilePage() {
  const [email, setEmail] = useState("");  
  const [newEmail, setNewEmail] = useState("");
  const [session, setSession] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) router.replace("/login");
      else {
        setEmail(session.user.email); // Auth Email        
        setNewEmail(session.user.email); // Feld vorbefüllen
      }
    });
  }, [router]);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (newEmail === email) {
      setMessage("Die neue E-Mail ist dieselbe wie die aktuelle.");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      setMessage("Fehler: " + error.message);
    } else {
      setMessage("E-Mail geändert. Bitte bestätige die neue Adresse via E-Mail.");
      setEmail(newEmail);
    }
    setLoading(false);
  };

  if (!session) return null;

  return (
    <main>
      <h2>Profil bearbeiten</h2>
      <Link href="/dashboard"><button>Dashboard</button></Link>
      <Link href="/settings"><button>Settings</button></Link>
      <hr />
      <div>
        <form onSubmit={handleEmailChange}>
          <label>
            <b>E-Mail ändern:</b>
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              disabled={loading}
              required
            />
          </label>
          <button type="submit" disabled={loading}>E-Mail aktualisieren</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </main>
  );
}