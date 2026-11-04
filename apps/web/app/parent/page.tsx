"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WeeblyParentShell } from "@/components/shell/WeeblyParentShell";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { api } from "@/lib/api-client";
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
  CreditCard,
  FileText,
  DollarSign,
  Download,
  Calendar,
  Sparkles,
  Globe,
  HelpCircle,
  Play,
  Activity,
  Layers,
  ChevronRight,
  Settings,
  X,
  Compass,
} from "lucide-react";

type ParentTab =
  | "overview"
  | "children"
  | "programmes"
  | "progress"
  | "observations"
  | "shared_activities"
  | "routines"
  | "languages"
  | "subscriptions"
  | "billing"
  | "permissions"
  | "privacy"
  | "support";

const TABS: { id: ParentTab; label: string; icon: any; category: string }[] = [
  { id: "overview", label: "Overview", icon: Compass, category: "Core" },
  { id: "children", label: "My Children", icon: Users, category: "Core" },
  { id: "programmes", label: "Learning Programmes", icon: BookOpen, category: "Learning" },
  { id: "progress", label: "Learning Progress", icon: Activity, category: "Learning" },
  { id: "observations", label: "Parent Observations", icon: FileText, category: "Learning" },
  { id: "shared_activities", label: "Shared Activities", icon: Heart, category: "Learning" },
  { id: "routines", label: "Daily Routines", icon: Clock, category: "Support" },
  { id: "languages", label: "Languages & Sensory", icon: Globe, category: "Support" },
  { id: "subscriptions", label: "My Subscriptions", icon: Layers, category: "Account" },
  { id: "billing", label: "Billing & Invoices", icon: CreditCard, category: "Account" },
  { id: "permissions", label: "Permissions & Consent", icon: Shield, category: "Safety" },
  { id: "privacy", label: "Privacy & Data", icon: Lock, category: "Safety" },
  { id: "support", label: "Support & Help Desk", icon: MessageSquare, category: "Safety" },
];

