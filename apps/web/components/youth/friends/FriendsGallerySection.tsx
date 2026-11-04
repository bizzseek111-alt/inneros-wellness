"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Volume2, Sparkles, MessageCircle, ArrowRight, Play, Check } from "lucide-react";
import { AI_FRIENDS, CHARACTER_LIST, CharacterId } from "@/lib/friends-data";
import { CharacterAvatar } from "./CharacterAvatar";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";
import { useYouth } from "../YouthContext";

interface FriendsGallerySectionProps {
  className?: string;
}

export const FriendsGallerySection: React.FC<FriendsGallerySectionProps> = ({
  className = "",
}) => {
  const { ageTier, locale } = useYouth();
  const [playingVoiceId, setPlayingVoiceId] = useState<CharacterId | null>(null);

  const handlePlayVoiceSample = async (charId: CharacterId) => {
    if (playingVoiceId === charId) {
      voiceSynthesizer.stop();
      setPlayingVoiceId(null);
      return;
    }

    setPlayingVoiceId(charId);
    const targetLocale = locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en";
    await voiceSynthesizer.playVoiceSample(charId, targetLocale);
    setPlayingVoiceId(null);
  };

  return (
    <section className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Voice-First AI Companions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Talk to a Friend
          </h2>
          <p className="text-sm sm:text-base text-[#475569] max-w-2xl">
            Who would you like to talk to today? Choose a friend below, tap to hear their voice, or start talking naturally in English, Urdu, or Pakistani Punjabi.
          </p>
        </div>

        <Link
          href="/youth/friends"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 transition-colors shrink-0"
        >
          <span>Open Full Friends Room</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Original Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {CHARACTER_LIST.map((char) => {
          const isPlaying = playingVoiceId === char.id;
          const desc = char.description[ageTier] || char.description.junior;

          return (
            <div
              key={char.id}
              className={`group relative rounded-[32px] bg-white border-2 border-slate-100 hover:border-[${char.accentColor}] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden p-6`}
              style={{
                borderColor: undefined,
              }}
            >
              {/* Subtle Ambient Card Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${char.bgGradient} opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none`}
              />

              <div className="relative z-10 space-y-4">
                {/* Character Badge & Languages Strip */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-2xs"
                    style={{
                      backgroundColor: `${char.accentColor}20`,
                      color: char.accentColor,
                    }}
                  >
                    {char.specializationBadge}
                  </span>

                  {/* Multilingual Badges */}
                  <div className="flex items-center space-x-1 text-[10px] font-extrabold text-slate-500">
                    <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200">
                      EN
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-emerald-700">
                      UR
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-indigo-700">
                      PA
                    </span>
                  </div>
                </div>

                {/* Animated Character Avatar */}
                <div className="flex justify-center py-2">
                  <CharacterAvatar
                    characterId={char.id}
                    state={isPlaying ? "speaking" : "idle"}
                    size="lg"
                    interactive
                    onClick={() => handlePlayVoiceSample(char.id)}
                  />
                </div>

                {/* Character Info */}
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-black text-[#0F172A] tracking-tight">
                    {char.name}
                  </h3>
                  <p
                    className="text-xs font-bold"
                    style={{ color: char.accentColor }}
                  >
                    {char.role}
                  </p>
                  <p className="text-xs text-[#475569] leading-relaxed pt-1 line-clamp-3">
                    {desc}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="relative z-10 pt-5 space-y-2 mt-auto">
                {/* Hear Voice Button */}
                <button
                  type="button"
                  onClick={() => handlePlayVoiceSample(char.id)}
                  className={`w-full py-2 px-3 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all border ${
                    isPlaying
                      ? "bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse"
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs"
                  }`}
                  aria-label={`Hear ${char.name}'s voice sample`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlaying ? "Playing Voice..." : `Hear My Voice`}</span>
                </button>

                {/* Talk with Character Button */}
                <Link
                  href={`/youth/friends?friend=${char.id}`}
                  className="w-full py-3 px-4 rounded-2xl text-xs font-black text-white flex items-center justify-center space-x-2 transition-all shadow-md group-hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: char.accentColor,
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Talk with {char.name}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
