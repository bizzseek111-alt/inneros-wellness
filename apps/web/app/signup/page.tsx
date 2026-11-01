"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, User, Globe, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { api } from "../../lib/api-client";
import { prototypeService } from "../../lib/prototype-service";

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [locale, setLocale] = useState("en-US");
  const [migrateLocalData, setMigrateLocalData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (password.length < 8) {
      setErrorMessage("Please choose a password with at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await api.signup({
        display_name: displayName.trim(),
        email: email.trim(),
        password,
        locale,
      });

      if (migrateLocalData) {
        try {
          const state = prototypeService.getState();
          const localJournals = state.journal || [];
          const localGoals = state.goals || [];
          if (localJournals.length > 0 || localGoals.length > 0) {
            await api.migrateLocalBrowserData({
              journal_entries: localJournals.map((j) => ({
                title: j.title,
                content: j.content,
                prompt: j.somaticFocus,
                tags: j.tags,
                mood_valence: j.valence || "reflective",
              })),
              growth_goals: localGoals.map((g) => ({
                title: g.horizonTitle,
                category: g.coreValue || g.category,
                why_it_matters: g.intention,
                steps: g.milestones,
              })),
              check_ins: [],
            });
          }
        } catch {
          // Non-blocking migration
        }
      }

      router.push("/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Could not create your account. Please try again.");
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
              InnerOS
            </span>
            <span className="text-xs text-[#52625E] block mt-0.5">
              Personal Wellbeing Sanctuary
            </span>
          </div>
        </Link>

        <Link
          href="/login"
          className="text-sm font-medium text-[#285B55] hover:underline px-4 py-2 rounded-xl bg-[#E5F1E8]/60"
        >
          Already have an account? Sign in →
        </Link>
      </header>

      {/* Main Card */}
      <main className="max-w-lg w-full mx-auto my-10">
        <div className="bg-white rounded-3xl border border-[#E4E0D8] shadow-card p-8 sm:p-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEE7FA] text-[#553E82] text-xs font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Begin Your Private Space</span>
          </div>

          <h1 className="font-serif text-3xl font-medium text-[#263330] tracking-tight">
            Create your InnerOS sanctuary
          </h1>
          <p className="text-sm text-[#52625E] mt-2 leading-relaxed">
            Set up a calm, private space for voice and text reflection, personal memory control, and evidence-informed psychology learning.
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="signup-name"
                className="block text-sm font-medium text-[#263330] mb-1.5"
              >
                How should InnerOS address you?
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#687873] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Maya Lin"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#D8D3C8] bg-[#FFFBF7] text-[#263330] placeholder-[#687873] text-sm focus:outline-none focus:border-[#285B55]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-medium text-[#263330] mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#687873] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#D8D3C8] bg-[#FFFBF7] text-[#263330] placeholder-[#687873] text-sm focus:outline-none focus:border-[#285B55]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-medium text-[#263330] mb-1.5"
              >
                Password (8+ characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#687873] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong passphrase"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#D8D3C8] bg-[#FFFBF7] text-[#263330] placeholder-[#687873] text-sm focus:outline-none focus:border-[#285B55]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-locale"
                className="block text-sm font-medium text-[#263330] mb-1.5"
              >
                Preferred language & regional crisis directory
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-[#687873] absolute left-4 top-1/2 -translate-y-1/2" />
                <select
                  id="signup-locale"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#D8D3C8] bg-[#FFFBF7] text-[#263330] text-sm focus:outline-none focus:border-[#285B55]"
                >
                  <option value="en-US">English (United States / Global)</option>
                  <option value="en-GB">English (United Kingdom)</option>
                  <option value="es-ES">Español (España / Latinoamérica)</option>
                  <option value="fr-FR">Français (France / Canada)</option>
                  <option value="de-DE">Deutsch (Deutschland / DACH)</option>
                  <option value="ja-JP">日本語 (日本)</option>
                  <option value="ar-SA">العربية (RTL Support)</option>
                </select>
              </div>
            </div>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#E4F1FA]/60 border border-[#3A7CA5]/20 cursor-pointer">
              <input
                type="checkbox"
                checked={migrateLocalData}
                onChange={(e) => setMigrateLocalData(e.target.checked)}
                className="mt-1 rounded border-[#285B55] text-[#285B55] focus:ring-[#285B55]"
              />
              <span className="text-xs text-[#263330] leading-relaxed">
                <strong>Preserve existing browser notes:</strong> Automatically import any journal entries, daily check-ins, or growth goals saved in this browser into my private account.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#285B55] hover:bg-[#1F4742] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{isLoading ? "Creating your sanctuary..." : "Create Private Sanctuary"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#52625E] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#285B55] font-medium hover:underline">
            Sign in here
          </Link>
        </p>
      </main>

      {/* Non-Clinical & Privacy Footer */}
      <footer className="max-w-2xl w-full mx-auto text-center text-xs text-[#52625E] flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#285B55] shrink-0" />
        <span>
          InnerOS is an educational emotional wellbeing companion, not a medical device or licensed clinical provider.
        </span>
      </footer>
    </div>
  );
}
