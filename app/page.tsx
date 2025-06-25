export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Zeitmanagement SaaS</h1>
      <p>Erfasse und verwalte deine Arbeitszeiten einfach online!</p>
      <a href="/login" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Einloggen / Registrieren
      </a>
    </main>
  );
}