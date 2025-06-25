// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "../../lib/supabaseClient";
// import Link from "next/link";

// export default function ProfilePage() {
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [session, setSession] = useState<any>(null);
//   const router = useRouter();

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       if (!session) router.replace("/login");
//       else fetchProfile(session.user.id);
//     });
//     // eslint-disable-next-line
//   }, []);

//   async function fetchProfile(uid: string) {
//     const { data } = await supabase.from('users').select('name').eq('id', uid).single();
//     setUsername(data?.name || "");
//   }

//   async function updateProfile() {
//     setLoading(true);
//     await supabase.from('users').upsert({ id: session.user.id, name });
//     setLoading(false);
//     alert("Profil aktualisiert!");
//   }

//   if (!session) return null;

//   return (
//     <main>
//       <h2>Profil bearbeiten</h2>
//       <Link href="/dashboard"><button>Dashboard</button></Link>
//       <Link href="/settings"><button>Settings</button></Link>
//       <hr />      
//       <label>
//         Name: <input value={username} onChange={e => setUsername(e.target.value)} />
//       </label>
//       <button onClick={updateProfile} disabled={loading}>Speichern</button>
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) router.replace("/login");
      else {
        setEmail(session.user.email); // Auth Email
        fetchProfile(session.user.id);
      }
    });
  }, [router]);

  async function fetchProfile(uid: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", uid).single();
    if (error) {
      // Optional: Fehlerbehandlung
      setName("");
    } else {
      setName(data?.name || "");
      // Falls du weitere Felder hast, diese hier auch setzen
    }
  }

  async function updateProfile() {
    setLoading(true);
    const { error } = await supabase.from("users").upsert({ id: session.user.id, name });
    setLoading(false);
    if (error) alert("Fehler beim Speichern");
    else alert("Profil aktualisiert!");
  }

  if (!session) return null;

  return (
    <main>
      <h2>Profil bearbeiten</h2>
      <Link href="/dashboard"><button>Dashboard</button></Link>
      <Link href="/settings"><button>Settings</button></Link>
      <hr />
      <div>
        <p><b>E-Mail (auth):</b> {email}</p>
        <label>
          Name:{" "}
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>
        <br />
        <button onClick={updateProfile} disabled={loading}>
          Speichern
        </button>
      </div>
    </main>
  );
}