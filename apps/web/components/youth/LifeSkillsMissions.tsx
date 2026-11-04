"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Users,
  Compass,
  Award,
  BookOpen,
  Shield,
  Smile,
  Check,
} from "lucide-react";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";
import { useYouth } from "./YouthContext";

export interface LifeSkillMission {
  id: string;
  title: { en: string; ur: string; pa: string };
  category: "family" | "kindness" | "organization" | "resilience" | "creativity";
  emoji: string;
  badgeColor: string;
  tag: string;
  estimatedTime: string;
  objective: { en: string; ur: string; pa: string };
  realLifeSteps: { en: string; ur: string; pa: string }[];
  offlineExtension: { en: string; ur: string; pa: string };
  trustedAdultTip: { en: string; ur: string; pa: string };
}

export const MISSIONS_LIST: LifeSkillMission[] = [
  {
    id: "mission-1",
    category: "kindness",
    emoji: "🎨",
    badgeColor: "bg-pink-100 text-pink-800 border-pink-200",
    tag: "Kindness & Gratitude",
    estimatedTime: "15 mins",
    title: {
      en: "Draw a Picture of Gratitude",
      ur: "کسی پیارے کے لیے شکریہ کی تصویر بنائیں",
      pa: "کسے پیارے لئی شکر گزاری دی تصویر بناؤ",
    },
    objective: {
      en: "Express kindness by creating a handmade drawing or card for a family member, friend, or teacher.",
      ur: "کسی فیملی ممبر، دوست یا استاد کے لیے ہاتھ سے خوبصورت کارڈ بنا کر اپنی محبت کا اظہار کریں۔",
      pa: "اپنے گھر والیاں یا استاد لئی ہتھ نال کارڈ بنا کے محبت ونڈو۔",
    },
    realLifeSteps: [
      {
        en: "Step 1: Think of one person who helped you or made you smile this week.",
        ur: "پہلا مرحلہ: ایسے انسان کے بارے میں سوچیں جس نے اس ہفتے آپ کی مدد کی یا آپ کو ہنسایا۔",
        pa: "پہلا قدم: اوہ بندہ سوچو جس نے اس ہفتے تہاڈی مدد کیتی۔",
      },
      {
        en: "Step 2: Fold a piece of paper and draw their favorite animal, flower, or a sunny landscape.",
        ur: "دوسرا مرحلہ: کاغذ پر ان کے پسندیدہ پھول، جانور یا خوبصورت سورج کی تصویر بنائیں۔",
        pa: "دوجا قدم: کاغذ تے اوہناں دا من پسند پھل یا جانور بناؤ۔",
      },
      {
        en: "Step 3: Write 'Thank you for being wonderful!' and hand it to them with a warm hug or smile.",
        ur: "تیسرا مرحلہ: کارڈ پر 'آپ کا شکریہ' لکھیں اور مسکراہٹ کے ساتھ ان کے حوالے کریں۔",
        pa: "تیجا قدم: کارڈ تے شکریہ لکھ کے پیار نال اوہناں نوں پھڑاؤ۔",
      },
    ],
    offlineExtension: {
      en: "Notice how their face lights up when they receive your surprise card!",
      ur: "غور کریں کہ جب وہ آپ کا کارڈ وصول کرتے ہیں تو ان کے چہرے پر کیسی پیاری خوشی آتی ہے!",
      pa: "ویکھو تہاڈا کارڈ ویکھ کے اوہناں دے چہرے تے کنی سوہنی مسکان آندی اے!",
    },
    trustedAdultTip: {
      en: "You can ask a parent or caregiver for colored pencils or scrap paper.",
      ur: "آپ رنگین پنسلوں یا کاغذ کے لیے امی یا ابو کی مدد لے سکتے ہیں۔",
      pa: "تسیں رنگاں یا کاغذ لئی وڈیاں کولوں مدد منگ سکدے او۔",
    },
  },
  {
    id: "mission-2",
    category: "family",
    emoji: "🗣️",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    tag: "Family Storytelling",
    estimatedTime: "10 mins",
    title: {
      en: "Interview a Family Member",
      ur: "گھر کے کسی بڑے کا بچپن کا انٹرویو لیں",
      pa: "گھر دے کسے وڈے نال بچپن دیاں گلاں کرو",
    },
    objective: {
      en: "Discover family history and practice active listening by asking a parent or grandparent about their childhood.",
      ur: "اپنے والدین یا دادا دادی سے ان کے بچپن کے بارے میں سوالات پوچھ کر خاندانی یادیں دریافت کریں۔",
      pa: "دادا دادی یا ماپیاں توں اوہناں دے بچپن دے کھیڈاں بارے پچھو۔",
    },
    realLifeSteps: [
      {
        en: "Step 1: Sit together comfortably during a quiet moment.",
        ur: "پہلا مرحلہ: سکون کے وقت اپنے بڑوں کے پاس محبت سے بیٹھیں۔",
        pa: "پہلا قدم: آرام نال وڈیاں دے کول بیٹھو۔",
      },
      {
        en: "Step 2: Ask: 'What was your absolute favorite game to play when you were my age?'",
        ur: "دوسرا مرحلہ: پوچھیں: 'جب آپ میری عمر کے تھے، تو آپ کا سب سے پسندیدہ کھیل کون سا تھا؟'",
        pa: "دوجا قدم: پچھو: 'جدوں تسیں میرے جتنے سی، تاں کہڑا کھیڈ سب توں ودھ کھیڈدے سی؟'",
      },
      {
        en: "Step 3: Listen attentively without interrupting and ask one follow-up question.",
        ur: "تیسرا مرحلہ: دھیان سے ان کی بات سنیں اور کہانی کا لطف اٹھائیں۔",
        pa: "تیجا قدم: دھیان نال اوہناں دی گل سنو تے پیار نال ہور پچھو۔",
      },
    ],
    offlineExtension: {
      en: "Ask if they can teach you the rules to that game this weekend!",
      ur: "پوچھیں کہ کیا وہ اس ہفتے کے آخر میں آپ کو وہ کھیل سکھا سکتے ہیں!",
      pa: "پچھو کی اوہ چھٹی والے دن تہانوں اوہ کھیل سکھا سکدے نے!",
    },
    trustedAdultTip: {
      en: "Grandparents especially love sharing stories from when they went to school.",
      ur: "دادا دادی اپنے اسکول کے دنوں کی کہانیاں سنانا بہت پسند کرتے ہیں۔",
      pa: "بزرگ اپنے سکول ویلے دیاں گلاں سنا کے بڑے راضی ہوندے نے۔",
    },
  },
  {
    id: "mission-3",
    category: "organization",
    emoji: "🎒",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    tag: "Organization & Habits",
    estimatedTime: "8 mins",
    title: {
      en: "The 3-Pocket School Bag Quest",
      ur: "اسکول کا بستہ 3 حصوں میں منظم کریں",
      pa: "سکول دا بستہ 3 خانیاں وچ ترتیب دیو",
    },
    objective: {
      en: "Build executive functioning and independence by organizing your backpack for tomorrow.",
      ur: "کل کے اسکول کے لیے اپنے بستے کو صاف ستھرا اور منظم کر کے خود اعتمادی پیدا کریں۔",
      pa: "کل دے سکول لئی اپنے بستے نوں ترتیب نال رکھو۔",
    },
    realLifeSteps: [
      {
        en: "Step 1: Unzip your school bag and gently empty out any old papers, wrappers, or clutter.",
        ur: "پہلا مرحلہ: بستہ کھولیں اور غیر ضروری کاغذات یا ریپرز باہر نکال دیں۔",
        pa: "پہلا قدم: بستہ کھول کے فالتو کاغذات باہر کڈھو۔",
      },
      {
        en: "Step 2: Place notebooks and textbooks flat in the main pocket.",
        ur: "دوسرا مرحلہ: کاپیاں اور کتابیں ترتیب سے بڑے خانے میں رکھیں۔",
        pa: "دوجا قدم: کتاباں تے کاپیاں وڈے خانے وچ رکھو۔",
      },
      {
        en: "Step 3: Check your pencil case: ensure you have 2 sharpened pencils, an eraser, and your water bottle.",
        ur: "تیسرا مرحلہ: پنسل باکس چیک کریں: دو پنسلیں، ایک ربڑ، اور پانی کی بوتل تیار رکھیں۔",
        pa: "تیجا قدم: پنسل باکس ویکھو کہ دو پنسلاں تے پانی دی بوتل تیار اے۔",
      },
    ],
    offlineExtension: {
      en: "Put your bag near the door tonight so tomorrow morning is calm and stress-free!",
      ur: "رات کو ہی بستہ دروازے کے قریب رکھیں تاکہ صبح پرسکون رہے۔",
      pa: "رات نوں ای بستہ بوہے کول رکھو تاں جے سویرے کوئی پریشانی نہ ہووے۔",
    },
    trustedAdultTip: {
      en: "Ask an adult to double-check your school homework folder before you zip up.",
      ur: "بستہ بند کرنے سے پہلے امی یا ابو کو اپنا ہوم ورک فولڈر دکھا دیں۔",
      pa: "بستہ بند کرن توں پہلاں وڈیاں نوں اپنا ہوم ورک وکھاؤ۔",
    },
  },
  {
    id: "mission-4",
    category: "resilience",
    emoji: "🛡️",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    tag: "Safety & Boundaries",
    estimatedTime: "10 mins",
    title: {
      en: "Identify My 3 Trusted Adults",
      ur: "اپنے 3 قابلِ اعتماد بڑوں کی شناخت کریں",
      pa: "اپنے 3 پکے ہمدرد وڈیاں نوں پہچانو",
    },
    objective: {
      en: "Safeguarding literacy: recognize three safe adults you can always turn to when you feel unsafe, confused, or upset.",
      ur: "ایسے 3 بڑوں کی پہچان کریں جن پر آپ کو مکمل اعتماد ہے اور جن سے آپ ہر بات بلا خوف کہہ سکتے ہیں۔",
      pa: "ایہو جہے 3 وڈیاں نوں چنو جنہاں کولوں تسیں بلا جھجک مدد منگ سکو۔",
    },
    realLifeSteps: [
      {
        en: "Step 1: On a piece of paper, trace your hand with a pencil.",
        ur: "پہلا مرحلہ: کاغذ پر اپنا ہاتھ رکھ کر پنسل سے لکیر کھینچیں۔",
        pa: "پہلا قدم: کاغذ تے اپنے ہتھ دا نشان بناؤ۔",
      },
      {
        en: "Step 2: On three fingers, write the names of 3 trusted adults (e.g. Mom, Dad, Teacher, Coach, Aunt).",
        ur: "دوسرا مرحلہ: تین انگلیوں پر ان تین بڑوں کے نام لکھیں (جیسے امی، ابو، استاد، خالہ)۔",
        pa: "دوجا قدم: تن انگلیاں تے اپنے ماپیاں، استاد یا قریبی ہمدرد دا ناں لکھو۔",
      },
      {
        en: "Step 3: Remember: Safe adults always listen, never ask you to keep dangerous secrets, and help you feel secure.",
        ur: "تیسرا مرحلہ: یاد رکھیں: اچھے بڑے کبھی خطرناک راز رکھنے کو نہیں کہتے اور ہمیشہ آپ کی حفاظت کرتے ہیں۔",
        pa: "تیجا قدم: یاد رکھو: چنگے وڈے ہمیشہ تہاڈی حفاظت کردے نے۔",
      },
    ],
    offlineExtension: {
      en: "Keep this paper in your bedroom or safe box as your personal Helping Hand.",
      ur: "اس کاغذ کو اپنے کمرے میں محفوظ رکھیں تاکہ آپ کو ہمیشہ یاد رہے۔",
      pa: "ایہ کاغذ اپنے کمرے وچ رکھو تاں جے تہانوں ہمیشہ یاد روے۔",
    },
    trustedAdultTip: {
      en: "If one trusted adult is busy, you can always go to the second or third adult on your hand.",
      ur: "اگر ایک بڑا مصروف ہو تو آپ بلا جھجھک دوسرے بڑے کے پاس جا سکتے ہیں۔",
      pa: "جے اک بندہ مصروف ہووے تاں تسیں دوجے ہمدرد کول جا سکدے او۔",
    },
  },
];

