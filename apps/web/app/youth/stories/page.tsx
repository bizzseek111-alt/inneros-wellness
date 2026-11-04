"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen, Play, Pause, RotateCcw, Volume2, Sparkles, Moon, Sun, ArrowLeft, Film } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { LumiMascot } from "@/components/youth/LumiMascot";
import { useYouth } from "@/components/youth/YouthContext";
import { InteractiveCartoonPlayer } from "@/components/youth/InteractiveCartoonPlayer";

interface Story {
  id: string;
  title: string;
  urduTitle: string;
  category: "bedtime" | "bravery" | "kindness" | "nature" | "space";
  duration: string;
  summary: string;
  paragraphs: string[];
}

const STORIES: Story[] = [
  {
    id: "space_voyage",
    title: "Voyage to the Ringed Giant: The Real Story of Saturn",
    urduTitle: "زحل کے چھلوں کا خلائی سفر",
    category: "space",
    duration: "5 mins",
    summary: "A factual, wonder-filled journey past the Moon, Mars, and the asteroid belt to witness the shimmering ice rings of Saturn.",
    paragraphs: [
      "Imagine strapping into a gleaming explorer vessel, counting down: three, two, one... and soaring smoothly past Earth's blue sky into the velvet expanse of space.",
      "Far beneath us, our home planet glows like a blue and green marble. We cruise past the rocky craters of the Moon and the rust-red plains of Mars.",
      "Soon, sparkling dust and tumbling pebbles of the asteroid belt appear, swirling safely in their cosmic dance.",
      "And then, rising majestically before us, sits Saturn: a giant golden planet encircled by billions of icy particles that glitter like diamonds in the pale sunlight.",
      "Cassini, a real robotic explorer built by scientists, traveled for seven long years just to send us photos of this celestial beauty. In this vast universe, every star reminds us to stay curious.",
    ],
  },
  {
    id: "story_1",
    title: "Lumi and the Whispering Cloud",
    urduTitle: "لومی اور سرگوشی کرتا بادل",
    category: "bedtime",
    duration: "4 mins",
    summary: "A gentle bedtime story about noticing how every cloud moves across the night sky at its own peaceful pace.",
    paragraphs: [
      "High above the rolling hills, Lumi floated softly through the quiet lavender twilight.",
      "The stars were beginning to blink on, one by one, like gentle nightlights in the sky.",
      "A little cloud drifted by and sighed, 'I am moving so slowly tonight.' Lumi smiled and whispered, 'The night is in no rush, and neither are you.'",
      "Together, they took a deep, warm breath, and floated quietly into restful dreams.",
    ],
  },
  {
    id: "story_2",
    title: "The Patient Sparrow of Lahore",
    urduTitle: "لاہور کی صابر چڑیا",
    category: "nature",
    duration: "5 mins",
    summary: "A classic South Asian folk-inspired tale about taking one mindful twig at a time to build a cozy nest in the Shalimar Gardens.",
    paragraphs: [
      "In the lush Shalimar Gardens of Lahore, a tiny brown sparrow named Chanda was gathering twigs for her evening nest.",
      "A strong breeze swept through the jasmine bushes and blew a twig from her beak. Chanda did not rush or fret.",
      "She rested on a safe marble ledge, felt the warm evening air under her wings, and took three slow breaths.",
      "'Every breeze comes and goes,' Chanda chirped gently, and found an even softer twig to bring home.",
    ],
  },
  {
    id: "story_3",
    title: "The Brave Little Lantern",
    urduTitle: "بہادر ننھا چراغ",
    category: "bravery",
    duration: "4 mins",
    summary: "Discovering that being brave does not mean having no fear—it means shining your gentle light even when the shadows feel tall.",
    paragraphs: [
      "Tucked on a cozy wooden shelf sat a small lantern with a soft amber glow.",
      "When the thunder rumbled outside the window, the little lantern felt its glass tremble slightly.",
      "Instead of hiding its flame, it remembered: 'I don't have to light up the whole stormy sky. I just have to glow right here in this room.'",
      "And right there, its warm light kept the whole corner safe and peaceful all night long.",
    ],
  },
];

