'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(x => setUser(x.data.user));
  }, []);

  if (!user) return <div>Lade Profil...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 border rounded">
      <h2 className="text-xl mb-4">Profil</h2>
      <div>
        <label className="block">E-Mail: {user.email}</label>
        {/* Weitere Felder wie Name, Avatar hier */}
      </div>
      <form /*... zum Ändern anderer Felder ...*/>
        {/* Beispiel: Name ändern */}
      </form>
    </div>
  );
}