"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Sparkles, Compass, MessageSquare, BookOpen, Wind, AlertTriangle, ArrowLeft } from "lucide-react";
import { tokens } from "@/design-system/tokens";

export default function TeensSanctuaryPage() {
  const [activeTab, setActiveTab] = useState<"reflect" | "breathe" | "boundaries">("reflect");

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation & Safety Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-[#4F46E5] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Weebly Sanctuary</span>
          </Link>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-900">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Adolescent Sanctuary &bull; Development Preview</span>
          </div>
        </div>

        {/* Hero Card */}
        <div className="p-8 rounded-[28px] bg-white border border-[#E2E8F0] shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center">
            <Compass className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
            Weebly Teens Sanctuary
          </h1>
          <p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed">
            A private, respectful, pressure-free space designed for teenagers (ages 13–17). Untangle school stress, navigate friendship dynamics, and build your own voice without judgment or unsolicited advice.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Ages 13–17
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Zero Dark Patterns
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              Anti-Codependency Enforced
            </span>
          </div>
          <div className="pt-4">
            <Link
              href="/youth/dashboard?tier=teen"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base shadow-sm hover:opacity-95 transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              <span>Launch Full Teens Studio & Private Journal &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Focus Modules */}
        <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex border-b border-[#E2E8F0] gap-4">
            <button
              onClick={() => setActiveTab("reflect")}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "reflect"
                  ? "border-[#4F46E5] text-[#4F46E5]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Quiet Reflection
            </button>
            <button
              onClick={() => setActiveTab("breathe")}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "breathe"
                  ? "border-[#4F46E5] text-[#4F46E5]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Reset Nervous System
            </button>
            <button
              onClick={() => setActiveTab("boundaries")}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "boundaries"
                  ? "border-[#4F46E5] text-[#4F46E5]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Healthy Boundaries
            </button>
          </div>

          {activeTab === "reflect" && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-[#0F172A]">Today’s Prompt</h3>
              <p className="text-sm text-[#475569] italic">
                &ldquo;What is one expectation placed on you today that wasn’t actually yours? How did it feel in your body?&rdquo;
              </p>
              <textarea
                placeholder="Write your private thoughts here... This is never shared with advertisers or third parties."
                rows={4}
                className="w-full p-4 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {activeTab === "breathe" && (
            <div className="space-y-4 text-center py-4 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-indigo-50 border-2 border-indigo-300 text-indigo-600 flex items-center justify-center mx-auto animate-pulse">
                <Wind className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Box Breathing for Exam & Social Stress</h3>
              <p className="text-sm text-[#64748B] max-w-md mx-auto">
                Inhale 4s &bull; Hold 4s &bull; Exhale 4s &bull; Pause 4s. Resets autonomic fight-or-flight signaling in 90 seconds.
              </p>
            </div>
          )}

          {activeTab === "boundaries" && (
            <div className="space-y-3 animate-fade-in text-sm text-[#475569]">
              <h3 className="text-base font-bold text-[#0F172A]">Setting Boundaries Without Guilt</h3>
              <p className="leading-relaxed">
                You have the right to take space when group chats feel overwhelming. Saying &ldquo;I need to unplug for tonight, catch you tomorrow!&rdquo; is a healthy act of self-care, not rejection.
              </p>
            </div>
          )}
        </div>

        {/* Specialized Teen Crisis Lifelines */}
        <div className="p-6 rounded-[24px] bg-rose-50 border border-rose-200 space-y-3">
          <div className="flex items-center space-x-2 text-rose-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Adolescent Crisis & Confidential Support</span>
          </div>
          <p className="text-xs text-rose-950 leading-relaxed">
            Weebly is an AI companion for emotional reflection, not clinical diagnosis or crisis intervention. If you are experiencing overwhelming distress, self-harm thoughts, or unsafe situations, free, confidential teen support is available:
          </p>
          <div className="grid sm:grid-cols-2 gap-2 pt-1 text-xs text-rose-900 font-medium">
            <div className="p-3 bg-white rounded-xl border border-rose-200">
              <strong>Teen Line (Peer-to-Peer):</strong> Call 800-852-8336 or Text TEEN to 839863
            </div>
            <div className="p-3 bg-white rounded-xl border border-rose-200">
              <strong>Crisis Text Line:</strong> Text HOME to 741741 &bull; 988 Suicide & Crisis Lifeline
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
