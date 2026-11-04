"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Shield,
  Clock,
  Lock,
  Trash2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Smile,
  EyeOff,
  Bell,
  Heart,
  Plus,
  RefreshCw,
  PhoneCall,
  ExternalLink,
  BookOpen,
  Info,
  Check,
  MessageSquare,
} from "lucide-react";

import { apiClient } from "@/lib/api-client";

export default function CaregiverDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Child creation state
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildAgeTier, setNewChildAgeTier] = useState<string>("junior");
  const [newChildLocale, setNewChildLocale] = useState<string>("ur");
  const [newChildScreenLimit, setNewChildScreenLimit] = useState<number>(45);
  const [newChildSensory, setNewChildSensory] = useState(false);

  // Status message
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [dashData, refData, subsData, tktData] = await Promise.all([
        apiClient.getParentDashboard().catch(() => null),
        apiClient.getReferrals().catch(() => []),
        apiClient.getUserSubscriptions().catch(() => []),
        apiClient.getUserSupportTickets().catch(() => []),
      ]);
      if (dashData) {
        setSummary(dashData);
        if (dashData.linked_children && dashData.linked_children.length > 0) {
          setSelectedChild(dashData.linked_children[0]);
        }
      }
      setReferrals(refData);
      setSubscriptions(subsData || []);
      setSupportTickets(tktData || []);
    } catch (err: any) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribeFamily = async () => {
    setIsSubscribing(true);
    try {
      const session = await apiClient.createCheckoutSession({
        price_id: "price_family_monthly",
        payment_provider: "mock_sandbox",
      });
      setStatusMessage(`Family Membership activated via Sandbox checkout (${session.status}).`);
      loadDashboard();
    } catch (err: any) {
      setStatusMessage(`Subscription error: ${err.message}`);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSubmitTicket = async () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    try {
      await apiClient.submitSupportTicket({
        subject: ticketSubject,
        category: "parent_support",
        priority: "medium",
        message: ticketMessage,
      });
      setStatusMessage("Support inquiry submitted. Our clinical and technical support team will respond shortly.");
      setShowTicketModal(false);
      setTicketSubject("");
      setTicketMessage("");
      loadDashboard();
    } catch (err: any) {
      setStatusMessage(`Failed to submit ticket: ${err.message}`);
    }
  };


  useEffect(() => {
    loadDashboard();
  }, []);

  const handleCreateChild = async () => {
    if (!newChildName.trim()) return;
    try {
      await apiClient.createChildProfile({
        display_name: newChildName,
        age_tier: newChildAgeTier,
        locale: newChildLocale,
        daily_screen_time_limit_minutes: newChildScreenLimit,
        sensory_low_stimulation: newChildSensory,
      });
      setStatusMessage(`Successfully added child profile for ${newChildName}`);
      setShowAddChildModal(false);
      setNewChildName("");
      loadDashboard();
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  const handleUpdateScreenLimit = async (limit: number) => {
    if (!selectedChild) return;
    try {
      await apiClient.updateChildProfile(selectedChild.id, {
        daily_screen_time_limit_minutes: limit,
      });
      setStatusMessage(`Updated screen time limit to ${limit} minutes for ${selectedChild.display_name}`);
      loadDashboard();
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  const handleToggleSensory = async () => {
    if (!selectedChild) return;
    try {
      await apiClient.updateChildProfile(selectedChild.id, {
        sensory_low_stimulation: !selectedChild.sensory_low_stimulation,
      });
      setStatusMessage(`Updated sensory comfort mode for ${selectedChild.display_name}`);
      loadDashboard();
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  const handleDeleteChild = async (childId: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete the profile for "${name}"? All derived activity records, consent history, and routines will be purged immediately under COPPA / GDPR-K right-to-be-forgotten regulations.`
      )
    ) {
      return;
    }
    try {
      await apiClient.requestChildDataDeletion(childId);
      setStatusMessage(`Permanently purged profile and data for "${name}".`);
      loadDashboard();
    } catch (err: any) {
      setStatusMessage(`Deletion error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1A202C] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E0F1FE] text-[#0E87E3] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Caregiver Oversight & Privacy Hub
              </h1>
              <p className="text-xs sm:text-sm text-[#718096]">
                Transparent governance protecting child autonomy without intrusive surveillance.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddChildModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Child Profile</span>
            </button>
            <Link
              href="/youth/academy"
              className="px-4 py-2 rounded-xl bg-[#0E87E3] hover:bg-[#0C436F] text-white text-xs font-bold transition shadow-xs"
            >
              Open Academy
            </Link>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage(null)} className="font-bold ml-2">
              ✕
            </button>
          </div>
        )}

        {/* TEEN PRIVACY SHIELD HIGHLIGHT NOTICE */}
        <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-3 shadow-xs">
          <EyeOff className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-indigo-900">
              Teen Emotional Autonomy & Confidentiality Architecture
            </h4>
            <p className="leading-relaxed text-indigo-800">
              {summary?.teen_privacy_shield_notice ||
                "In accordance with developmental psychology principles, adolescents (ages 13–17) have confidential emotional autonomy. Raw teen conversations and reflections are never shared with parents. Only safety escalations involving imminent harm trigger safeguarding intervention."}
            </p>
          </div>
        </div>

        {/* Main Grid: Linked Children & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Children Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Linked Child Profiles ({summary?.linked_children?.length || 0})
              </h3>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">Loading profiles...</div>
            ) : summary?.linked_children?.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed text-center text-xs text-muted-foreground space-y-2">
                <p>No child profiles created yet.</p>
                <button
                  onClick={() => setShowAddChildModal(true)}
                  className="text-primary font-semibold hover:underline"
                >
                  Create first profile
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {summary?.linked_children?.map((child: any) => {
                  const isSelected = selectedChild?.id === child.id;
                  return (
                    <div
                      key={child.id}
                      onClick={() => setSelectedChild(child)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? "bg-white border-[#0E87E3] shadow-sm"
                          : "bg-white/60 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#0F172A]">{child.display_name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            Ages {child.age_tier === "little" ? "2–5" : child.age_tier === "junior" ? "6–12" : "13–18"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Daily screen limit: {child.daily_screen_time_limit_minutes} min • Locale: {child.locale.toUpperCase()}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChild(child.id, child.display_name);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition"
                        title="Delete Profile (Right-to-be-Forgotten)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Settings & Activities for Selected Child */}
          <div className="lg:col-span-2 space-y-6">
            {selectedChild ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Settings for {selectedChild.display_name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Parent-governed boundaries and neurodiversity accommodations
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 bg-slate-100 rounded-lg text-slate-600">
                    ID: {selectedChild.id}
                  </span>
                </div>

                {/* Controls Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Screen Time Limit */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary" /> Daily Screen-Time Limit
                      </span>
                      <span className="font-bold text-primary">
                        {selectedChild.daily_screen_time_limit_minutes} min
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      {[30, 45, 60, 90].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => handleUpdateScreenLimit(mins)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            selectedChild.daily_screen_time_limit_minutes === mins
                              ? "bg-primary text-white"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sensory Low-Stimulation Mode */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-teal-600" /> Sensory Low-Stimulation
                      </span>
                      <span
                        className={`text-[11px] font-bold ${
                          selectedChild.sensory_low_stimulation ? "text-teal-600" : "text-slate-400"
                        }`}
                      >
                        {selectedChild.sensory_low_stimulation ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <button
                      onClick={handleToggleSensory}
                      className="w-full py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-100 text-xs"
                    >
                      {selectedChild.sensory_low_stimulation ? "Switch to Standard Mode" : "Enable Calm Theme"}
                    </button>
                  </div>
                </div>

                {/* Recent Completed Activities */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Completed Educational Activities & Milestones
                  </h4>

                  {summary?.recent_activities?.filter((a: any) => a.child_id === selectedChild.id).length ===
                  0 ? (
                    <div className="p-6 rounded-2xl border border-dashed text-center text-xs text-slate-400">
                      No educational lessons recorded yet. Explore the InnerOS Kids Academy to begin!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {summary?.recent_activities
                        ?.filter((a: any) => a.child_id === selectedChild.id)
                        .map((act: any) => (
                          <div
                            key={act.id}
                            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                          >
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-800">{act.module_id}</span>
                              <p className="text-slate-500">{act.progress_indicator}</p>
                            </div>
                            <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                              {act.stage_completed}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-sm">Select a child profile to view details.</div>
            )}
          </div>
        </div>

        {/* SHARED FAMILY EXERCISES */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-slate-900">Shared Offline Family Co-Regulation Exercises</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summary?.shared_family_exercises?.map((ex: any) => (
              <div key={ex.id} className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900">{ex.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold text-[10px]">
                    {ex.duration_minutes} min
                  </span>
                </div>
                <p className="text-rose-800/80 leading-relaxed">{ex.description}</p>
                <span className="text-[10px] text-rose-600 font-semibold block">{ex.target_age}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAMILY MEMBERSHIP, SUBSCRIPTIONS & SUPPORT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subscriptions Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Family Membership &amp; Billing</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {subscriptions.length > 0 ? "Active Plan" : "Universal Free Plan"}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Family membership unlocks multi-child developmental academies, bilingual Urdu/Punjabi audio, and offline co-regulation routines.
            </p>

            {subscriptions.length > 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2 text-xs">
                {subscriptions.map((sub: any) => (
                  <div key={sub.id} className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{sub.product_name}</span>
                      <p className="text-[11px] text-slate-500">
                        Renews {new Date(sub.current_period_end).toLocaleDateString()} &bull; ${(sub.amount_cents / 100).toFixed(2)} / {sub.billing_interval}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pt-2">
                <button
                  onClick={handleSubscribeFamily}
                  disabled={isSubscribing}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs"
                >
                  {isSubscribing ? "Activating..." : "Upgrade to Family Membership ($19.99/mo Sandbox)"}
                </button>
              </div>
            )}
          </div>

          {/* Support Tickets Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Caregiver Support Desk</h3>
              </div>
              <button
                onClick={() => setShowTicketModal(true)}
                className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                New Inquiry
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Direct access to our developmental psychologists and technical support engineers.
            </p>

            <div className="space-y-2 text-xs max-h-36 overflow-y-auto">
              {supportTickets.length === 0 ? (
                <p className="text-slate-400 italic">No open support inquiries.</p>
              ) : (
                supportTickets.map((t: any) => (
                  <div key={t.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">{t.subject}</span>
                      <p className="text-[10px] text-slate-400">{new Date(t.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">
                      {t.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* VERIFIED 24/7 CRISIS & MENTAL HEALTH DIRECTORY */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">Verified Support & Crisis Referral Directory</h3>
            </div>
            <span className="text-xs text-slate-500">24/7 Professional Resources</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {referrals.map((ref: any) => (
              <div key={ref.id} className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-950 truncate max-w-[180px]">
                    {ref.organization_name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono text-[10px]">
                    {ref.country_code}
                  </span>
                </div>
                <div className="space-y-1 text-slate-600">
                  <div className="font-bold text-indigo-700">Phone: {ref.phone}</div>
                  {ref.text_sms && <div>SMS: {ref.text_sms}</div>}
                  <div className="text-[11px] text-slate-400">Languages: {ref.languages}</div>
                </div>
                <a
                  href={ref.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-semibold"
                >
                  <span>Visit website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADD CHILD PROFILE MODAL */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Add Child Profile (Data-Minimized)</h3>
            <p className="text-xs text-slate-500">
              Only a pseudonym or nickname is required. Full legal names are never requested under COPPA data minimization.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Nickname or First Name</label>
                <input
                  type="text"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="e.g. Zara or Dani"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Age Band</label>
                <select
                  value={newChildAgeTier}
                  onChange={(e) => setNewChildAgeTier(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                >
                  <option value="little">Early Childhood (Ages 2–5)</option>
                  <option value="junior">Junior (Ages 6–12)</option>
                  <option value="teen">Adolescents (Ages 13–17)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Preferred Language</label>
                <select
                  value={newChildLocale}
                  onChange={(e) => setNewChildLocale(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                >
                  <option value="ur">اردو (Urdu)</option>
                  <option value="pa">پنجابی (Punjabi Shahmukhi)</option>
                  <option value="en">English</option>
                  <option value="ur-Latn">Roman Urdu</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Daily Screen Time Limit (Minutes)</label>
                <input
                  type="number"
                  value={newChildScreenLimit}
                  onChange={(e) => setNewChildScreenLimit(parseInt(e.target.value) || 45)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="sensoryCheck"
                  checked={newChildSensory}
                  onChange={(e) => setNewChildSensory(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="sensoryCheck" className="text-slate-700">
                  Enable Low-Stimulation sensory palette by default
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowAddChildModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChild}
                className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90"
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT INQUIRY MODAL */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">New Caregiver Support Inquiry</h3>
            <p className="text-xs text-slate-500">
              Submit a question regarding curriculum, developmental pacing, language tracks, or account billing.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Subject</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Question about ADHD bedtime routine"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Message</label>
                <textarea
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe your inquiry or question..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowTicketModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTicket}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
              >
                Submit Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

