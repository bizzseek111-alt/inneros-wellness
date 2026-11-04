"use client";

import React, { useState } from "react";
import { ShieldAlert, Phone, Heart, Users, Shield, AlertTriangle, ArrowLeft } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { LumiMascot } from "@/components/youth/LumiMascot";

interface SafeAdult {
  name: string;
  relation: string;
  phone: string;
}

export default function YouthSafetyPage() {
  const [adults, setAdults] = useState<SafeAdult[]>([
    { name: "Aunt Sarah", relation: "Family Anchor", phone: "+1 (555) 234-5678" },
    { name: "Ms. Jenkins", relation: "School Counselor", phone: "Room 204" },
  ]);

  const [newName, setNewName] = useState("");
  const [newRelation, setNewRelation] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleAddAdult = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newPhone.trim()) {
      setAdults([...adults, { name: newName.trim(), relation: newRelation.trim() || "Trusted Adult", phone: newPhone.trim() }]);
      setNewName("");
      setNewRelation("");
      setNewPhone("");
    }
  };

  return (
    <YouthShell
      activeScreen="safety"
      title="Help, Safety & Lifelines"
      subtitle="You are never alone. Compassionate human help is free, confidential, and available right now."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Urgent Emergency Alert Banner */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-4 shadow-sm">
          <div className="flex items-center space-x-3 text-rose-700 font-extrabold text-lg">
            <ShieldAlert className="w-7 h-7 shrink-0" />
            <span>Immediate Crisis & Child Protection Lifelines</span>
          </div>
          <p className="text-sm font-semibold leading-relaxed">
            If you or someone you know is in physical danger, feeling like ending their life, or in acute pain, please call or text these verified 24/7 human professionals immediately:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-1">
              <span className="text-xs font-extrabold text-rose-900 block">Pakistan (Youth)</span>
              <span className="text-lg font-black text-rose-700 block">0311-7786264</span>
              <span className="text-[11px] text-[#718096] block">Umang Mental Health Helpline</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-1">
              <span className="text-xs font-extrabold text-rose-900 block">UK Childline</span>
              <span className="text-lg font-black text-rose-700 block">0800 1111</span>
              <span className="text-[11px] text-[#718096] block">Free 24/7 Child Support</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-1">
              <span className="text-xs font-extrabold text-rose-900 block">US & Canada</span>
              <span className="text-lg font-black text-rose-700 block">988 / 741741</span>
              <span className="text-[11px] text-[#718096] block">Call 988 or Text HOME to 741741</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-1">
              <span className="text-xs font-extrabold text-rose-900 block">Europe Helpline</span>
              <span className="text-lg font-black text-rose-700 block">116 111</span>
              <span className="text-[11px] text-[#718096] block">European Child Helpline</span>
            </div>
          </div>
        </div>

        {/* My Safe Grown-Ups Circle */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-[#0F172A] flex items-center space-x-2">
              <Heart className="w-5 h-5 text-[#E11D48]" />
              <span>My Trusted Adults Circle</span>
            </h3>
            <p className="text-sm text-[#718096]">
              Write down 2 or 3 real-world grown-ups you feel safe talking to when things feel overwhelming.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {adults.map((adult, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E2E8F0] flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-sm text-[#0F172A] block">{adult.name}</span>
                  <span className="text-xs font-semibold text-[#718096] block">{adult.relation}</span>
                  <span className="text-xs font-bold text-[#0E87E3] block">{adult.phone}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#E0F1FE] text-[#0E87E3] flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Add Trusted Adult Form */}
          <form onSubmit={handleAddAdult} className="pt-2 flex flex-wrap gap-2 text-xs">
            <input
              type="text"
              required
              placeholder="Grown-up's name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] flex-1 min-w-[140px]"
            />
            <input
              type="text"
              placeholder="Who are they? (e.g. Aunt, Teacher)"
              value={newRelation}
              onChange={(e) => setNewRelation(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] flex-1 min-w-[140px]"
            />
            <input
              type="text"
              required
              placeholder="Phone or room number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] flex-1 min-w-[140px]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0E87E3] text-white font-bold hover:bg-[#0C436F]"
            >
              Add to Circle
            </button>
          </form>
        </div>

        {/* Non-Clinical Safeguarding Disclaimer */}
        <div className="p-6 rounded-[24px] bg-[#F9F5EA] border border-[#E2E8F0] text-xs text-[#4A5568] space-y-1">
          <strong className="text-[#1A202C] block font-bold">Child Safeguarding Boundary:</strong>
          <p>
            InnerOS Youth is an educational and emotional grounding companion powered by artificial intelligence. It does not provide medical triage, psychiatric diagnosis, clinical therapy, or emergency crisis response. All real-world safety plans must be coordinated with licensed professionals and trusted caregivers.
          </p>
        </div>
      </div>
    </YouthShell>
  );
}
