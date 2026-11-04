"use client";

import React from "react";
import Link from "next/link";
import {
  Mic,
  MessageSquare,
  Smile,
  BookOpen,
  Compass,
  Calendar,
  Sparkles,
  Heart,
  Wind,
  CheckCircle2,
  Layers,
  ArrowRight,
  Shield,
  Sun,
  Flame,
} from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { LumiMascot } from "@/components/youth/LumiMascot";
import { VisualScheduleCard } from "@/components/youth/VisualScheduleCard";
import { FriendsGallerySection } from "@/components/youth/friends/FriendsGallerySection";
import { useYouth } from "@/components/youth/YouthContext";

export default function ChildDashboardPage() {
  const { ageTier, localeMeta, t } = useYouth();

  return (
    <YouthShell
      activeScreen="dashboard"
      title={
        ageTier === "little"
          ? "Little Explorer's Playroom"
          : ageTier === "junior"
          ? "Junior Adventure Dashboard"
          : "Youth Focus Sanctuary"
      }
      subtitle={
        ageTier === "little"
          ? "Listen, play, and breathe with Lumi and your caregiver."
          : ageTier === "junior"
          ? "Choose an activity below to explore how you feel and learn new skills."
          : "A private, pressure-free space for your thoughts, boundaries, and personal growth."
      }
    >
      <div className="space-y-8 max-w-5xl">
        {/* =========================================================================
            TIER 1: AGES 2–5 (LITTLE EXPLORERS) - Large Tiles, Minimal Text, Co-Play
           ========================================================================= */}
        {ageTier === "little" && (
          <div className="space-y-6 animate-fade-in">
            {/* Friendly Mascot Greeting Banner */}
            <div className="p-6 sm:p-8 rounded-[36px] bg-gradient-to-r from-[#FFEEE5] via-[#FFF7F2] to-[#E0F1FE] border border-[#FFD9C7] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 text-center sm:text-start">
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase bg-white text-[#F36437] shadow-xs inline-block">
                  Caregiver Co-Play
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  Hello Little Friend!
                </h2>
                <p className="text-sm text-[#4A5568] max-w-md">
                  Tap any big picture below with your parent or caregiver to listen, sing, or take soft bunny breaths.
                </p>
              </div>
              <LumiMascot size="lg" state="idle" interactive />
            </div>

            {/* Giant Illustrated Tiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Link
                href="/youth/stories"
                className="p-6 rounded-[32px] bg-[#FFF7F2] border-2 border-[#FFD9C7] hover:border-[#FF8E68] transition-all hover:scale-101 flex flex-col items-center text-center space-y-3 group shadow-xs"
              >
                <span className="text-6xl block group-hover:scale-110 transition-transform">🐻</span>
                <h3 className="text-xl font-extrabold text-[#0F172A]">Bedtime Stories</h3>
                <p className="text-xs text-[#718096]">Soft soothing animal stories read aloud</p>
                <span className="px-4 py-1.5 rounded-full bg-white text-xs font-bold text-[#F36437] shadow-xs">
                  Listen Now
                </span>
              </Link>

              <Link
                href="/youth/emotions"
                className="p-6 rounded-[32px] bg-[#F2FAF6] border-2 border-[#C4EDD6] hover:border-[#60C592] transition-all hover:scale-101 flex flex-col items-center text-center space-y-3 group shadow-xs"
              >
                <span className="text-6xl block group-hover:scale-110 transition-transform">🐰</span>
                <h3 className="text-xl font-extrabold text-[#0F172A]">Bunny Breaths</h3>
                <p className="text-xs text-[#718096]">3 quick sniffs in, long gentle sigh out</p>
                <span className="px-4 py-1.5 rounded-full bg-white text-xs font-bold text-[#36A871] shadow-xs">
                  Breathe Along
                </span>
              </Link>

              <Link
                href="/youth/activities"
                className="p-6 rounded-[32px] bg-[#F0F8FF] border-2 border-[#B9E2FE] hover:border-[#38A8F8] transition-all hover:scale-101 flex flex-col items-center text-center space-y-3 group shadow-xs"
              >
                <span className="text-6xl block group-hover:scale-110 transition-transform">🎶</span>
                <h3 className="text-xl font-extrabold text-[#0F172A]">Soothing Sounds</h3>
                <p className="text-xs text-[#718096]">Gentle raindrops, forest breeze, wind chimes</p>
                <span className="px-4 py-1.5 rounded-full bg-white text-xs font-bold text-[#0E87E3] shadow-xs">
                  Play Sounds
                </span>
              </Link>
            </div>

            {/* AI Friends Voice Gallery for Co-Play */}
            <FriendsGallerySection />
          </div>
        )}

        {/* =========================================================================
            TIER 2: AGES 6–12 (JUNIOR ADVENTURERS) - 5 Large Action Buttons
           ========================================================================= */}
        {ageTier === "junior" && (
          <div className="space-y-8 animate-fade-in">
            {/* Mascot Center Check-In Banner */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-[#F0F8FF] via-white to-[#FAF7FD] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 text-center sm:text-start">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E0F1FE] text-[#0C436F] inline-block">
                  Junior Adventurer
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  How is your heart today?
                </h2>
                <p className="text-sm text-[#4A5568] max-w-md">
                  Lumi is ready to chat with you, hear about school, or share an awesome adventure story.
                </p>
              </div>
              <LumiMascot size="md" state="idle" interactive />
            </div>

            {/* AI Friends Voice Gallery */}
            <FriendsGallerySection />

            {/* 5 Big Action Buttons Requested in Specification */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#718096]">
                Explore Your Sanctuary
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {/* 1. TALK */}
                <Link
                  href="/youth/friends"
                  className="p-5 rounded-[26px] bg-white border-2 border-[#B9E2FE] hover:bg-[#F0F8FF] transition-all hover:scale-102 flex flex-col items-center text-center space-y-2 shadow-xs group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#E0F1FE] text-[#0E87E3] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mic className="w-6 h-6" />
                  </div>
                  <span className="font-extrabold text-base text-[#0F172A]">Talk</span>
                  <span className="text-[11px] text-[#718096]">AI Friends Room</span>
                </Link>

                {/* 2. LEARN */}
                <Link
                  href="/youth/activities"
                  className="p-5 rounded-[26px] bg-white border-2 border-[#C4EDD6] hover:bg-[#F2FAF6] transition-all hover:scale-102 flex flex-col items-center text-center space-y-2 shadow-xs group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#E3F6EC] text-[#36A871] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="font-extrabold text-base text-[#0F172A]">Learn</span>
                  <span className="text-[11px] text-[#718096]">Mindful puzzles</span>
                </Link>

                {/* 3. FEELINGS */}
                <Link
                  href="/youth/emotions"
                  className="p-5 rounded-[26px] bg-white border-2 border-[#D3B9ED] hover:bg-[#FAF7FD] transition-all hover:scale-102 flex flex-col items-center text-center space-y-2 shadow-xs group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F3EDFA] text-[#9868CE] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Smile className="w-6 h-6" />
                  </div>
                  <span className="font-extrabold text-base text-[#0F172A]">Feelings</span>
                  <span className="text-[11px] text-[#718096]">Name emotions</span>
                </Link>

                {/* 4. STORIES */}
                <Link
                  href="/youth/stories"
                  className="p-5 rounded-[26px] bg-white border-2 border-[#FFD9C7] hover:bg-[#FFF7F2] transition-all hover:scale-102 flex flex-col items-center text-center space-y-2 shadow-xs group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FFEEE5] text-[#F36437] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="font-extrabold text-base text-[#0F172A]">Stories</span>
                  <span className="text-[11px] text-[#718096]">Calm folk tales</span>
                </Link>

                {/* 5. ACTIVITIES */}
                <Link
                  href="/youth/routines"
                  className="p-5 rounded-[26px] bg-white border-2 border-[#FEF08A] hover:bg-[#FEFCE8] transition-all hover:scale-102 flex flex-col items-center text-center space-y-2 shadow-xs group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FEF9C3] text-[#CA8A04] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="font-extrabold text-base text-[#0F172A]">Routines</span>
                  <span className="text-[11px] text-[#718096]">Daily steps</span>
                </Link>
              </div>
            </div>

            {/* Educational Support Center Hub Card */}
            <div className="p-6 rounded-[28px] bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border border-indigo-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-start">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-white text-indigo-700 shadow-xs inline-block">
                  Support Center
                </span>
                <h3 className="text-lg font-extrabold text-[#0F172A]">
                  Neurodiversity-Affirming Educational Support
                </h3>
                <p className="text-xs text-[#4A5568] max-w-lg">
                  ADHD-friendly micro-step routines, Autism-friendly picture AAC boards, accessible read-alouds, and cognitive sequencing games.
                </p>
              </div>
              <Link
                href="/youth/support-center"
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center space-x-1.5 transition-all shadow-xs shrink-0"
              >
                <span>Open Support Center</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Visual Schedule Teaser */}
            <VisualScheduleCard />
          </div>
        )}

        {/* =========================================================================
            TIER 3: AGES 13–18 (YOUTH SANCTUARY) - Mature, Autonomy, Reflective
           ========================================================================= */}
        {ageTier === "teen" && (
          <div className="space-y-8 animate-fade-in">
            {/* Mature Identity Banner */}
            <div className="p-6 sm:p-8 rounded-[30px] bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-start">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F3EDFA] text-[#43256A] inline-block">
                  Adolescent Sanctuary
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  Quiet space for your mind.
                </h2>
                <p className="text-sm text-[#4A5568] max-w-md">
                  No unsolicited advice, no judgment, and zero corporate data harvesting. Take a breath and reflect on what matters to you.
                </p>
              </div>
              <LumiMascot size="md" state="calming" />
            </div>

            {/* Teen Focus Quick Nav */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/youth/journal"
                className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#9868CE] transition-all flex flex-col justify-between space-y-3 group shadow-xs"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#9868CE]">Encrypted Diary</span>
                  <h3 className="font-extrabold text-base text-[#0F172A]">Reflection Journal</h3>
                  <p className="text-xs text-[#718096]">Private thoughts with local device encryption.</p>
                </div>
                <span className="text-xs font-bold text-[#9868CE] flex items-center space-x-1">
                  <span>Open Journal</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </Link>

              <Link
                href="/youth/activities"
                className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0E87E3] transition-all flex flex-col justify-between space-y-3 group shadow-xs"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#0E87E3]">Study & Social Pressure</span>
                  <h3 className="font-extrabold text-base text-[#0F172A]">Healthy Boundaries</h3>
                  <p className="text-xs text-[#718096]">Scripts for unplugging from group chats peacefully.</p>
                </div>
                <span className="text-xs font-bold text-[#0E87E3] flex items-center space-x-1">
                  <span>Explore Scripts</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </Link>

              <Link
                href="/youth/voice"
                className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#36A871] transition-all flex flex-col justify-between space-y-3 group shadow-xs"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#36A871]">Non-Judgmental Listening</span>
                  <h3 className="font-extrabold text-base text-[#0F172A]">Voice Venting Space</h3>
                  <p className="text-xs text-[#718096]">Talk aloud without anyone interrupting or trying to fix you.</p>
                </div>
                <span className="text-xs font-bold text-[#36A871] flex items-center space-x-1">
                  <span>Open Voice Room</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </YouthShell>
  );
}