export const LifeSkillsMissions: React.FC = () => {
  const { locale } = useYouth();
  const [selectedMission, setSelectedMission] = useState<LifeSkillMission | null>(null);
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});

  const handleToggleComplete = (id: string) => {
    const nextState = !completedMissions[id];
    setCompletedMissions({ ...completedMissions, [id]: nextState });
    if (nextState) {
      voiceSynthesizer.speak(
        locale === "ur"
          ? "شاباش! آپ نے یہ عملی مشن مکمل کر لیا ہے۔ آپ کا یہ قدم آپ کو اور آپ کی فیملی کو جوڑتا ہے!"
          : "Hooray! Mission accomplished! You connected screen learning to real family life!",
        { characterId: "lumi" }
      );
    }
  };

  const handleSpeakMission = (m: LifeSkillMission) => {
    const title = m.title[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];
    const obj = m.objective[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];
    voiceSynthesizer.speak(`${title}. ${obj}`, {
      characterId: "lumi",
      locale: locale === "ur" ? "ur-PK" : locale === "pa" ? "pa-PK" : "en-US",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-emerald-50 border-2 border-emerald-200">
        <div className="flex items-center space-x-3">
          <Link
            href="/youth/dashboard"
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-2xs font-bold text-xs inline-flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Magic Home</span>
          </Link>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌟</span>
              <h2 className="text-base font-black text-slate-900">
                Practical Life-Skills Missions
              </h2>
            </div>
            <p className="text-xs text-emerald-900 font-medium">
              Real-World Family &amp; Habit Challenges &bull; Guided by Lumi &bull; Non-Clinical
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-black text-emerald-800 shadow-2xs">
            {Object.values(completedMissions).filter(Boolean).length} of {MISSIONS_LIST.length} Done
          </span>
        </div>
      </div>

      {selectedMission ? (
        /* Detailed Mission View */
        <div className="p-6 sm:p-10 rounded-[36px] bg-white border-2 border-emerald-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setSelectedMission(null)}
              className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Missions</span>
            </button>

            <button
              type="button"
              onClick={() => handleSpeakMission(selectedMission)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-xs flex items-center space-x-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen to Mission</span>
            </button>
          </div>

          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-6xl block">{selectedMission.emoji}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${selectedMission.badgeColor}`}>
              {selectedMission.tag} &bull; {selectedMission.estimatedTime}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {selectedMission.title[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"]}
            </h3>
            <p className="text-sm font-semibold text-slate-600 leading-relaxed">
              {selectedMission.objective[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"]}
            </p>
          </div>

          {/* Real-Life Steps */}
          <div className="space-y-4 max-w-2xl mx-auto pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Offline Action Steps:
            </h4>
            <div className="space-y-3">
              {selectedMission.realLifeSteps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                    {step[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Extension & Trusted Adult Tip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-800 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Offline Extension</span>
              </span>
              <p className="text-xs font-bold text-amber-950">
                {selectedMission.offlineExtension[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"]}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-sky-800 flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-sky-600" />
                <span>Ask a Trusted Adult</span>
              </span>
              <p className="text-xs font-bold text-sky-950">
                {selectedMission.trustedAdultTip[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"]}
              </p>
            </div>
          </div>

          {/* Completion Check Button */}
          <div className="text-center pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleToggleComplete(selectedMission.id)}
              className={`px-8 py-3.5 rounded-2xl text-xs font-black shadow-md flex items-center justify-center space-x-2 mx-auto transition-transform active:scale-95 cursor-pointer ${
                completedMissions[selectedMission.id]
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {completedMissions[selectedMission.id] ? "Mission Completed! (Click to Undo)" : "I Completed This Mission Offline!"}
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Missions Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {MISSIONS_LIST.map((m) => {
            const isDone = completedMissions[m.id];
            const title = m.title[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];
            const obj = m.objective[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMission(m)}
                className={`p-6 rounded-[32px] border-2 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                  isDone
                    ? "bg-emerald-50/50 border-emerald-400"
                    : "bg-white border-slate-200 hover:border-emerald-300"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{m.emoji}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${m.badgeColor}`}>
                      {m.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{title}</h3>
                  <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                    {obj}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">{m.estimatedTime}</span>
                  <span className={`font-black flex items-center space-x-1 ${isDone ? "text-emerald-600" : "text-emerald-700"}`}>
                    <span>{isDone ? "Completed ✓" : "Start Mission &rarr;"}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
