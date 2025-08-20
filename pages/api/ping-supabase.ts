// pages/api/ping-supabase.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const response = await fetch(`${supabaseUrl}/rest/v1/ping_dummy`, {
    method: "GET",
    headers: {
      apiKey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    res.status(200).json({ message: 'Supabase ping erfolgreich OK!' });
  } else {
    res.status(500).json({ error: 'Ping fehlgeschlagen.' });
  }
}