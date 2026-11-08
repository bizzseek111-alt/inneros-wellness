"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowRight,
  LifeBuoy,
} from "lucide-react";

type FaqCategory =
  | "all"
  | "capabilities"
  | "limitations"
  | "privacy"
  | "languages"
  | "support";

interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, "all">;
  categoryLabel: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "cap-1",
    category: "capabilities",
    categoryLabel: "Product Capabilities",
    question: "What can I use Weebly for in my daily life?",
    answer:
      "You can use Weebly to talk through everyday stress via voice or text, check in with your mood and energy, write in a private journal with guided prompts, explore evidence-informed psychology guides, track gentle personal growth goals, and set rest-friendly reminders.",
  },
  {
    id: "cap-2",
    category: "capabilities",
    categoryLabel: "Product Capabilities",
    question: "Can I tell the companion just to listen without giving me advice?",
    answer:
      "Yes. In the Text Companion, you can select the 'Just Listen' mode at any time. In this mode, Weebly reflects and validates what you are sharing without offering unsolicited checklists or problem-solving advice.",
  },
  {
    id: "lim-1",
    category: "limitations",
    categoryLabel: "AI Limitations",
    question: "Is Weebly a replacement for a human therapist or medical professional?",
    answer:
      "No. Weebly is an AI companion designed for personal reflection, emotional wellbeing, and everyday life habits. It is not a medical device, does not diagnose mental health or medical conditions, and does not replace licensed psychotherapy or psychiatric care.",
  },
  {
    id: "lim-2",
    category: "limitations",
    categoryLabel: "AI Limitations",
    question: "Does Weebly guess my psychological state or assign hidden scores?",
    answer:
      "No. Weebly does not secretly profile you or treat AI interpretations as objective facts. Any note suggested from a conversation is clearly marked as a suggestion and requires your explicit approval before it is saved to your memories.",
  },
  {
    id: "priv-1",
    category: "privacy",
    categoryLabel: "Data & Privacy",
    question: "How do I control what Weebly remembers about me?",
    answer:
      "In the 'Things I Remember' section (/memory), you can view every saved memory, edit its wording, dismiss unconfirmed suggestions, pause memory recording for temporary chats, download your data as JSON, or clear all memories with one click.",
  },
  {
    id: "priv-2",
    category: "privacy",
    categoryLabel: "Data & Privacy",
    question: "How do connected app imports handle my private information?",
    answer:
      "Weebly never asks for third-party passwords or scrapes external accounts. When you upload a selected export file (such as ChatGPT/Claude JSON or Markdown notes), personal identifiers like emails and phone numbers are masked, and you can preview and exclude individual items before anything is saved.",
  },
  {
    id: "lang-1",
    category: "languages",
    categoryLabel: "Languages",
    question: "Which languages does Weebly support?",
    answer:
      "Weebly is architected for 30 languages—prioritizing English, Spanish, French, German, Bulgarian, Arabic (with RTL layout), Urdu (with RTL layout), and Hindi. We evaluate each language for dialect nuances, code-switching, and safety accuracy rather than relying solely on raw speech API support.",
  },
  {
    id: "sup-1",
    category: "support",
    categoryLabel: "Professional Mental-Health Support",
    question: "What happens if I am experiencing a crisis or severe emotional distress?",
    answer:
      "Weebly is not an emergency service. If you express severe distress or crisis, Weebly immediately provides free, confidential 24/7 human crisis resources—including 988 (US/Canada), 116 123 / NHS 111 (UK), and 112 / 0800 88 001 (EU/Bulgaria). You can also access the 'Need Support?' button at the top of every screen.",
  },
];

export default function FaqMarketingPage() {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "cap-1": true,
    "lim-1": true,
    "priv-1": true,
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <MarketingShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-16 space-y-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E8F1EB] border border-[#CFE2D6] text-[#1F4742] text-[13.5px] font-medium">
            <HelpCircle className="w-4 h-4 text-[#285B55]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#263330] tracking-tight">
            Clear answers about capabilities, privacy, and boundaries.
          </h1>
          <p className="text-[18px] text-[#52625E] leading-relaxed max-w-3xl">
            Everything you need to know about how Weebly works, what it remembers, and when to reach out to a licensed human professional.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E6E0D6] shadow-sm flex items-center space-x-3">
            <Search className="w-5 h-5 text-[#7A8A85]" />
            <input
              type="text"
              placeholder="Search questions about privacy, voice, languages, or therapy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[15.5px] text-[#263330] placeholder-[#7A8A85] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Topics" },
              { id: "capabilities", label: "Product Capabilities" },
              { id: "limitations", label: "AI Limitations" },
              { id: "privacy", label: "Data & Privacy" },
              { id: "languages", label: "Languages" },
              { id: "support", label: "Mental-Health Support" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id as FaqCategory)}
                className={`px-4 py-2 rounded-2xl text-[14px] font-medium transition-all ${
                  selectedCategory === tab.id
                    ? "bg-[#285B55] text-white"
                    : "bg-white border border-[#E6E0D6] text-[#52625E] hover:text-[#263330]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((item) => {
            const isOpen = !!openIds[item.id];
            return (
              <div
                key={item.id}
                className="rounded-3xl bg-white border border-[#E6E0D6] shadow-sm overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-[#FAF8F4]/60 transition-colors"
                >
                  <div className="space-y-1.5">
                    <Badge variant="sage" size="sm">
                      {item.categoryLabel}
                    </Badge>
                    <h2 className="text-xl font-serif font-medium text-[#263330]">
                      {item.question}
                    </h2>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F4] border border-[#E6E0D6] flex items-center justify-center text-[#285B55] shrink-0 mt-1">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#F3EFE8] text-[16px] text-[#52625E] leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Banner */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-[#E8F1EB] border border-[#CFE2D6] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h3 className="text-2xl font-serif font-medium text-[#263330]">
              Have another question or feedback?
            </h3>
            <p className="text-[15.5px] text-[#52625E]">
              Reach out to our team or explore our dedicated Help &amp; Support resources.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/contact">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Contact &amp; Support
              </Button>
            </Link>
            <Link href="/safety">
              <Button
                variant="outline"
                size="md"
                leftIcon={<LifeBuoy className="w-4 h-4" />}
              >
                Crisis Helplines
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
