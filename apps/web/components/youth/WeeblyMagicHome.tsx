"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, Sparkles, Volume2, ArrowRight } from "lucide-react";
import { ChildNavigationShell } from "./ChildNavigationShell";
import { CharacterAvatar } from "./friends/CharacterAvatar";
import { AI_FRIENDS, CharacterId } from "@/lib/friends-data";
import { useYouth } from "./YouthContext";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";

interface FriendCardData {
  id: CharacterId;
  name: string;
  role: string;
  simplePurpose: {
    en: string;
    ur: string;
    pa: string;
  };
  specialtyTag: string;
  cardBg: string;
  borderHover: string;
  accentColor: string;
  avatarBg: string;
}

const MAGIC_FRIENDS: FriendCardData[] = [
  {
    id: "kai",
    name: "Kai",
    role: "Curious Learning Guide",
    simplePurpose: {
      en: "Homework, tricky questions, math, and curiosity!",
      ur: "ہوم ورک، حساب اور نئی باتیں سیکھنے میں مددگار!",
      pa: "سکول دا کم، حساب تے نویاں گلاں سکھن وچ بیلی!",
    },
    specialtyTag: "Homework & Math",
    cardBg: "from-amber-50 to-orange-50/60 border-amber-200 hover:border-amber-400",
    borderHover: "hover:shadow-amber-200/50",
    accentColor: "#F59E0B",
    avatarBg: "bg-amber-100",
  },
  {
    id: "mia",
    name: "Mia",
    role: "Warm Creative Guide",
    simplePurpose: {
      en: "Bedtime stories, big feelings, imagination, and friendship!",
      ur: "پیاری کہانیاں، دل کے جذبات اور سچی دوستی!",
      pa: "سوہنیاں کہانیاں، دل دے ولولے تے سچی یاری!",
    },
    specialtyTag: "Stories & Feelings",
    cardBg: "from-pink-50 to-rose-50/60 border-pink-200 hover:border-pink-400",
    borderHover: "hover:shadow-pink-200/50",
    accentColor: "#EC4899",
    avatarBg: "bg-pink-100",
  },
  {
    id: "lumi",
    name: "Lumi",
    role: "Calm Gentle Guide",
    simplePurpose: {
      en: "Daily routines, belly breaths, and peaceful quiet time!",
      ur: "روزانہ کا شیڈول، پرسکون سانسیں اور آرام کا وقت!",
      pa: "دن دا ویلا، ہولے ساہ تے پورا سکون!",
    },
    specialtyTag: "Routines & Calming",
    cardBg: "from-emerald-50 to-teal-50/60 border-emerald-200 hover:border-emerald-400",
    borderHover: "hover:shadow-emerald-200/50",
    accentColor: "#10B981",
    avatarBg: "bg-emerald-100",
  },
  {
    id: "zayn",
    name: "Zayn",
    role: "Energetic Explorer",
    simplePurpose: {
      en: "Cool science, space mysteries, puzzles, and fun facts!",
      ur: "سائنس کے راز، خلا کی دنیا اور مزے دار پہیلیاں!",
      pa: "سائنس دیاں کھوجاں، خلا دے راز تے پُجھارتاں!",
    },
    specialtyTag: "Science & Puzzles",
    cardBg: "from-sky-50 to-indigo-50/60 border-sky-200 hover:border-sky-400",
    borderHover: "hover:shadow-sky-200/50",
    accentColor: "#0284C7",
    avatarBg: "bg-sky-100",
  },
];

export const WeeblyMagicHome: React.FC = () => {
  const router = useRouter();
  const { locale } = useYouth();

  const handleSpeakCard = (friend: FriendCardData, e: React.MouseEvent) => {
    e.stopPropagation();
    const prompt =
      locale === "ur"
        ? `${friend.name}! ${friend.simplePurpose.ur}`
        : locale === "pa"
        ? `${friend.name}! ${friend.simplePurpose.pa}`
        : `This is ${friend.name}. ${friend.simplePurpose.en}`;
    voiceSynthesizer.speak(prompt, {
      lang: locale === "ur" ? "ur-PK" : locale === "pa" ? "pa-PK" : "en-US",
    });
  };

  const handleQuickMicClick = () => {
    router.push("/youth/friends?friend=kai&listen=true");
  };

  return (
    <ChildNavigationShell activeTab="home">
      <div className="space-y-8 animate-fade-in">
        {/* Header Hero */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-xs font-black text-amber-900 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Weebly Magic Home</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Hi! Who would you like to talk to?
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto font-medium">
            Tap a friend to start talking, or press the big microphone button to say what you want to do!
          </p>
        </div>

        {/* Four Large Illustrated Character Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
          {MAGIC_FRIENDS.map((friend) => {
            const purpose = friend.simplePurpose[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];
            return (
              <div
                key={friend.id}
                className={`relative rounded-[36px] bg-gradient-to-b ${friend.cardBg} border-2 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 ${friend.borderHover}`}
              >
                {/* Top Strip: Tag & Audio Read-Out Button */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white shadow-2xs"
                    style={{ color: friend.accentColor }}
                  >
                    {friend.specialtyTag}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleSpeakCard(friend, e)}
                    className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 shadow-2xs transition-transform active:scale-95"
                    title={`Hear what ${friend.name} does`}
                    aria-label={`Listen to description of ${friend.name}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Character Illustration & Name Centerpiece */}
                <div className="flex flex-col items-center text-center py-4 space-y-3">
                  <div className="group-hover:scale-105 transition-transform">
                    <CharacterAvatar
                      characterId={friend.id}
                      state="idle"
                      size="lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-[#0F172A]">
                      {friend.name}
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {friend.role}
                    </p>
                  </div>

                  <p
                    className={`text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold max-w-xs ${
                      locale === "ur" || locale === "pa" ? "font-serif text-base" : ""
                    }`}
                  >
                    {purpose}
                  </p>
                </div>

                {/* Large "Talk to [Name]" Button */}
                <Link
                  href={`/youth/friends?friend=${friend.id}`}
                  className="w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center space-x-2 shadow-md hover:opacity-95 active:scale-98 transition-all"
                  style={{ backgroundColor: friend.accentColor }}
                >
                  <span>Talk to {friend.name}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Large Central Microphone Button */}
        <div className="max-w-md mx-auto pt-4 text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            {/* Glowing Pulse Ring */}
            <span className="absolute w-28 h-28 rounded-full bg-amber-400/20 animate-ping" />
            <span className="absolute w-24 h-24 rounded-full bg-amber-400/30 animate-pulse" />

            <button
              type="button"
              onClick={handleQuickMicClick}
              className="relative w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="Press and speak to any friend"
            >
              <Mic className="w-8 h-8" />
            </button>
          </div>

          <p className="text-sm font-black text-slate-700">
            Or just press and speak to anyone!
          </p>
          <p className="text-xs text-slate-500">
            Tell us what you want to learn, play, or explore today.
          </p>
        </div>
      </div>
    </ChildNavigationShell>
  );
};
