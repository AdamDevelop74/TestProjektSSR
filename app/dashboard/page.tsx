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
    <main className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-green-200 py-8">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-emerald-800">Dashboard</h2>
          <button
            className="bg-rose-500 hover:bg-rose-700 transition text-white font-semibold py-2 px-5 rounded-lg shadow"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Profil/Settings Buttons als groß, nebeneinander und kräftig blau */}
        <div className="flex gap-6 mb-8">
           <button
            type="button"
            onClick={() => router.push("/profile")}
            className="bg-blue-600 hover:bg-blue-800 transition px-6 py-3 rounded-lg text-white font-bold shadow text-lg text-center block w-40"
            style={{ letterSpacing: "0.02em" }}
          >
            Profil
          </button>
          <button
            type="button"
            onClick={() => router.push("/settings")}
            className="bg-blue-600 hover:bg-blue-800 transition px-6 py-3 rounded-lg text-white font-bold shadow text-lg text-center block w-40"
            style={{ letterSpacing: "0.02em" }}
          >
            Settings
          </button>
        </div>

        {/* ZEITEINTRÄGE */}
        <h3 className="text-2xl text-blue-900 mb-2 font-bold">Letzte Zeiteinträge</h3>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border border-gray-300 shadow-md rounded-xl overflow-hidden bg-white text-sm">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-3 text-left border border-gray-300">Start</th>
                <th className="p-3 text-left border border-gray-300">Ende</th>
                <th className="p-3 text-left border border-gray-300">Dauer</th>
                <th className="p-3 text-left border border-gray-300">Notiz</th>
              </tr>
            </thead>
            <tbody>
              {times.map((t) => (
                <tr key={t.id} className="even:bg-blue-50">
                  <td className="p-3 border border-gray-300">{new Date(t.started_at).toLocaleString()}</td>
                  <td className="p-3 border border-gray-300">
                    {t.ended_at ? new Date(t.ended_at).toLocaleString() : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-3 border border-gray-300">
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
                  <td className="p-3 border border-gray-300">{t.note || <span className="text-gray-400">-</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PROJEKTE */}
        <h3 className="text-2xl text-teal-900 mb-2 font-bold">Projekte</h3>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border border-gray-300 shadow-md rounded-xl overflow-hidden bg-white text-sm">
            <thead className="bg-teal-100 text-teal-900">
              <tr>
                <th className="p-3 text-left border border-gray-300">Name</th>
                <th className="p-3 text-left border border-gray-300">Beschreibung</th>
                <th className="p-3 text-left border border-gray-300">Erstellt am</th>
                <th className="p-3 text-left border border-gray-300">Projekt-ID</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="even:bg-teal-50">
                  <td className="p-3 border border-gray-300">{p.name}</td>
                  <td className="p-3 border border-gray-300">{p.description || <span className="text-gray-400">-</span>}</td>
                  <td className="p-3 border border-gray-300">{new Date(p.created_at).toLocaleString()}</td>
                  <td className="p-3 border border-gray-300">{p.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RECHNUNGEN */}
        <h3 className="text-2xl text-pink-900 mb-2 font-bold">Rechnungen</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 shadow-md rounded-xl overflow-hidden bg-white text-sm">
            <thead className="bg-pink-100 text-pink-900">
              <tr>
                <th className="p-3 text-left border border-gray-300">Nummer</th>
                <th className="p-3 text-left border border-gray-300">Betrag</th>
                <th className="p-3 text-left border border-gray-300">Status</th>
                <th className="p-3 text-left border border-gray-300">Erstellt am</th>
                <th className="p-3 text-left border border-gray-300">Fällig am</th>
                <th className="p-3 text-left border border-gray-300">Projekt-ID</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="even:bg-pink-50">
                  <td className="p-3 border border-gray-300">{inv.invoice_number || <span className="text-gray-400">-</span>}</td>
                  <td className="p-3 border border-gray-300">{inv.amount ? `${inv.amount.toFixed(2)}` : <span className="text-gray-400">-</span>}</td>
                  <td className="p-3 border border-gray-300">
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
                  <td className="p-3 border border-gray-300">
                    {inv.issued_at
                      ? new Date(inv.issued_at).toLocaleDateString()
                      : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {inv.due_date
                      ? new Date(inv.due_date).toLocaleDateString()
                      : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-3 border border-gray-300">{inv.project_id || <span className="text-gray-400">-</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}