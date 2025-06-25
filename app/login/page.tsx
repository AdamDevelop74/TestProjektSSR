'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.push('/dashboard');
    else setError('Fehler beim Login');
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="mb-4 text-2xl">Login</h2>
      <input type="email" placeholder="Email"
        value={email} onChange={e => setEmail(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
        required
      />
      <input type="password" placeholder="Passwort"
        value={password} onChange={e => setPassword(e.target.value)}
        className="block w-full mb-4 p-2 border rounded"
        required
      />
      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
        Einloggen
      </button>
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </form>
  );
}