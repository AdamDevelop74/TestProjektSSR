"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Time {
  id: string;
  started_at: string;
  ended_at: string | null;
  note: string | null;
  duration_minutes: number | null;
  project_id: string | null;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface Invoice {
  id: string;
  invoice_number: string | null;
  amount: number | null;
  status: string | null;
  issued_at: string | null;
  due_date: string | null;
  project_id: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [times, setTimes] = useState<Time[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) router.replace("/login");
      else {
        fetchAllData(session.user.id);
      }
    });
    supabase.auth.onAuthStateChange((_, session) => setSession(session));
    // eslint-disable-next-line
  }, []);

  async function fetchAllData(userId: string) {
    const { data: timeData } = await supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false });
    setTimes(timeData || []);

    const { data: projectData } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setProjects(projectData || []);

    const { data: invoiceData } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setInvoices(invoiceData || []);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-8">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-purple-800">Dashboard</h2>
          <button
            className="bg-rose-400 hover:bg-rose-600 transition text-white font-semibold py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="flex gap-2 mb-8">
          <Link href="/profile" className="bg-blue-200 hover:bg-blue-400 transition px-3 py-2 rounded text-blue-900 font-medium">
            Profil
          </Link>
          <Link href="/settings" className="bg-green-200 hover:bg-green-400 transition px-3 py-2 rounded text-green-900 font-medium">
            Settings
          </Link>
        </div>

        {/* ZEITEINTRÄGE */}
        <h3 className="text-2xl text-blue-900 mb-2 font-bold">Letzte Zeiteinträge</h3>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border shadow-md rounded-xl overflow-hidden bg-white text-sm">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-3 text-left">Start</th>
                <th className="p-3 text-left">Ende</th>
                <th className="p-3 text-left">Dauer</th>
                <th className="p-3 text-left">Notiz</th>
              </tr>
            </thead>
            <tbody>
              {times.map((t) => (
                <tr key={t.id} className="even:bg-blue-50">
                  <td className="p-3">{new Date(t.started_at).toLocaleString()}</td>
                  <td className="p-3">
                    {t.ended_at ? new Date(t.ended_at).toLocaleString() : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-3">
                    {t.duration_minutes !== null
                      ? `${t.duration_minutes} min`
                      : t.ended_at
                        ? `${(
                          (new Date(t.ended_at).getTime() -
                            new Date(t.started_at).getTime()) /
                          60000
                        ).toFixed(1)} min`
                        : "-"}
                  </td>
                  <td className="p-3">{t.note || <span className="text-gray-400">-</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PROJEKTE */}
        <h3 className="text-2xl text-teal-900 mb-2 font-bold">Projekte</h3>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border shadow-md rounded-xl overflow-hidden bg-white text-sm">
            <thead className="bg-teal-100 text-teal-900">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Beschreibung</th>
                <th className="p-3 text-left">Erstellt am</th>
                <th className="p-3 text-left">Projekt-ID</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="even:bg-teal-50">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.description || <span className="text-gray-400">-</span>}</td>
                  <td className="p-3">{new Date(p.created_at).toLocaleString()}</td>
                  <td className="p-3">{p.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RECHNUNGEN */}
        <h3 className="text-2xl text-pink-900 mb-2 font-bold">Rechnungen</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border shadow-md rounded-xl overflow-hidden bg-white text-sm">
            <thead className="bg-pink-100 text-pink-900">
              <tr>
                <th className="p-3 text-left">Nummer</th>
                <th className="p-3 text-left">Betrag</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Erstellt am</th>
                <th className="p-3 text-left">Fällig am</th>
                <th className="p-3 text-left">Projekt-ID</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="even:bg-pink-50">
                  <td className="p-3">{inv.invoice_number || <span className="text-gray-400">-</span>}</td>
                  <td className="p-3">{inv.amount ? `${inv.amount.toFixed(2)}` : <span className="text-gray-400">-</span>}</td>
                  <td className="p-3">
                    <span
                      className={
                        inv.status === "bezahlt"
                          ? "text-green-700 font-bold"
                          : inv.status === "offen"
                          ? "text-orange-600 font-semibold"
                          : "text-gray-700"
                      }
                    >
                      {inv.status || "-"}
                    </span>
                  </td>
                  <td className="p-3">
                    {inv.issued_at
                      ? new Date(inv.issued_at).toLocaleDateString()
                      : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-3">
                    {inv.due_date
                      ? new Date(inv.due_date).toLocaleDateString()
                      : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-3">{inv.project_id || <span className="text-gray-400">-</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}