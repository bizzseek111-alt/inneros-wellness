"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  BookOpen,
  ShieldCheck,
  Award,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Layers,
  Sparkles,
  FileCheck
} from "lucide-react";

export default function ResearchPage() {
  const EVIDENCE_SOURCES = [
    {
      institution: "Harvard Center on the Developing Child",
      focus: "Executive Function & Resilience Architecture",
      citation: "Center on the Developing Child at Harvard University (2011). Building the Brain's 'Air Traffic Control' System.",
      relevance: "Informs our 3-part micro-step task engine and working memory routine structures."
    },
    {
      institution: "Collaborative for Academic, Social, and Emotional Learning (CASEL)",
      focus: "5 Core SEL Competencies",
      citation: "CASEL (2020). CASEL's SEL Framework: What Are the Core Competence Areas and Where Are They Promoted?",
      relevance: "Underpins our 25 curriculum departments across self-awareness, social awareness, and relationship skills."
    },
    {
      institution: "World Health Organization (WHO)",
      focus: "Mental Health Action Plan & Life Skills Education",
      citation: "WHO (2020). Mental Health of Adolescents and Life Skills Education in Schools.",
      relevance: "Guides our adolescent stress literacy, sleep hygiene, and non-stigmatizing peer support modules."
    },
    {
      institution: "Lieberman Affect Labeling Research (UCLA)",
      focus: "Neural Mechanisms of Emotional Naming",
      citation: "Lieberman, M. D., et al. (2007). Putting feelings into words: affect labeling disrupts amygdala activity. Psychological Science.",
      relevance: "Forms the scientific foundation of the Feelings Wheel and emotional vocabulary exercises."
    }
  ];

  return (
    <MarketingShell>
      <div className="bg-[#FAF9F5] min-h-screen text-[#1E293B]">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-gradient-to-b from-[#F1F5F9] to-[#FAF9F5]">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-[#CBD5E1] shadow-xs text-xs font-semibold text-[#334155]">
              <GraduationCap className="w-4 h-4 text-[#334155]" />
              <span>Evidence Registry &amp; Multi-Specialist Governance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
              Evidence-informed developmental psychology, transparently cited.
            </h1>

            <p className="text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Every lesson, routine, and conversational principle is linked to recognized developmental literature. Zero proprietary clinical claims or invented endorsements.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/admin/curriculum"
                className="px-8 py-3.5 rounded-full bg-[#1E293B] text-white font-semibold text-sm hover:bg-[#0F172A] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Curriculum Review Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/youth/academy"
                className="px-8 py-3.5 rounded-full bg-white text-[#1E293B] font-semibold text-sm hover:bg-[#F1F5F9] border border-[#CBD5E1] shadow-xs transition-all"
              >
                Explore 25 Departments
              </Link>
            </div>
          </div>
        </section>

        {/* Evidence Pillars Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Primary Scientific Foundations</h2>
            <p className="text-sm text-[#64748B]">All content is reviewed by developmental educators prior to publication.</p>
          </div>

          <div className="space-y-6">
            {EVIDENCE_SOURCES.map((src, idx) => (
              <div key={idx} className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">{src.focus}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#334155]">
                    Peer-Reviewed Literature
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">{src.institution}</h3>
                <p className="text-xs text-[#475569] italic bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  &ldquo;{src.citation}&rdquo;
                </p>
                <p className="text-sm text-[#334155] leading-relaxed">
                  <strong>InnerOS Application:</strong> {src.relevance}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-white border-t border-[#E2E8F0]">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-[#0F172A]">Interested in research partnership?</h2>
            <p className="text-sm text-[#64748B]">We welcome academic inquiries from child development and accessibility researchers.</p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="px-8 py-3 rounded-full bg-[#1E293B] text-white font-semibold text-sm hover:bg-[#0F172A] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Contact Research Team</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