function StoryLibraryContent() {
  const searchParams = useSearchParams();
  const cartoonParam = searchParams?.get("cartoon");
  const storyParam = searchParams?.get("story");

  const [showCartoon, setShowCartoon] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (cartoonParam === "true") {
      setShowCartoon(true);
    }
    if (storyParam === "space-voyage") {
      const spaceStory = STORIES.find((s) => s.id === "space_voyage");
      if (spaceStory) setSelectedStory(spaceStory);
    }
  }, [cartoonParam, storyParam]);

  const handleReadStory = (story: Story) => {
    setSelectedStory(story);
    setShowCartoon(false);
    setIsPlayingAudio(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else if (selectedStory) {
      const fullText = selectedStory.paragraphs.join(" ");
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = 0.85; // Calming slow cadence
      utterance.pitch = 1.05;
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <YouthShell
      activeScreen="stories"
      title="Calm Story &amp; Cartoon Theater"
      subtitle="Interactive moral cartoons, soothing bedtime fables, and real science adventures."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {showCartoon ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowCartoon(false)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>Back to Story Library</span>
            </button>
            <InteractiveCartoonPlayer onFinish={() => setShowCartoon(false)} />
          </div>
        ) : selectedStory ? (
          /* Single Story Reading View */
          <div className="p-6 sm:p-10 rounded-[36px] bg-white border border-[#E2E8F0] shadow-sm space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <button
                onClick={() => {
                  setSelectedStory(null);
                  if (typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="flex items-center space-x-1.5 text-xs font-bold text-[#0E87E3] hover:underline"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                <span>Back to Stories</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleSpeech}
                  className={`px-4 py-2 rounded-full font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs ${
                    isPlayingAudio
                      ? "bg-amber-500 text-white"
                      : "bg-[#0E87E3] hover:bg-[#0C436F] text-white"
                  }`}
                >
                  {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingAudio ? "Pause Audio" : "Read Aloud"}</span>
                </button>
              </div>
            </div>

            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FFEEE5] text-[#F36437] uppercase tracking-wider inline-block">
                {selectedStory.category} &bull; {selectedStory.duration}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {selectedStory.title}
              </h2>
              <span className="text-sm font-semibold text-[#718096] block" dir="rtl">
                {selectedStory.urduTitle}
              </span>
            </div>

            {/* Story Paragraphs with generous, readable spacing */}
            <div className="space-y-6 max-w-2xl mx-auto py-4 text-base sm:text-lg leading-relaxed text-[#2D3748] font-medium">
              {selectedStory.paragraphs.map((p, idx) => (
                <p key={idx} className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#F2EBD7]">
                  {p}
                </p>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7FD] border border-[#E6D7F5] text-center space-y-2">
              <LumiMascot size="sm" state="calming" className="mx-auto" />
              <p className="text-xs font-semibold text-[#43256A]">
                Close your eyes and breathe softly. You are safe, loved, and protected.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Featured Interactive Cartoon Card */}
            <div className="rounded-[32px] bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                  <Film className="w-3.5 h-3.5 text-amber-300" />
                  <span>Interactive Moral Cartoon Theater</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black">
                  The Playground Friend (Pip, Zara &amp; Leo)
                </h3>
                <p className="text-sm text-purple-100 font-medium leading-relaxed">
                  Pip the little penguin is sitting alone by the bench. Watch what happens and choose how Zara and Leo can help Pip feel welcome!
                </p>
              </div>

              <button
                onClick={() => setShowCartoon(true)}
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md transition-all active:scale-95 shrink-0 flex items-center space-x-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Interactive Cartoon</span>
              </button>
            </div>

            {/* Story Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STORIES.map((story) => (
                <div
                  key={story.id}
                  onClick={() => handleReadStory(story)}
                  className="p-6 rounded-[30px] bg-white border-2 border-[#E2E8F0] hover:border-[#38A8F8] transition-all hover:scale-101 cursor-pointer flex flex-col justify-between space-y-4 shadow-xs group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E0F1FE] text-[#0C436F]">
                        {story.category}
                      </span>
                      <span className="text-xs font-semibold text-[#718096] flex items-center space-x-1">
                        <Moon className="w-3 h-3 text-[#9868CE]" />
                        <span>{story.duration}</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-lg text-[#0F172A] group-hover:text-[#0E87E3] transition-colors">
                      {story.title}
                    </h3>
                    <span className="text-xs font-medium text-[#718096] block" dir="rtl">
                      {story.urduTitle}
                    </span>
                    <p className="text-xs text-[#4A5568] leading-relaxed pt-1">
                      {story.summary}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#E2E8F0]">
                    <span className="text-xs font-bold text-[#0E87E3] flex items-center space-x-1">
                      <span>Read Story</span>
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#F0F8FF] text-[#0E87E3] flex items-center justify-center group-hover:bg-[#0E87E3] group-hover:text-white transition-colors">
                      <Play className="w-3.5 h-3.5 ml-0.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </YouthShell>
  );
}

export default function StoryLibraryPage() {
  return (
    <Suspense
      fallback={
        <YouthShell
          activeScreen="stories"
          title="Story Library"
          subtitle="Loading stories..."
        >
          <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-bold">
            Loading Stories &amp; Cartoon Theater...
          </div>
        </YouthShell>
      }
    >
      <StoryLibraryContent />
    </Suspense>
  );
}
