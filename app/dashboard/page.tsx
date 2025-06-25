'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function DashboardPage() {
  const [times, setTimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Neue Zeit erfassen (Beispiel)
  const addEntry = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('times').insert([{
      user_id: user?.id,
      start_time: new Date(),
      end_time: null,
      description: 'Neue Aufgabe'
    }]);
    loadTimes();
  };

  const loadTimes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('times')
      .select('*')
      .order('start_time', { ascending: false });
    if (!error) setTimes(data ?? []);
    setLoading(false);
  };

  useEffect(() => { loadTimes(); }, []);

  return (
    <div className="p-10">
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <button onClick={addEntry} className="mb-4 bg-green-500 text-white px-4 py-2 rounded">Neue Zeit erfassen</button>
      {loading ? <div>Lade...</div> : (
        <ul>
          {times.map(t =>
            <li key={t.id} className="mb-2 border p-2 rounded bg-gray-50">
              <div>Start: {new Date(t.start_time).toLocaleString()}</div>
              {t.end_time && <div>Ende: {new Date(t.end_time).toLocaleString()}</div>}
              <div>Beschreibung: {t.description}</div>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}