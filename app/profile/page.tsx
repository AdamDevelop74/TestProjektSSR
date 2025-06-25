"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function ProfilePage() {
  const [email, setEmail] = useState("");  
  const [phone, setPhone] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [session, setSession] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) router.replace("/login");
      else {
        setEmail(session.user.email);        
        setPhone(session.user.phone ?? "");
        setNewPhone(session.user.phone ?? "");
        setDisplayName(session.user.user_metadata?.display_name ?? "");
        setNewDisplayName(session.user.user_metadata?.display_name ?? "");
      }
    });
  }, [router]);

  // Phone ändern
  const handlePhoneChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (newPhone === phone) {
      setMessage("Die neue Telefonnummer ist dieselbe wie die aktuelle.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ phone: newPhone });
    if (error) {
      setMessage("Fehler: " + error.message);
    } else {
      setMessage("Telefonnummer geändert. Bestätige ggf. deine neue Nummer via SMS.");
      setPhone(newPhone);
    }
    setLoading(false);
  };

  // Anzeigename ändern
  const handleDisplayNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (newDisplayName === displayName) {
      setMessage("Der neue Anzeigename ist derselbe wie der aktuelle.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({
      data: { display_name: newDisplayName },
    });
    if (error) {
      setMessage("Fehler: " + error.message);
    } else {
      setMessage("Anzeigename aktualisiert.");
      setDisplayName(newDisplayName);
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

      <div style={{ marginBottom: 15 }}>
        <b>E-Mail:</b> {email}
      </div>

      <div style={{ marginBottom: 15 }}>
        <form onSubmit={handlePhoneChange}>
          <label>
            <b>Telefonnummer:</b>
            <input
              type="tel"
              value={newPhone}
              onChange={e => setNewPhone(e.target.value)}
              disabled={loading}
              placeholder="+49123456789"
              style={{ marginLeft: 10 }}
            />
          </label>
          <button type="submit" disabled={loading}>Telefon aktualisieren</button>
        </form>
      </div>

      <div style={{ marginBottom: 15 }}>
        <form onSubmit={handleDisplayNameChange}>
          <label>
            <b>Anzeigename:</b>
            <input
              type="text"
              value={newDisplayName}
              onChange={e => setNewDisplayName(e.target.value)}
              disabled={loading}
              maxLength={64}
              style={{ marginLeft: 10 }}
            />
          </label>
          <button type="submit" disabled={loading}>Anzeigename aktualisieren</button>
        </form>
      </div>

      {message && <p>{message}</p>}
    </main>
  );
}