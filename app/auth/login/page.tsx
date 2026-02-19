"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

type DemoLogin = {
  label: string;
  email: string;
};

const DEMO_PASSWORD = "Password123!";
const DEMO_LOGINS: DemoLogin[] = [
  { label: "Broker demo", email: "broker.demo@cedewise.test" },
  { label: "Underwriting manager demo", email: "manager.demo@cedewise.test" },
  { label: "Co-insurer demo", email: "coinsurer.demo@cedewise.test" },
  { label: "Insurer demo", email: "insurer.demo@cedewise.test" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/dashboard" });
    if (res?.ok) {
      router.push("/dashboard");
      return;
    }
    setLoading(false);
    setError(res?.error || "Invalid email or password");
  }

  async function signInWithCredentials(nextEmail: string, nextPassword: string) {
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email: nextEmail,
      password: nextPassword,
      redirect: false,
      callbackUrl: "/dashboard",
    });
    if (res?.ok) {
      router.push("/dashboard");
      return;
    }
    setLoading(false);
    setError(res?.error || "Invalid email or password");
  }

  async function signInDemo(nextEmail: string) {
    setEmail(nextEmail);
    setPassword(DEMO_PASSWORD);
    await signInWithCredentials(nextEmail, DEMO_PASSWORD);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur-md p-8 shadow-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-primary to-primary/80 p-2 shadow-md">
                <Logo className="h-7 w-auto text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
                <p className="text-xs text-muted-foreground">Welcome back to Cedewise Direct</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-accent hover:border-primary/20 hover:shadow-sm"
              title="Go to Home"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-4 text-sm text-red-800 dark:text-red-400">
              {error}
            </div>
          )}
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Email</label>
              <input
                type="email"
                className="input-modern"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Password</label>
              <input
                type="password"
                className="input-modern"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
                Enable MFA
              </label>
              <Link href="#" className="text-sm font-semibold text-primary hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="btn-primary w-full h-11 text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-border/50 bg-background/60 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Dummy login (demo access)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Password for all: <span className="font-mono">{DEMO_PASSWORD}</span>
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary h-9 px-3 text-sm"
                disabled={loading}
                onClick={() => {
                  setError(null);
                  setEmail("");
                  setPassword("");
                }}
              >
                Clear
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DEMO_LOGINS.map((d) => (
                <button
                  key={d.email}
                  type="button"
                  className="btn-secondary h-10 justify-center text-sm"
                  disabled={loading}
                  onClick={() => signInDemo(d.email)}
                  title={`Sign in as ${d.email}`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Credentials:</p>
              <ul className="list-inside list-disc space-y-0.5 font-mono">
                {DEMO_LOGINS.map((d) => (
                  <li key={d.email}>{d.email}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our{" "}
            <Link href="#" className="font-semibold text-primary hover:underline">
              Terms & Privacy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