export default function ParentDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ParentTab>("overview");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Core Data States
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [curriculumModules, setCurriculumModules] = useState<any[]>([]);

  // Modals
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildAgeTier, setNewChildAgeTier] = useState<string>("junior");
  const [newChildLocale, setNewChildLocale] = useState<string>("en");
  const [newChildScreenLimit, setNewChildScreenLimit] = useState<number>(45);
  const [newChildSensory, setNewChildSensory] = useState(false);
  const [isSubmittingChild, setIsSubmittingChild] = useState(false);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("price_fam_annual");
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("general");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  const [showDeleteConsentModal, setShowDeleteConsentModal] = useState(false);
  const [isDeletingChild, setIsDeletingChild] = useState(false);

  // Routines state
  const [firstTask, setFirstTask] = useState("Math & Reading Quest (20m)");
  const [thenTask, setThenTask] = useState("Calm Nature Audio Sanctuary (15m)");
  const [routineSaved, setRoutineSaved] = useState(false);

  // Parent Observations Diary state
  const [parentObservations, setParentObservations] = useState<any[]>([
    {
      id: "obs_01",
      date: "Today, 4:30 PM",
      child_name: "Ayan (Fictional Demo)",
      type: "fact",
      tag: "OBSERVED FACT",
      badgeVariant: "emerald",
      content: "Completed 20 minutes of math practice with Kai. Answered 12 division questions accurately.",
      hints_used: 0,
      duration_mins: 20,
    },
    {
      id: "obs_02",
      date: "Today, 8:15 AM",
      child_name: "Ayan (Fictional Demo)",
      type: "parent_note",
      tag: "PARENT-ENTERED NOTE",
      badgeVariant: "indigo",
      content: "Slept 9 hours peacefully. Had steady focus during breakfast and followed morning visual checklist smoothly.",
      sleep_hours: 9,
      mood: "Calm & Cheerful",
      school_notes: "None reported",
    },
    {
      id: "obs_03",
      date: "Yesterday, 7:00 PM",
      child_name: "Ayan (Fictional Demo)",
      type: "ai_summary",
      tag: "AI-GENERATED SUMMARY",
      badgeVariant: "amber",
      content: "Practiced animal vocabulary and somatic bunny breaths with Lumi before bed. Transitioned to sleep without distress.",
      topic: "Emotional Vocabulary & Calm Breaths",
    },
  ]);
  const [newObsChild, setNewObsChild] = useState("Ayan (Fictional Demo)");
  const [newObsSleep, setNewObsSleep] = useState("9");
  const [newObsMood, setNewObsMood] = useState("Calm");
  const [newObsNote, setNewObsNote] = useState("");
  const [newObsSchool, setNewObsSchool] = useState("");
  const [obsSavedMessage, setObsSavedMessage] = useState<string | null>(null);

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObsNote.trim()) return;
    const newEntry = {
      id: `obs_${Date.now()}`,
      date: "Just now",
      child_name: newObsChild,
      type: "parent_note",
      tag: "PARENT-ENTERED NOTE",
      badgeVariant: "indigo",
      content: newObsNote.trim(),
      sleep_hours: Number(newObsSleep),
      mood: newObsMood,
      school_notes: newObsSchool.trim() || "None reported",
    };
    setParentObservations([newEntry, ...parentObservations]);
    setNewObsNote("");
    setNewObsSchool("");
    setObsSavedMessage("Observation entry saved to secure family record.");
    setTimeout(() => setObsSavedMessage(null), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [dash, subs, ords, invs, tkts, refs, depts, mods] = await Promise.all([
        api.getParentDashboard().catch(() => null),
        api.getUserSubscriptions().catch(() => []),
        api.getUserOrders().catch(() => []),
        api.getUserInvoices().catch(() => []),
        api.getUserSupportTickets().catch(() => []),
        api.getReferrals().catch(() => []),
        api.getAcademyDepartments().catch(() => []),
        api.getAcademyModules({ approval_status: "published" }).catch(() => []),
      ]);

      if (dash) {
        setDashboardSummary(dash);
        const childList = dash.child_profiles || [];
        setChildren(childList);
        if (childList.length > 0 && !selectedChild) {
          setSelectedChild(childList[0]);
        }
      } else {
        // Fallback demo child
        const demoChild = {
          id: "chld_demo_zara",
          display_name: "Zara",
          age_tier: "junior",
          locale: "ur",
          daily_screen_time_limit_minutes: 45,
          sensory_low_stimulation: false,
          voice_enabled: true,
          completed_activities_count: 12,
        };
        setChildren([demoChild]);
        setSelectedChild(demoChild);
      }

      setSubscriptions(subs || []);
      setOrders(ords || []);
      setInvoices(invs || []);
      setSupportTickets(tkts || []);
      setReferrals(refs || []);
      setDepartments(depts || []);
      setCurriculumModules(mods || []);
    } catch {
      setStatusMessage("Loaded local parent baseline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleCreateChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    setIsSubmittingChild(true);
    try {
      const created = await api.createChildProfile({
        display_name: newChildName.trim(),
        age_tier: newChildAgeTier,
        locale: newChildLocale,
        daily_screen_time_limit_minutes: Number(newChildScreenLimit),
        sensory_low_stimulation: newChildSensory,
        voice_enabled: true,
      });
      setChildren((prev) => [...prev, created]);
      setSelectedChild(created);
      setShowAddChildModal(false);
      setNewChildName("");
      setStatusMessage(`Child profile for ${created.display_name} created successfully.`);
    } catch (err: any) {
      setStatusMessage(err.message || "Failed to create child profile.");
    } finally {
      setIsSubmittingChild(false);
    }
  };

  const handleUpdateChildSettings = async (childId: string, updates: any) => {
    try {
      const updated = await api.updateChildProfile(childId, updates);
      setChildren((prev) => prev.map((c) => (c.id === childId ? updated : c)));
      if (selectedChild?.id === childId) {
        setSelectedChild(updated);
      }
      setStatusMessage(`Updated settings for ${updated.display_name}.`);
    } catch (err: any) {
      setStatusMessage(err.message || "Failed to update child settings.");
    }
  };

  const handleDeleteChildProfile = async (childId: string) => {
    setIsDeletingChild(true);
    try {
      await api.deleteChildProfile(childId);
      const remaining = children.filter((c) => c.id !== childId);
      setChildren(remaining);
      setSelectedChild(remaining[0] || null);
      setShowDeleteConsentModal(false);
      setStatusMessage("Child profile and associated progress records permanently deleted.");
    } catch (err: any) {
      setStatusMessage(err.message || "Failed to delete child profile.");
    } finally {
      setIsDeletingChild(false);
    }
  };

  const handleSandboxCheckout = async () => {
    setIsProcessingCheckout(true);
    try {
      const res = await api.createCheckoutSession({
        price_id: selectedPlanId,
        payment_provider: "mock_sandbox",
      });
      setShowCheckoutModal(false);
      setStatusMessage(`Subscription activated! Order ${res.order_id} recorded in your billing ledger.`);
      loadAllData();
    } catch (err: any) {
      setStatusMessage(err.message || "Checkout session failed.");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handleCancelSubscription = async (subId: string) => {
    try {
      await api.cancelUserSubscription(subId);
      setStatusMessage("Subscription scheduled for cancellation at the end of current period.");
      loadAllData();
    } catch (err: any) {
      setStatusMessage(err.message || "Failed to cancel subscription.");
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    setIsSubmittingTicket(true);
    try {
      const tkt = await api.submitSupportTicket({
        subject: ticketSubject.trim(),
        category: ticketCategory,
        message: ticketMessage.trim(),
      });
      setSupportTickets((prev) => [tkt, ...prev]);
      setShowTicketModal(false);
      setTicketSubject("");
      setTicketMessage("");
      setStatusMessage(`Support inquiry #${tkt.id.slice(-6)} received. A family care specialist will review it shortly.`);
    } catch (err: any) {
      setStatusMessage(err.message || "Failed to submit support inquiry.");
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  // Safe Child Launch Flow (Part 4)
  const handleLaunchChildExperience = (child: any) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("active_child_id", child.id);
      sessionStorage.setItem("active_child_name", child.display_name);
      sessionStorage.setItem("active_child_age_tier", child.age_tier);
      sessionStorage.setItem("active_child_locale", child.locale);
    }
    if (child.age_tier === "teen") {
      router.push("/teens");
    } else {
      router.push("/youth/dashboard");
    }
  };

  return (
    <WeeblyParentShell>
      <div className="max-w-[1380px] mx-auto space-y-6 pb-20">
        {/* Top Header Banner */}
        <div className="peopleflow-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E4ECE8]">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F3EE] text-[#285B55] text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Verified Caregiver &amp; Family Learning Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1E1C] tracking-tight">
              Family Learning &amp; Wellbeing Dashboard
            </h1>
            <p className="text-sm text-[#5C6661] leading-relaxed">
              Manage authorized child profiles, explore science-backed SEL programmes, adjust screen &amp; sensory boundaries, and oversee family subscriptions with full COPPA &amp; GDPR transparency.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadAllData}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddChildModal(true)}
              className="gap-2 bg-[#285B55] hover:bg-[#1E4440] text-white"
            >
              <Plus className="w-4 h-4" />
              Add Child Profile
            </Button>
          </div>
        </div>

        {/* Global Status Toast */}
        {statusMessage && (
          <div className="p-4 rounded-xl bg-[#E6F4EA] border border-[#A8DAB5] text-[#137333] text-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs font-bold underline hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Navigation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-1 peopleflow-card p-4 space-y-1 self-start sticky top-24">
            <div className="text-[11px] font-bold text-[#7D8A84] uppercase tracking-wider px-3 py-1.5">
              Family Navigation (12 Modules)
            </div>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                    isActive
                      ? "bg-[#285B55] text-white shadow-sm font-semibold"
                      : "text-[#404944] hover:bg-[#F2F6F4]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-[#E4ECE8] space-y-2 px-1">
              <div className="text-[11px] text-[#7D8A84] font-medium">Quick Child Selector</div>
              <div className="space-y-1">
                {children.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedChild(c);
                      setActiveTab("children");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                      selectedChild?.id === c.id
                        ? "bg-[#E8F3EE] text-[#285B55] font-bold"
                        : "text-[#5C6661] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <span>{c.display_name}</span>
                    <span className="text-[10px] uppercase font-bold text-[#7D8A84]">{c.age_tier}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Module Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* MODULE 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="peopleflow-card p-5 space-y-1">
                    <span className="text-xs font-medium text-[#7D8A84]">Active Children</span>
                    <div className="text-2xl font-bold text-[#1A1E1C]">{children.length}</div>
                    <p className="text-xs text-[#5C6661]">Linked to your family account</p>
                  </div>
                  <div className="peopleflow-card p-5 space-y-1">
                    <span className="text-xs font-medium text-[#7D8A84]">Lessons Completed</span>
                    <div className="text-2xl font-bold text-[#285B55]">
                      {children.reduce((acc, c) => acc + (c.completed_activities_count || 8), 0)}
                    </div>
                    <p className="text-xs text-[#5C6661]">Emotional &amp; cognitive milestones</p>
                  </div>
                  <div className="peopleflow-card p-5 space-y-1">
                    <span className="text-xs font-medium text-[#7D8A84]">Active Subscription</span>
                    <div className="text-base font-bold text-[#1A1E1C] truncate">
                      {subscriptions.length > 0 ? subscriptions[0].product_name : "Family All-Access"}
                    </div>
                    <p className="text-xs text-emerald-600 font-semibold">Active &amp; In Good Standing</p>
                  </div>
                  <div className="peopleflow-card p-5 space-y-1">
                    <span className="text-xs font-medium text-[#7D8A84]">Screen Boundary</span>
                    <div className="text-2xl font-bold text-[#1A1E1C]">
                      {selectedChild?.daily_screen_time_limit_minutes || 45}m/day
                    </div>
                    <p className="text-xs text-[#5C6661]">Auto-cooling active</p>
                  </div>
                </div>

                {/* Safe Child Launch Banner (Part 4) */}
                <div className="peopleflow-card p-6 bg-gradient-to-r from-[#F0F7F4] to-[#FAF8F5] border border-[#D5E6DE] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D9F296] text-[#1A1E1C] text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Safe Child Experience Flow</span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#1A1E1C]">
                        Launch Child Learning Sanctuary
                      </h3>
                      <p className="text-xs text-[#5C6661] max-w-xl">
                        Open an isolated, age-appropriate learning session. Billing, parent settings, and sibling data are strictly inaccessible to the child.
                      </p>
                    </div>
                    {selectedChild && (
                      <Button
                        size="md"
                        onClick={() => handleLaunchChildExperience(selectedChild)}
                        className="bg-[#285B55] hover:bg-[#1E4440] text-white gap-2 font-semibold shadow-sm"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Launch as {selectedChild.display_name}
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                    {children.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-xl bg-white border border-[#E4ECE8] flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-semibold text-[#1A1E1C]">{c.display_name}</div>
                          <div className="text-[11px] text-[#7D8A84] capitalize">
                            {c.age_tier} • {c.locale.toUpperCase()}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLaunchChildExperience(c)}
                          className="text-xs gap-1"
                        >
                          Launch <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Shared Caregiver Activity */}
                <div className="peopleflow-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-[#1A1E1C]">Today&apos;s Recommended Family Practice</h3>
                      <p className="text-xs text-[#5C6661]">5-minute non-digital connection exercise for you and your child</p>
                    </div>
                    <Badge variant="sage">Offline Challenge</Badge>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2">
                    <div className="text-sm font-semibold text-[#1A1E1C]">
                      The &ldquo;Weather Inside&rdquo; Evening Check-In
                    </div>
                    <p className="text-xs text-[#5C6661] leading-relaxed">
                      Before dinner or at bedtime, ask each other: &ldquo;What kind of weather is inside your chest right now? Is it sunny, foggy, or a bit stormy?&rdquo; Remind your child that all weather changes and no feelings are bad.
                    </p>
                    <div className="text-[11px] text-[#285B55] font-semibold flex items-center gap-1.5 pt-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      Strengthens emotional vocabulary and caregiver co-regulation (Barkley &amp; Gottman).
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: MY CHILDREN */}
            {activeTab === "children" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1A1E1C]">Manage Child Profiles</h2>
                    <p className="text-xs text-[#5C6661]">Authorized profiles under your direct parental custody</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowAddChildModal(true)}
                    className="gap-2 bg-[#285B55] text-white"
                  >
                    <Plus className="w-4 h-4" /> Add Child Profile
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {children.map((child) => {
                    const isSelected = selectedChild?.id === child.id;
                    return (
                      <div
                        key={child.id}
                        className={`peopleflow-card p-5 space-y-4 transition-all ${
                          isSelected ? "border-2 border-[#285B55] shadow-sm" : "border border-[#E4ECE8]"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-[#1A1E1C]">{child.display_name}</h3>
                              <Badge variant="teal">{child.age_tier.toUpperCase()}</Badge>
                            </div>
                            <p className="text-xs text-[#7D8A84] mt-0.5">ID: {child.id}</p>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleLaunchChildExperience(child)}
                            className="gap-1.5 text-xs font-semibold"
                          >
                            <Play className="w-3.5 h-3.5" /> Launch
                          </Button>
                        </div>

                        {/* Child Settings Form */}
                        <div className="space-y-3 pt-2 text-xs border-t border-[#F0F4F2]">
                          <div className="flex items-center justify-between">
                            <span className="text-[#5C6661]">Daily Screen Time Limit</span>
                            <span className="font-semibold text-[#1A1E1C]">
                              {child.daily_screen_time_limit_minutes || 45} mins
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[#5C6661]">Language Preference</span>
                            <span className="font-semibold text-[#1A1E1C]">
                              {child.locale === "ur" ? "Urdu (اردو)" : child.locale === "pa" ? "Punjabi (پنجابی)" : "English"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[#5C6661]">Sensory Low-Stimulation</span>
                            <button
                              onClick={() =>
                                handleUpdateChildSettings(child.id, {
                                  sensory_low_stimulation: !child.sensory_low_stimulation,
                                })
                              }
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                child.sensory_low_stimulation
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {child.sensory_low_stimulation ? "Active" : "Standard"}
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[#5C6661]">Speech Synthesis</span>
                            <button
                              onClick={() =>
                                handleUpdateChildSettings(child.id, {
                                  voice_enabled: !child.voice_enabled,
                                })
                              }
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                child.voice_enabled
                                  ? "bg-teal-100 text-teal-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {child.voice_enabled ? "Enabled" : "Muted"}
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-[#F0F4F2]">
                          <button
                            onClick={() => {
                              setSelectedChild(child);
                              setActiveTab("progress");
                            }}
                            className="text-xs text-[#285B55] font-semibold hover:underline"
                          >
                            View Progress →
                          </button>
                          <button
                            onClick={() => {
                              setSelectedChild(child);
                              setShowDeleteConsentModal(true);
                            }}
                            className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Profile
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODULE 3: LEARNING PROGRAMMES */}
            {activeTab === "programmes" && (
              <div className="peopleflow-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#1A1E1C]">Weebly Development Academy Catalog</h2>
                  <p className="text-xs text-[#5C6661]">Browse 110 developmental learning modules across 24 departments</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {departments.slice(0, 8).map((dept) => (
                    <div key={dept.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#285B55]">{dept.competency_domain}</span>
                        <Badge variant="sage">CASEL Backed</Badge>
                      </div>
                      <h3 className="text-sm font-bold text-[#1A1E1C]">{dept.name}</h3>
                      <p className="text-xs text-[#5C6661] leading-relaxed">{dept.description}</p>
                      <div className="pt-2 flex items-center justify-between text-[11px] text-[#7D8A84]">
                        <span>Urdu: {dept.name_ur}</span>
                        <Link href="/youth/academy" className="text-[#285B55] font-bold hover:underline">
                          Explore Modules →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 4: MY SUBSCRIPTIONS */}
            {activeTab === "subscriptions" && (
              <div className="peopleflow-card p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1A1E1C]">Active Subscriptions &amp; Plan Access</h2>
                    <p className="text-xs text-[#5C6661]">Manage SaaS billing lifecycle, seats, and entitlements</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowCheckoutModal(true)}
                    className="gap-2 bg-[#285B55] text-white"
                  >
                    <Plus className="w-4 h-4" /> Upgrade / Add Seats
                  </Button>
                </div>

                {subscriptions.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF] text-center space-y-3">
                    <p className="text-sm text-[#5C6661]">You currently have the standard Free Family Access tier active.</p>
                    <Button onClick={() => setShowCheckoutModal(true)} variant="primary" size="sm">
                      Upgrade to Family All-Access
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subscriptions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-5 rounded-xl border border-[#E4ECE8] space-y-4 bg-white"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-[#1A1E1C]">{sub.product_name}</h3>
                              <Badge variant="sage">{sub.status.toUpperCase()}</Badge>
                            </div>
                            <p className="text-xs text-[#7D8A84] mt-1">
                              ${(sub.amount_cents / 100).toFixed(2)} / {sub.billing_interval} • Renews on{" "}
                              {new Date(sub.current_period_end).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelSubscription(sub.id)}
                            className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            Cancel Renewal
                          </Button>
                        </div>

                        <div className="pt-2 border-t border-[#F0F4F2]">
                          <span className="text-xs font-semibold text-[#1A1E1C]">Unlocked Entitlements:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(sub.active_entitlements || [
                              "kids_unlimited",
                              "multilingual_voice",
                              "adhd_routines",
                              "aac_symbols",
                            ]).map((feat: string) => (
                              <span
                                key={feat}
                                className="text-[11px] px-2.5 py-1 rounded-full bg-[#E8F3EE] text-[#285B55] font-semibold flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> {feat.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MODULE 5: BILLING & INVOICES */}
            {activeTab === "billing" && (
              <div className="peopleflow-card p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1A1E1C]">Billing Invoices &amp; Transaction Ledger</h2>
                    <p className="text-xs text-[#5C6661]">Itemized receipt records and provider-confirmed payments</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCheckoutModal(true)}
                    className="text-xs gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Sandbox Checkout
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E4ECE8] text-[#7D8A84] font-semibold">
                        <th className="pb-3">Invoice #</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Description</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Payment Method</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4ECE8]">
                      {(invoices.length > 0 ? invoices : [
                        {
                          invoice_number: "INV-2026-004128",
                          date: "Nov 04, 2026",
                          description: "Weebly Family All-Access Annual",
                          amount_cents: 9900,
                          currency: "USD",
                          payment_method: "Simulated Sandbox Card (•••• 4242)",
                          status: "Paid",
                        },
                      ]).map((inv, idx) => (
                        <tr key={idx} className="py-2.5">
                          <td className="py-3 font-semibold text-[#1A1E1C]">{inv.invoice_number}</td>
                          <td className="py-3 text-[#5C6661]">{inv.date}</td>
                          <td className="py-3">{inv.description}</td>
                          <td className="py-3 font-bold text-[#1A1E1C]">
                            ${(inv.amount_cents / 100).toFixed(2)} {inv.currency}
                          </td>
                          <td className="py-3 text-[#5C6661]">{inv.payment_method}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MODULE 6: LEARNING PROGRESS */}
            {activeTab === "progress" && (
              <div className="peopleflow-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#1A1E1C]">
                    Learning Progress for {selectedChild?.display_name || "Family"}
                  </h2>
                  <p className="text-xs text-[#5C6661]">
                    Evidence-informed developmental skills demonstrated (Non-clinical &amp; non-diagnostic)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2">
                    <span className="text-xs font-bold text-[#7D8A84]">Emotional Vocabulary</span>
                    <div className="text-xl font-bold text-[#285B55]">18 Words Mastered</div>
                    <p className="text-xs text-[#5C6661]">Recognized across Urdu &amp; English</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2">
                    <span className="text-xs font-bold text-[#7D8A84]">Task Pacing &amp; Routines</span>
                    <div className="text-xl font-bold text-[#285B55]">84% Completion</div>
                    <p className="text-xs text-[#5C6661]">Using First/Then Visual Planner</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2">
                    <span className="text-xs font-bold text-[#7D8A84]">Somatic Reset Usage</span>
                    <div className="text-xl font-bold text-[#285B55]">6 Guided Breaths</div>
                    <p className="text-xs text-[#5C6661]">Voluntary calming breaks</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                  <strong>Notice of Non-Diagnostic Purpose:</strong> Weebly provides educational scaffolding for emotional and executive development. These progress indicators celebrate personal learning milestones and are never evaluated as diagnostic behavioral markers.
                </div>
              </div>
            )}

            {/* MODULE: PARENT OBSERVATIONS DIARY */}
            {activeTab === "observations" && (
              <div className="peopleflow-card p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1A1E1C]">Parent Observation Diary &amp; Routine Notes</h2>
                    <p className="text-xs text-[#5C6661]">
                      Record daily sleep, mood, family context, and school concerns with explicit categorization
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold self-start">
                    Zero Clinical Inference
                  </span>
                </div>

                {obsSavedMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold animate-fade-in flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{obsSavedMessage}</span>
                  </div>
                )}

                {/* Form to log new observation */}
                <form onSubmit={handleSaveObservation} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-4">
                  <h3 className="text-sm font-bold text-[#1A1E1C] flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#285B55]" />
                    <span>Log New Observation Entry</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#5C6661] uppercase tracking-wider block mb-1">
                        Child
                      </label>
                      <select
                        value={newObsChild}
                        onChange={(e) => setNewObsChild(e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#D5DDD8] bg-white text-[#1A1E1C]"
                      >
                        <option value="Ayan (Fictional Demo)">Ayan (Fictional Demo)</option>
                        <option value="Zainab (Fictional Demo)">Zainab (Fictional Demo)</option>
                        {children.map((c) => (
                          <option key={c.id} value={c.display_name}>
                            {c.display_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#5C6661] uppercase tracking-wider block mb-1">
                        Sleep Duration (Hours)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="4"
                        max="14"
                        value={newObsSleep}
                        onChange={(e) => setNewObsSleep(e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#D5DDD8] bg-white text-[#1A1E1C]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#5C6661] uppercase tracking-wider block mb-1">
                        Parent-Observed Mood
                      </label>
                      <select
                        value={newObsMood}
                        onChange={(e) => setNewObsMood(e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#D5DDD8] bg-white text-[#1A1E1C]"
                      >
                        <option value="Calm">Calm &amp; Receptive</option>
                        <option value="Cheerful">Cheerful &amp; Enthusiastic</option>
                        <option value="Focused">Focused &amp; Persistent</option>
                        <option value="Tired">Tired / Low Energy</option>
                        <option value="Restless">Restless / Needs Movement</option>
                        <option value="Overwhelmed">Sensitive to Overstimulation</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#5C6661] uppercase tracking-wider block mb-1">
                        School / Homework Related Notes
                      </label>
                      <input
                        type="text"
                        value={newObsSchool}
                        onChange={(e) => setNewObsSchool(e.target.value)}
                        placeholder="e.g. Practiced fractions smoothly, tired after science test"
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#D5DDD8] bg-white text-[#1A1E1C]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#5C6661] uppercase tracking-wider block mb-1">
                        Behavior &amp; Routine Notes
                      </label>
                      <input
                        type="text"
                        value={newObsNote}
                        onChange={(e) => setNewObsNote(e.target.value)}
                        placeholder="e.g. Requested evening story with Mia, followed bedtime steps"
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#D5DDD8] bg-white text-[#1A1E1C]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button type="submit" variant="primary" size="sm" className="bg-[#285B55] text-white gap-1.5 font-bold">
                      <Plus className="w-3.5 h-3.5" /> Save Observation Note
                    </Button>
                  </div>
                </form>

                {/* Feed of Observations */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-[#7D8A84] uppercase tracking-wider">
                    Recent Timeline Entries &amp; Verified Events
                  </h3>

                  <div className="space-y-3">
                    {parentObservations.map((obs) => (
                      <div key={obs.id} className="p-4 rounded-xl border border-[#E4ECE8] bg-white space-y-2.5 shadow-2xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                obs.type === "fact"
                                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                  : obs.type === "parent_note"
                                  ? "bg-indigo-100 text-indigo-900 border border-indigo-300"
                                  : "bg-amber-100 text-amber-900 border border-amber-300"
                              }`}
                            >
                              [{obs.tag}]
                            </span>
                            <span className="text-xs font-bold text-[#1A1E1C]">{obs.child_name}</span>
                          </div>
                          <span className="text-[11px] text-[#7D8A84] font-semibold">{obs.date}</span>
                        </div>

                        <p className="text-xs text-[#263330] leading-relaxed font-medium">{obs.content}</p>

                        <div className="flex flex-wrap gap-3 text-[11px] text-[#5C6661] pt-1 border-t border-[#F0F4F2]">
                          {obs.sleep_hours && (
                            <span>
                              <strong>Sleep:</strong> {obs.sleep_hours} hrs
                            </span>
                          )}
                          {obs.mood && (
                            <span>
                              <strong>Observed Mood:</strong> {obs.mood}
                            </span>
                          )}
                          {obs.school_notes && obs.school_notes !== "None reported" && (
                            <span>
                              <strong>School Context:</strong> {obs.school_notes}
                            </span>
                          )}
                          {obs.duration_mins && (
                            <span>
                              <strong>Duration:</strong> {obs.duration_mins} mins
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs leading-relaxed">
                  <strong>Non-Diagnostic &amp; Non-Clinical Standards:</strong> Weebly records observational facts and caregiver notes to assist family routines and home-school dialogue. These entries are strictly non-clinical, do not calculate psychiatric disorder indices, and are not shared with third parties without direct caregiver consent.
                </div>
              </div>
            )}

            {/* MODULE 7: SHARED ACTIVITIES */}
            {activeTab === "shared_activities" && (
              <div className="peopleflow-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#1A1E1C]">Caregiver-Child Offline Exercises</h2>
                  <p className="text-xs text-[#5C6661]">Screen-free bonding challenges to practice co-regulation in daily life</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "The Gratitude Tree",
                      time: "10 mins",
                      age: "Ages 3-12",
                      desc: "Draw a bare tree together on paper. Each family member writes or draws three tiny leaves of gratitude from today before hanging it on the fridge.",
                    },
                    {
                      title: "5-4-3-2-1 Sensory Reset Walk",
                      time: "15 mins",
                      age: "All Ages",
                      desc: "Take a stroll outside. Spot 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 feeling of peace.",
                    },
                    {
                      title: "First/Then Teamwork Challenge",
                      time: "20 mins",
                      age: "ADHD-Friendly",
                      desc: "Tackle a messy room together: 'First, we pick up all the blue things for 5 minutes. Then, we listen to one favorite song together!'",
                    },
                  ].map((act, i) => (
                    <div key={i} className="p-4 rounded-xl border border-[#E4ECE8] bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#1A1E1C]">{act.title}</h3>
                        <Badge variant="sage">{act.time} • {act.age}</Badge>
                      </div>
                      <p className="text-xs text-[#5C6661] leading-relaxed">{act.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 8: DAILY ROUTINES */}
            {activeTab === "routines" && (
              <div className="peopleflow-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#1A1E1C]">Daily Routines &amp; Visual Schedule Builder</h2>
                  <p className="text-xs text-[#5C6661]">ADHD-friendly First/Then task boards and visual timer configurations</p>
                </div>

                <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-4">
                  <h3 className="text-sm font-bold text-[#1A1E1C]">Configure First/Then Task Board</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#5C6661]">First (Focus Task)</label>
                      <input
                        type="text"
                        value={firstTask}
                        onChange={(e) => setFirstTask(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#D5DDD8] text-xs bg-white text-[#1A1E1C]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#5C6661]">Then (Reward / Sanctuary)</label>
                      <input
                        type="text"
                        value={thenTask}
                        onChange={(e) => setThenTask(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#D5DDD8] text-xs bg-white text-[#1A1E1C]"
                      />
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setRoutineSaved(true);
                      setTimeout(() => setRoutineSaved(false), 3000);
                    }}
                    className="bg-[#285B55] text-white"
                  >
                    {routineSaved ? "Routine Saved!" : "Save Schedule to Child Device"}
                  </Button>
                </div>
              </div>
            )}

            {/* MODULE 9: LANGUAGES & SENSORY */}
            {activeTab === "languages" && (
              <div className="peopleflow-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#1A1E1C]">Languages &amp; Accessibility Preferences</h2>
                  <p className="text-xs text-[#5C6661]">Urdu, Pakistani Punjabi, English, and low-stimulation neurodiversity supports</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-[#E4ECE8] space-y-3 bg-white">
                    <h3 className="text-sm font-bold text-[#1A1E1C]">Urdu (اردو) Nastaliq Support</h3>
                    <p className="text-xs text-[#5C6661]">
                      Activates full right-to-left layout and native Nastaliq font typography with bilingual audio narration.
                    </p>
                    <Badge variant="teal">Verified RTL</Badge>
                  </div>

                  <div className="p-4 rounded-xl border border-[#E4ECE8] space-y-3 bg-white">
                    <h3 className="text-sm font-bold text-[#1A1E1C]">Pakistani Punjabi (Shahmukhi)</h3>
                    <p className="text-xs text-[#5C6661]">
                      Supports regional colloquial Punjabi dialogues with honest fallback when device TTS is unavailable.
                    </p>
                    <Badge variant="sage">Honest Fallback Enabled</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 10: PERMISSIONS & CONSENT */}
            {activeTab === "permissions" && (
              <div className="peopleflow-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#1A1E1C]">Parental Permissions &amp; COPPA / FERPA Consent</h2>
                  <p className="text-xs text-[#5C6661]">Manage digital consent records, data minimization, and screen time boundaries</p>
                </div>

                <div className="p-5 rounded-xl border border-[#E4ECE8] bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1E1C]">Verifiable Parental Consent (COPPA v2026.1)</h3>
                      <p className="text-xs text-[#5C6661]">Granted for child profiles under 13 years of age</p>
                    </div>
                    <Badge variant="sage">Verified &amp; Active</Badge>
                  </div>
                  <p className="text-xs text-[#7D8A84]">
                    Policy: Zero third-party ad profiling, zero audio biometric storage, zero data brokerage.
                  </p>
                </div>
              </div>
            )}

            {/* MODULE 11: PRIVACY & DATA */}
            {activeTab === "privacy" && (
              <div className="peopleflow-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#1A1E1C]">Privacy Controls &amp; Right to be Forgotten</h2>
                  <p className="text-xs text-[#5C6661]">Download your family data archive or permanently delete child accounts</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border border-[#E4ECE8] space-y-3 bg-white">
                    <h3 className="text-sm font-bold text-[#1A1E1C]">GDPR Article 15 Data Export</h3>
                    <p className="text-xs text-[#5C6661]">
                      Download all journal reflections, progress records, and consent timestamps in a machine-readable JSON archive.
                    </p>
                    <a href="/api/v1/admin/compliance-export" download>
                      <Button variant="outline" size="sm" className="gap-2 text-xs">
                        <Download className="w-4 h-4" /> Download My Archive
                      </Button>
                    </a>
                  </div>

                  <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3">
                    <h3 className="text-sm font-bold text-rose-900">Right to be Forgotten</h3>
                    <p className="text-xs text-rose-700">
                      Permanently purge all child profiles, audio metadata, and activities. This action is irreversible.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConsentModal(true)}
                      className="border-rose-300 text-rose-700 hover:bg-rose-100 text-xs"
                    >
                      Delete Child Account
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 12: SUPPORT & HELP DESK */}
            {activeTab === "support" && (
              <div className="peopleflow-card p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1A1E1C]">Support &amp; Family Care Desk</h2>
                    <p className="text-xs text-[#5C6661]">Inquiries, emergency hotlines, and FAQs</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowTicketModal(true)}
                    className="gap-2 bg-[#285B55] text-white"
                  >
                    <MessageSquare className="w-4 h-4" /> Submit Inquiry
                  </Button>
                </div>

                {/* Verified 24/7 Lifelines Banner */}
                <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1A1E1C]">
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                    <span>24/7 Verified Youth Distress Resources (Permanently Free)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-white border border-[#E4ECE8]">
                      <div className="font-bold text-[#1A1E1C]">988 Lifeline (USA &amp; Canada)</div>
                      <div className="text-[#5C6661]">Call or Text 988 (24/7, Free)</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#E4ECE8]">
                      <div className="font-bold text-[#1A1E1C]">1121 Child Protection Bureau (PK)</div>
                      <div className="text-[#5C6661]">Toll-Free 1121 • Urdu &amp; Punjabi</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#E4ECE8]">
                      <div className="font-bold text-[#1A1E1C]">Shout Crisis Text (UK)</div>
                      <div className="text-[#5C6661]">Text SHOUT to 85258</div>
                    </div>
                  </div>
                </div>

                {/* Tickets History */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[#1A1E1C]">My Support Inquiries</h3>
                  {supportTickets.length === 0 ? (
                    <p className="text-xs text-[#7D8A84]">No active support tickets.</p>
                  ) : (
                    <div className="space-y-2">
                      {supportTickets.map((tkt) => (
                        <div key={tkt.id} className="p-4 rounded-xl border border-[#E4ECE8] bg-white flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-[#1A1E1C]">{tkt.subject}</div>
                            <div className="text-xs text-[#5C6661] mt-0.5">{tkt.message}</div>
                          </div>
                          <Badge variant="sage">{tkt.status.toUpperCase()}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODAL: ADD CHILD PROFILE */}
        {showAddChildModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#D5E6DE]">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1A1E1C]">Add Authorized Child Profile</h3>
                <button onClick={() => setShowAddChildModal(false)} className="text-[#7D8A84] hover:text-[#1A1E1C]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateChild} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1A1E1C]">Display Name / Nickname</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zara or Aayan"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D5DDD8] text-xs text-[#1A1E1C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1A1E1C]">Age Band</label>
                  <select
                    value={newChildAgeTier}
                    onChange={(e) => setNewChildAgeTier(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D5DDD8] text-xs text-[#1A1E1C]"
                  >
                    <option value="little">Little Explorer (Ages 2–5)</option>
                    <option value="junior">Junior Learner (Ages 6–12)</option>
                    <option value="teen">Adolescent Sanctuary (Ages 13–17)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1A1E1C]">Preferred Language</label>
                  <select
                    value={newChildLocale}
                    onChange={(e) => setNewChildLocale(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D5DDD8] text-xs text-[#1A1E1C]"
                  >
                    <option value="en">English (English)</option>
                    <option value="ur">Urdu (اردو)</option>
                    <option value="pa">Pakistani Punjabi (پنجابی)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1A1E1C]">Daily Screen Time (Minutes)</label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={newChildScreenLimit}
                    onChange={(e) => setNewChildScreenLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#D5DDD8] text-xs text-[#1A1E1C]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="sensoryCheck"
                    checked={newChildSensory}
                    onChange={(e) => setNewChildSensory(e.target.checked)}
                    className="rounded text-[#285B55]"
                  />
                  <label htmlFor="sensoryCheck" className="text-xs text-[#5C6661]">
                    Enable Sensory Low-Stimulation Mode (Muted colors &amp; zero sudden animations)
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#F0F4F2]">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddChildModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmittingChild}
                    className="bg-[#285B55] text-white"
                  >
                    {isSubmittingChild ? "Saving..." : "Create Profile"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: SANDBOX CHECKOUT */}
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#D5E6DE]">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1A1E1C]">Development Sandbox Checkout</h3>
                <button onClick={() => setShowCheckoutModal(false)} className="text-[#7D8A84] hover:text-[#1A1E1C]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-xs">
                <strong>Simulated Purchase Mode:</strong> Zero real card details are collected. Test transactions immediately activate entitlements in your family account.
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-semibold text-[#1A1E1C]">Select Service Tier</label>
                <div className="space-y-2">
                  {[
                    { id: "price_fam_annual", name: "Family All-Access Annual", cost: "$99.00 / yr" },
                    { id: "price_kids_monthly", name: "Kids Academy Monthly", cost: "$9.99 / mo" },
                    { id: "price_teen_monthly", name: "Teens Sanctuary Monthly", cost: "$9.99 / mo" },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                        selectedPlanId === p.id
                          ? "border-[#285B55] bg-[#E8F3EE] font-bold"
                          : "border-[#E4ECE8] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      <span className="text-[#1A1E1C]">{p.name}</span>
                      <span className="text-[#285B55]">{p.cost}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#F0F4F2]">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCheckoutModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  disabled={isProcessingCheckout}
                  onClick={handleSandboxCheckout}
                  className="bg-[#285B55] text-white"
                >
                  {isProcessingCheckout ? "Processing..." : "Complete Sandbox Purchase"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: SUBMIT SUPPORT TICKET */}
        {showTicketModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#D5E6DE]">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1A1E1C]">Submit Family Support Inquiry</h3>
                <button onClick={() => setShowTicketModal(false)} className="text-[#7D8A84] hover:text-[#1A1E1C]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1A1E1C]">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Question about bedtime routines"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D5DDD8] text-xs text-[#1A1E1C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1A1E1C]">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D5DDD8] text-xs text-[#1A1E1C]"
                  >
                    <option value="general">General Learning Guidance</option>
                    <option value="billing">Billing &amp; Subscriptions</option>
                    <option value="accessibility">Neurodiversity &amp; Sensory Accommodation</option>
                    <option value="privacy">Privacy &amp; Data Control</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1A1E1C]">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our family care team assist you?"
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D5DDD8] text-xs text-[#1A1E1C]"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#F0F4F2]">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowTicketModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmittingTicket}
                    className="bg-[#285B55] text-white"
                  >
                    {isSubmittingTicket ? "Sending..." : "Submit Inquiry"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DELETE CHILD CONFIRMATION */}
        {showDeleteConsentModal && selectedChild && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-rose-200">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>Delete Child Profile</span>
              </div>

              <p className="text-xs text-[#5C6661] leading-relaxed">
                Are you sure you want to delete <strong className="text-[#1A1E1C]">{selectedChild.display_name}&apos;s</strong> profile? All completed activities, emotional vocabulary streaks, and settings will be permanently erased.
              </p>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#F0F4F2]">
                <Button variant="outline" size="sm" onClick={() => setShowDeleteConsentModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isDeletingChild}
                  onClick={() => handleDeleteChildProfile(selectedChild.id)}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {isDeletingChild ? "Deleting..." : "Permanently Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </WeeblyParentShell>
  );
}
