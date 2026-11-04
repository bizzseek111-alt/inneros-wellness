"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../../lib/api-client";
import { prototypeService } from "../../lib/prototype-service";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const syncBrowserDataIfPresent = async () => {
    try {
      const state = prototypeService.getState();
      const localJournals = state.journal || [];
      const localGoals = state.goals || [];
      if (localJournals.length > 0 || localGoals.length > 0) {
        await api.migrateLocalBrowserData({
          journal_entries: localJournals.map((j) => ({
            id: j.id,
            title: j.title,
            content: j.content,
            prompt: j.somaticFocus,
            tags: j.tags,
            mood_valence: j.valence || "reflective",
          })),
          growth_goals: localGoals.map((g) => ({
            id: g.id,
            title: g.horizonTitle,
            category: g.coreValue || g.category,
            why_it_matters: g.intention,
            steps: g.milestones,
          })),
          check_ins: [],
        });
        setSyncMessage("Your browser reflections and growth goals have been safely synced to your account.");
      }
    } catch {
      // Non-blocking sync
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const result = await api.login({ email, password });
      await syncBrowserDataIfPresent();
      if (result.user?.role === "admin") {
        router.push("/admin");
      } else if (result.user?.role === "caregiver") {
        router.push("/parent");
      } else if (result.user?.role === "teacher") {
        router.push("/teacher/dashboard");
      } else if (result.user?.role === "child" || result.user?.role === "teen") {
        router.push("/youth/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to sign in. Please verify your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoSignIn = async (demoEmail: string, demoPass: string, redirectPath: string) => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await api.login({ email: demoEmail, password: demoPass });
      await syncBrowserDataIfPresent();
      router.push(redirectPath);
    } catch (err: any) {
      setErrorMessage(err.message || "Demo sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] text-[#263330] flex flex-col justify-between px-4 py-8 sm:px-8">
      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-[#263330] hover:opacity-90 transition-opacity"
        >
          <span className="w-10 h-10 rounded-2xl bg-[#E5F1E8] border border-[#285B55]/20 flex items-center justify-center text-[#285B55] font-serif text-lg font-semibold">
            I
          </span>
          <div>
            <span className="font-serif text-xl font-medium tracking-tight block leading-none">
              Weebly
            </span>
            <span className="text-xs text-[#52625E] block mt-0.5">
              Personal Wellbeing Sanctuary
            </span>
          </div>
        </Link>

        <Link
          href="/signup"
          className="text-sm font-medium text-[#285B55] hover:underline px-4 py-2 rounded-xl bg-[#E5F1E8]/60"
        >
          Create a new sanctuary →
        </Link>
      </header>

      {/* Main Card */}
      <main className="max-w-md w-full mx-auto my-10">
        <div className="bg-white rounded-3xl border border-[#E4E0D8] shadow-card p-8 sm:p-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5F1E8] text-[#285B55] text-xs font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome Back to Your Sanctuary</span>
          </div>

          <h1 className="font-serif text-3xl font-medium text-[#263330] tracking-tight">
            Sign in to Weebly
          </h1>
          <p className="text-sm text-[#52625E] mt-2 leading-relaxed">
            Your reflections, personal memory vault, and growth intentions remain private and under your control.
          </p>

          {errorMessage && (
            <div
              role="alert"
              className="mt-5 p-4 rounded-2xl bg-[#F9E5DC] border border-[#CE8A74]/40 text-[#7D402D] text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {syncMessage && (
            <div className="mt-5 p-4 rounded-2xl bg-[#E5F1E8] border border-[#285B55]/25 text-[#1F4742] text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{syncMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-[#263330] mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#687873] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena.vance@inneros.app"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#D8D3C8] bg-[#FFFBF7] text-[#263330] placeholder-[#687873] text-sm focus:outline-none focus:border-[#285B55]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-[#263330] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#687873] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#D8D3C8] bg-[#FFFBF7] text-[#263330] placeholder-[#687873] text-sm focus:outline-none focus:border-[#285B55]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#285B55] hover:bg-[#1F4742] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{isLoading ? "Opening your sanctuary..." : "Enter Sanctuary"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* One-Click Demo Personas */}
          <div className="mt-8 pt-6 border-t border-[#EAE5DC]">
            <p className="text-xs font-medium text-[#52625E] mb-3">
              Instant evaluation accounts (pre-seeded relational persistence):
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                disabled={isLoading}
                onClick={() =>
                  handleQuickDemoSignIn(
                    "parent@inneros.app",
                    "FamilySanctuary2026!",
                    "/parent"
                  )
                }
                className="w-full text-left px-4 py-3 rounded-2xl bg-[#E3F6EC]/70 hover:bg-[#E3F6EC] border border-[#16A34A]/20 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="block text-sm font-semibold text-[#0F172A]">
                    👨‍👩‍👧 Caregiver / Parent Portal
                  </span>
                  <span className="block text-xs text-[#52625E]">
                    Family overview, child profiles, COPPA consent & screen-time controls
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#16A34A]" />
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() =>
                  handleQuickDemoSignIn(
                    "teacher@inneros.app",
                    "TeacherSanctuary2026!",
                    "/teacher/dashboard"
                  )
                }
                className="w-full text-left px-4 py-3 rounded-2xl bg-[#EEF4FF]/70 hover:bg-[#EEF4FF] border border-[#2B4CDE]/20 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="block text-sm font-semibold text-[#0F172A]">
                    👩‍🏫 Educator &amp; Classroom Hub
                  </span>
                  <span className="block text-xs text-[#52625E]">
                    Classroom cohorts, SEL assignment dispatch & smartboard co-regulation
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#2B4CDE]" />
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() =>
                  handleQuickDemoSignIn(
                    "elena.vance@inneros.app",
                    "InnerOS-Demo-2026!",
                    "/dashboard"
                  )
                }
                className="w-full text-left px-4 py-3 rounded-2xl bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="block text-sm font-semibold text-[#0F172A]">
                    🌿 Adult Sanctuary (InnerOS)
                  </span>
                  <span className="block text-xs text-[#52625E]">
                    Existing adult personal journal, growth horizons & somatic check-ins
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() =>
                  handleQuickDemoSignIn(
                    "admin@inneros.app",
                    "InnerOS-Admin-2026!",
                    "/admin"
                  )
                }
                className="w-full text-left px-4 py-3 rounded-2xl bg-[#EEE7FA]/70 hover:bg-[#EEE7FA] border border-[#6B519E]/20 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="block text-sm font-semibold text-[#0F172A]">
                    🛡️ Platform Administrator &amp; CMS
                  </span>
                  <span className="block text-xs text-[#52625E]">
                    Safeguarding audit logs, curriculum CMS & service catalog
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#553E82]" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-[#52625E] mt-6">
          New to Weebly?{" "}
          <Link href="/signup" className="text-[#285B55] font-medium hover:underline">
            Create your private account
          </Link>
        </p>
      </main>

      {/* Non-Clinical & Privacy Footer */}
      <footer className="max-w-2xl w-full mx-auto text-center text-xs text-[#52625E] flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#285B55] shrink-0" />
        <span>
          Argon2id encrypted credentials • Non-clinical emotional wellbeing companion • Never a replacement for licensed care
        </span>
      </footer>
    </div>
  );
}
