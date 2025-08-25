// app/login/page.tsx ->LoginPage: mit "use client" → läuft im Browser, muss Client Only bleiben (Hooks).
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Hilfsfunktion, um nach Login die Tokens zu speichern
  async function setSessionCookie(session: any) {
    // Hole Tokens aus Supabase Session Object (evtl. .session oder .data.session, je nach Client-Version)
    const { access_token, refresh_token, expires_in } = session;
    
    // API-Route zum Setzen der Cookies aufrufen!
    await fetch("/api/auth/set-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",                  // <- damit Browser Cookie akzeptiert
      body: JSON.stringify({ access_token, refresh_token, expires_in }),
    });
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Supabase-Login
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.session) {
      await setSessionCookie(data.session); // Session an backend/route zum Cookie setzen schicken
      console.log("login/page/setSessionCookie/data.session", data.session)
      router.push("/dashboard");
    } else if (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (!error) alert("Bitte E-Mail bestätigen!");
    else alert(error.message);
    setLoading(false);
  };

  return (
    <main>
      <h2>Login / Registrieren</h2>
      <form>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button onClick={handleLogin} disabled={loading}>Login</button>
        <button onClick={handleSignup} disabled={loading}>Registrieren</button>
      </form>
    </main>
  );
}