// app/auth/login/page.tsx
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return <LoginForm />
}


//***
// LoginForm.tsx ist eine Client-Komponente ('use client').
// Importiert den supabaseClient aus lib/supabaseClient.ts (richtig!).
// Nutzt React State für E-Mail, Passwort, Status/Fehler.
// Nutzt den Next.js Router (useRouter), um nach Login weiterzuleiten.

// Login- und Registrierungs-Logik
// Zwei Modi (mode): Login oder Signup.
// Formular für E-Mail & Passwort – submit wird von handleEmailAuth behandelt.

// Bei Login:
// Wird mit Supabase signInWithPassword eingeloggt.
// Ganz wichtig: Session-Tokens (access_token, refresh_token) werden NICHT direkt im Browser gespeichert, sondern mit einem POST
// an dein eigenes API-Route-Backend /api/auth/set-session übertragen.
// Dort werden die Tokens mit Hilfe von Supabase-Helpern als sichere HTTPOnly Cookies gesetzt.
// Dadurch wird der Auth-Status serverseitig korrekt erkannt – nötig für Server Components, APIs und SSR!

// Nach erfolgreichem Login: Weiterleitung zum Dashboard.
// Signup-> Bei Registrierung:
// Versucht Supabase, den User anzulegen (signUp).
// Erfolg: Zeigt eine Nachricht ("Bestätige deine E-Mail").
// Fehler: Zeigt Fehlermeldung.
// Warum keine Session nach Signup?
// Supabase richtet sich in den meisten Projekten nach E-Mail-Bestätigung — User können sich erst nach E-Mail-Verify anmelden!
// Deshalb keine automatische Session oder Weiterleitung nach SignUp.

// 3. OAuth/Federated-Login
// Mit signInWithOAuth und provider (github, google, apple).
// Als Options wird ein Redirect zur Route /auth/callback angegeben.
// Dort musst du das Session-Token ggf. analog zu deiner Email-Login-Strategie "setzen".
// OAuth-Button ist eigene kleine Unter-Komponente.

// 4. UI
// Moderne Oberfläche (Tabs für Login/Signup, OAuth-Buttons, hübsches Design).
// Fehler und Erfolgsmeldungen werden benutzerfreundlich angezeigt.

// Du könntest das E-Mail-Feld nach einem erfolgreichen Signup direkt auf "Login" schalten
//  und ausfüllen (mit Erfolg-Meldung), damit der Nutzer gleich von dort sich anmelden kann.