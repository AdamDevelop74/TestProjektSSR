"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function SettingsPage() { 
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) router.replace("/login");
    });
    // eslint-disable-next-line
  }, []);


  if (!session) return null;

  return (
    <main>
       <h2>Settings</h2>
      <Link href="/dashboard"><button>Dashboard</button></Link>
      <Link href="/profile"><button>Profil</button></Link>
       <hr />       
      <label>
       einfach nur Text        
      </label>      
    </main>
  );
}