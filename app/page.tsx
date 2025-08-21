// app/page.tsx  ->LandingPage als Server-Komponente (Kein "use client" nötig, daher SSR!)
import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <h1>Zeiterfassung SaaS</h1>
      <p>Einfach online Arbeitszeiten erfassen.</p>
      <Link href="/login">
        <button>Login / Registrieren</button>
      </Link>
    </main>
  );
}



