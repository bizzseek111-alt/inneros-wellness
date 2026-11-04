"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield,
  Users,
  Sparkles,
  LogOut,
  Globe,
  Lock,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  GraduationCap,
  School,
  Heart,
  Smile,
} from "lucide-react";
import { useYouth } from "@/components/youth/YouthContext";

interface WeeblyParentShellProps {
  children: React.ReactNode;
}

export const WeeblyParentShell: React.FC<WeeblyParentShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      document.cookie = "inneros_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      sessionStorage.clear();
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E293B] flex flex-col font-sans">
      {/* 1. Weebly Parent Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Context */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-2.5 text-[#0F172A] hover:opacity-90 transition-opacity"
            >
              <span className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-xs">
                W
              </span>
              <div>
                <span className="text-xl font-black tracking-tight block leading-none text-[#0F172A]">
                  Weebly
                </span>
                <span className="text-[11px] font-bold text-amber-700 tracking-wide block uppercase mt-0.5">
                  Parent Center
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block h-5 w-px bg-slate-200 mx-2" />

            <div className="hidden md:flex items-center space-x-2 text-xs font-bold text-slate-500">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>COPPA &amp; GDPR-K Compliant</span>
              </span>
            </div>
          </div>

          {/* Quick Cross-Role Portals & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/youth/dashboard"
              className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black transition-colors flex items-center space-x-1.5 shadow-2xs"
            >
              <Smile className="w-3.5 h-3.5 text-amber-700" />
              <span>Kids Magic Home</span>
            </Link>

            <Link
              href="/teacher/dashboard"
              className="hidden lg:flex px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors items-center space-x-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
              <span>Educator Hub</span>
            </Link>

            <Link
              href="/schools"
              className="hidden xl:flex px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors items-center space-x-1.5"
            >
              <School className="w-3.5 h-3.5 text-slate-600" />
              <span>Schools</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out of Caregiver Portal"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Page Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* 3. Weebly Family Safeguarding Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-8 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">Weebly Family Safeguarding</span>
            <span>&bull;</span>
            <span>Zero-PII Child Protection Guarantee</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-slate-600">
            <Link href="/child-safety" className="hover:text-emerald-700 transition-colors">
              Child Safety Framework
            </Link>
            <Link href="/privacy" className="hover:text-emerald-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-emerald-700 transition-colors">
              Contact Family Support
            </Link>
            <Link href="/inneros/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              Adult Sanctuary &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
