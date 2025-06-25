"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.push("/dashboard");
    else alert(error.message);
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
        <input type="email" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
        <input type="password" placeholder="Passwort" value={password} onChange={e => setPassword(e.target.value)} required />
        <button onClick={handleLogin} disabled={loading}>Login</button>
        <button onClick={handleSignup} disabled={loading}>Registrieren</button>
      </form>
    </main>
  );
}