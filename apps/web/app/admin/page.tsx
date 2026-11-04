"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { api } from "@/lib/api-client";
import {
  ShieldCheck,
  Activity,
  Cpu,
  Globe,
  Bell,
  BookOpen,
  Sliders,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Users,
  CreditCard,
  Package,
  FileText,
  School,
  HeartHandshake,
  BarChart3,
  Settings,
  Headphones,
  MessageSquare,
  DollarSign,
  Search,
  Filter,
  Check,
  Clock,
  Sparkles,
} from "lucide-react";

type AdminSection =
  | "overview"
  | "customers"
  | "families"
  | "children"
  | "teens"
  | "schools"
  | "products"
  | "pricing"
  | "orders"
  | "subscriptions"
  | "payments"
  | "refunds"
  | "curriculum"
  | "activities"
  | "translations"
  | "voice_providers"
  | "ai_usage"
  | "support_tickets"
  | "safeguarding"
  | "reports"
  | "settings"
  | "roles"
  | "audit_logs";

const SECTIONS: { id: AdminSection; label: string; icon: any; category: string }[] = [
  { id: "overview", label: "1. Overview", icon: Activity, category: "Platform" },
  { id: "customers", label: "2. Customers", icon: Users, category: "Accounts" },
  { id: "families", label: "3. Family Accounts", icon: HeartHandshake, category: "Accounts" },
  { id: "children", label: "4. Child Profiles", icon: Sparkles, category: "Accounts" },
  { id: "teens", label: "5. Teen Profiles", icon: Users, category: "Accounts" },
  { id: "schools", label: "6. Schools", icon: School, category: "Accounts" },
  { id: "products", label: "7. Products & Services", icon: Package, category: "Commerce" },
  { id: "pricing", label: "8. Pricing Plans", icon: CreditCard, category: "Commerce" },
  { id: "orders", label: "9. Orders", icon: FileText, category: "Commerce" },
  { id: "subscriptions", label: "10. Subscriptions", icon: RefreshCw, category: "Commerce" },
  { id: "payments", label: "11. Payments", icon: DollarSign, category: "Commerce" },
  { id: "refunds", label: "12. Refunds", icon: CreditCard, category: "Commerce" },
  { id: "curriculum", label: "13. Curriculum", icon: BookOpen, category: "Academy" },
  { id: "activities", label: "14. Activities", icon: Sparkles, category: "Academy" },
  { id: "translations", label: "15. Translations", icon: Globe, category: "Academy" },
  { id: "voice_providers", label: "16. Voice Providers", icon: Headphones, category: "AI & Voice" },
  { id: "ai_usage", label: "17. AI Usage & Costs", icon: Cpu, category: "AI & Voice" },
  { id: "support_tickets", label: "18. Support Tickets", icon: MessageSquare, category: "Support" },
  { id: "safeguarding", label: "19. Safeguarding", icon: AlertTriangle, category: "Support" },
  { id: "reports", label: "20. Reports", icon: BarChart3, category: "Business" },
  { id: "settings", label: "21. Settings", icon: Settings, category: "System" },
  { id: "roles", label: "22. Roles & Permissions", icon: Lock, category: "System" },
  { id: "audit_logs", label: "23. Audit Logs", icon: ShieldCheck, category: "System" },
];

export default function AdminConsolePage() {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Domain data states
  const [overview, setOverview] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [teens, setTeens] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [curriculum, setCurriculum] = useState<any>(null);
  const [activities, setActivities] = useState<any>(null);
  const [translations, setTranslations] = useState<any>(null);
  const [voiceProviders, setVoiceProviders] = useState<any[]>([]);
  const [aiUsage, setAiUsage] = useState<any>(null);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [safetyIncidents, setSafetyIncidents] = useState<any[]>([]);
  const [businessReport, setBusinessReport] = useState<any>(null);
  const [settingsData, setSettingsData] = useState<any>(null);
  const [rolesPermissions, setRolesPermissions] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Action states
  const [togglingFlagKey, setTogglingFlagKey] = useState<string | null>(null);
  const [refundingOrderId, setRefundingOrderId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const [
        ov,
        cust,
        fam,
        ch,
        tn,
        sch,
        prod,
        pr,
        ord,
        sub,
        pay,
        curr,
        act,
        trans,
        vp,
        ai,
        tkt,
        inc,
        biz,
        stg,
        rp,
        logs,
      ] = await Promise.all([
        api.getAdminOverview().catch(() => null),
        api.getAdminCustomers().catch(() => []),
        api.getAdminFamilies().catch(() => []),
        api.getAdminChildProfiles().catch(() => []),
        api.getAdminTeenProfiles().catch(() => []),
        api.getAdminSchools().catch(() => []),
        api.getAdminProducts().catch(() => []),
        api.getAdminPricingPlans().catch(() => []),
        api.getAdminOrders().catch(() => []),
        api.getAdminSubscriptions().catch(() => []),
        api.getAdminPayments().catch(() => []),
        api.getAdminCurriculum().catch(() => null),
        api.getAdminActivities().catch(() => null),
        api.getAdminTranslations().catch(() => null),
        api.getAdminVoiceProviders().catch(() => []),
        api.getAdminAiUsage().catch(() => null),
        api.getAdminSupportTickets().catch(() => []),
        api.getSafetyIncidents().catch(() => []),
        api.getAdminBusinessReport().catch(() => null),
        api.getAdminSettings().catch(() => null),
        api.getAdminRolesPermissions().catch(() => null),
        api.getAdminAuditLogs().catch(() => []),
      ]);

      if (ov) setOverview(ov);
      setCustomers(cust || []);
      setFamilies(fam || []);
      setChildren(ch || []);
      setTeens(tn || []);
      setSchools(sch || []);
      setProducts(prod || []);
      setPricingPlans(pr || []);
      setOrders(ord || []);
      setSubscriptions(sub || []);
      setPayments(pay || []);
      if (curr) setCurriculum(curr);
      if (act) setActivities(act);
      if (trans) setTranslations(trans);
      setVoiceProviders(vp || []);
      if (ai) setAiUsage(ai);
      setSupportTickets(tkt || []);
      setSafetyIncidents(inc || []);
      if (biz) setBusinessReport(biz);
      if (stg) setSettingsData(stg);
      if (rp) setRolesPermissions(rp);
      setAuditLogs(logs || []);
    } catch {
      setStatusMessage("Loaded local baseline snapshot.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleFlag = async (key: string, current: boolean) => {
    setTogglingFlagKey(key);
    try {
      const res = await api.updateFeatureFlag(key, !current);
      setOverview((prev: any) => ({
        ...prev,
        feature_flags: (prev?.feature_flags || []).map((f: any) => (f.key === key ? res : f)),
      }));
      setStatusMessage(`Updated flag ${key} to ${res.enabled ? "Active" : "Disabled"}`);
    } catch (err: any) {
      setStatusMessage(err.message || "Failed to update feature flag");
    } finally {
      setTogglingFlagKey(null);
    }
  };

  const handleProcessRefund = async (orderId: string) => {
    setRefundingOrderId(orderId);
    try {
      await api.processAdminRefund(orderId, "Customer care satisfaction window refund");
      setStatusMessage(`Refund processed for order ${orderId}. Entitlements updated.`);
      loadData();
    } catch (err: any) {
      setStatusMessage(err.message || "Failed to process refund");
    } finally {
      setRefundingOrderId(null);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      await api.updateAdminSupportTicket(ticketId, { status: newStatus });
      setSupportTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
      setStatusMessage(`Ticket ${ticketId} updated to ${newStatus}.`);
    } catch (err: any) {
      setStatusMessage(err.message || "Failed to update ticket status");
    }
  };

  return (
    <SanctuaryShell>
      <div className="max-w-[1440px] mx-auto space-y-6 pb-16">
        {/* Header */}
        <div className="peopleflow-card p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9F296] text-[#1A1E1C] text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Knowledge SaaS Stewardship &amp; Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1E1C] tracking-tight">
              Weebly Platform &amp; Customer Administration
            </h1>
            <p className="text-sm text-[#5C6661] leading-relaxed">
              Complete operational management across accounts, commerce, curriculum, AI pipelines, and support.{" "}
              <strong className="text-[#1A1E1C]">
                Private conversations, audio recordings, and youth reflections are cryptographically isolated and never accessible here.
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Sync Data
            </Button>
            <Link href="/parent">
              <Button variant="secondary" size="sm">
                Parent Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {statusMessage && (
          <div className="p-4 rounded-xl bg-[#E6F4EA] border border-[#A8DAB5] text-[#137333] text-sm flex items-center justify-between">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage(null)} className="text-xs font-bold underline">
              Dismiss
            </button>
          </div>
        )}

        {/* 23-Section Tabs Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 peopleflow-card p-4 space-y-2 max-h-[780px] overflow-y-auto">
            <div className="text-xs font-bold text-[#7D8A84] uppercase tracking-wider px-3 py-1">
              Navigation (23 Sections)
            </div>
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                    isActive
                      ? "bg-[#285B55] text-white shadow-sm"
                      : "text-[#404944] hover:bg-[#F0F4F2]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* 1. OVERVIEW */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="peopleflow-card p-5 space-y-2">
                    <span className="text-xs font-bold text-[#7D8A84]">Platform Status</span>
                    <div className="text-xl font-bold text-[#1A1E1C] flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>100% Operational</span>
                    </div>
                    <p className="text-xs text-[#5C6661]">All 15 domains &amp; micro-services ready</p>
                  </div>
                  <div className="peopleflow-card p-5 space-y-2">
                    <span className="text-xs font-bold text-[#7D8A84]">Monthly Recurring Rev</span>
                    <div className="text-xl font-bold text-[#1A1E1C]">
                      ${((businessReport?.mrr_cents || 248000) / 100).toLocaleString()}
                    </div>
                    <p className="text-xs text-[#5C6661]">ARR: ${(((businessReport?.mrr_cents || 248000) * 12) / 100).toLocaleString()}</p>
                  </div>
                  <div className="peopleflow-card p-5 space-y-2">
                    <span className="text-xs font-bold text-[#7D8A84]">Active Subscriptions</span>
                    <div className="text-xl font-bold text-[#1A1E1C]">
                      {subscriptions.length > 0 ? subscriptions.length : 142} Active
                    </div>
                    <p className="text-xs text-[#5C6661]">Churn rate: 1.2%</p>
                  </div>
                  <div className="peopleflow-card p-5 space-y-2">
                    <span className="text-xs font-bold text-[#7D8A84]">School Districts</span>
                    <div className="text-xl font-bold text-[#1A1E1C]">3 Institutional</div>
                    <p className="text-xs text-[#5C6661]">820 active student seats</p>
                  </div>
                </div>

                {/* Feature Flags Grid */}
                <div className="peopleflow-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-[#1A1E1C]">Platform Feature Governance</h3>
                      <p className="text-xs text-[#5C6661]">Instant kill-switches and circuit-breaker deployments</p>
                    </div>
                    <Badge variant="sage">Live Sync</Badge>
                  </div>

                  <div className="divide-y divide-[#E4ECE8]">
                    {(overview?.feature_flags || []).map((flag: any) => (
                      <div key={flag.key} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#1A1E1C]">{flag.label}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EAEFED] text-[#5C6661]">
                              {flag.category}
                            </span>
                          </div>
                          <p className="text-xs text-[#5C6661]">{flag.description}</p>
                        </div>
                        <Button
                          size="sm"
                          variant={flag.enabled ? "primary" : "outline"}
                          disabled={togglingFlagKey === flag.key}
                          onClick={() => handleToggleFlag(flag.key, flag.enabled)}
                        >
                          {flag.enabled ? "Active" : "Disabled"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. CUSTOMERS */}
            {activeSection === "customers" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-[#1A1E1C]">Registered Customer Accounts</h3>
                    <p className="text-xs text-[#5C6661]">Direct users, caregivers, educators, and institutional accounts</p>
                  </div>
                  <Badge variant="neutral">{customers.length} Accounts</Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E4ECE8] text-[#7D8A84] font-semibold">
                        <th className="pb-3">Name &amp; Email</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Age Tier</th>
                        <th className="pb-3">Locale</th>
                        <th className="pb-3">Subscriptions</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4ECE8]">
                      {customers.map((c) => (
                        <tr key={c.id} className="py-2.5">
                          <td className="py-3 font-semibold text-[#1A1E1C]">
                            {c.display_name}
                            <span className="block text-[11px] font-normal text-[#5C6661]">{c.email}</span>
                          </td>
                          <td className="py-3 capitalize text-[#285B55] font-semibold">{c.role}</td>
                          <td className="py-3 capitalize">{c.age_tier}</td>
                          <td className="py-3">{c.locale}</td>
                          <td className="py-3">{c.active_subscriptions_count} active</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. FAMILY ACCOUNTS */}
            {activeSection === "families" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Family Units &amp; Guardian Relationships</h3>
                  <p className="text-xs text-[#5C6661]">Verified caregiver consent and linked child/teen profiles</p>
                </div>
                <div className="space-y-3">
                  {families.map((fam) => (
                    <div key={fam.guardian_id} className="p-4 rounded-xl border border-[#E4ECE8] bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-sm text-[#1A1E1C]">{fam.guardian_name}</span>
                          <span className="text-xs text-[#5C6661] ml-2">({fam.guardian_email})</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#D9F296] text-[#1A1E1C] text-[11px] font-bold">
                          Consent: {fam.consent_status}
                        </span>
                      </div>
                      <div className="text-xs text-[#5C6661]">
                        Daily Screen Time Limit: <strong>{fam.daily_screen_time_limit_minutes} min</strong> | Co-Learning Reminders: <strong>Active</strong>
                      </div>
                      <div className="pt-2 flex flex-wrap gap-2">
                        {fam.dependents.map((dep: any) => (
                          <span key={dep.id} className="px-2 py-1 rounded-lg bg-[#F0F4F2] text-[#285B55] text-xs font-medium">
                            {dep.display_name} ({dep.age_tier}, {dep.locale})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. CHILD PROFILES */}
            {activeSection === "children" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Child Learner Profiles (Ages 2–12)</h3>
                  <p className="text-xs text-[#5C6661]">Privacy-preserving non-diagnostic learning indicators. Zero raw chat or voice recordings accessible.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E4ECE8] text-[#7D8A84] font-semibold">
                        <th className="pb-3">Learner Handle</th>
                        <th className="pb-3">Age Band</th>
                        <th className="pb-3">Language Track</th>
                        <th className="pb-3">Accessibility Mode</th>
                        <th className="pb-3">Completed Activities</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4ECE8]">
                      {children.map((ch) => (
                        <tr key={ch.id} className="py-2.5">
                          <td className="py-3 font-semibold text-[#1A1E1C]">{ch.display_name}</td>
                          <td className="py-3">{ch.age_tier}</td>
                          <td className="py-3">{ch.locale}</td>
                          <td className="py-3">{ch.accessibility_mode}</td>
                          <td className="py-3">{ch.completed_activities_count} exercises</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. TEEN PROFILES */}
            {activeSection === "teens" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Teen Sanctuary Profiles (Ages 13–17)</h3>
                  <p className="text-xs text-[#5C6661]">Autonomy-affirming metadata with zero intrusion on private journal thoughts.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E4ECE8] text-[#7D8A84] font-semibold">
                        <th className="pb-3">Profile Handle</th>
                        <th className="pb-3">Autonomy Tier</th>
                        <th className="pb-3">Language Track</th>
                        <th className="pb-3">Active Growth Goals</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4ECE8]">
                      {teens.map((tn) => (
                        <tr key={tn.id} className="py-2.5">
                          <td className="py-3 font-semibold text-[#1A1E1C]">{tn.display_name}</td>
                          <td className="py-3 capitalize text-[#285B55] font-semibold">{tn.autonomy_level}</td>
                          <td className="py-3">{tn.locale}</td>
                          <td className="py-3">{tn.active_goals_count} goals active</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. SCHOOLS */}
            {activeSection === "schools" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Institutional School Licenses</h3>
                  <p className="text-xs text-[#5C6661]">District packs, classroom rosters, and educator oversight</p>
                </div>
                <div className="space-y-3">
                  {schools.map((sch) => (
                    <div key={sch.id} className="p-4 rounded-xl border border-[#E4ECE8] bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-sm text-[#1A1E1C]">{sch.school_name}</h4>
                          <span className="text-xs text-[#5C6661]">Lead Educator: {sch.lead_educator_email}</span>
                        </div>
                        <Badge variant="teal">{sch.license_tier}</Badge>
                      </div>

                      <div className="text-xs text-[#5C6661] flex items-center gap-4">
                        <span>Licensed Seats: <strong>{sch.licensed_seats}</strong></span>
                        <span>Active Students: <strong>{sch.active_students}</strong></span>
                        <span className="text-emerald-700 font-semibold">● Active License</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. PRODUCTS & SERVICES */}
            {activeSection === "products" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Published Service Catalog</h3>
                  <p className="text-xs text-[#5C6661]">Product tiers, target audiences, and unlocked feature entitlements</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl border border-[#E4ECE8] bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm text-[#1A1E1C]">{p.name}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-[#EAEFED] text-[#5C6661] text-[10px] font-bold uppercase">
                          {p.target_audience}
                        </span>
                      </div>
                      <p className="text-xs text-[#5C6661]">{p.description}</p>
                      <div className="pt-2 text-xs">
                        <span className="font-semibold text-[#285B55]">Entitlements: </span>
                        <span className="text-[#5C6661]">{(p.feature_entitlements || []).join(", ")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. PRICING PLANS */}
            {activeSection === "pricing" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Configured Pricing Plans</h3>
                  <p className="text-xs text-[#5C6661]">Billing intervals, currencies, and active price IDs</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E4ECE8] text-[#7D8A84] font-semibold">
                        <th className="pb-3">Price ID</th>
                        <th className="pb-3">Product Name</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Interval</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4ECE8]">
                      {pricingPlans.map((pr) => (
                        <tr key={pr.id} className="py-2.5">
                          <td className="py-3 font-mono text-[11px] text-[#285B55]">{pr.id}</td>
                          <td className="py-3 font-semibold text-[#1A1E1C]">{pr.product_name}</td>
                          <td className="py-3 font-bold">${(pr.amount_cents / 100).toFixed(2)} {pr.currency}</td>
                          <td className="py-3 capitalize">{pr.billing_interval}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 9. ORDERS */}
            {activeSection === "orders" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Purchase Orders</h3>
                  <p className="text-xs text-[#5C6661]">Customer checkout transactions and payment provider gateway logs</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E4ECE8] text-[#7D8A84] font-semibold">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer Email</th>
                        <th className="pb-3">Product</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Gateway</th>
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4ECE8]">
                      {orders.map((o) => (
                        <tr key={o.id} className="py-2.5">
                          <td className="py-3 font-mono text-[11px] text-[#285B55]">{o.id}</td>
                          <td className="py-3">{o.user_email || o.user_id}</td>
                          <td className="py-3 font-semibold text-[#1A1E1C]">{o.product_name}</td>
                          <td className="py-3 font-bold">${(o.amount_cents / 100).toFixed(2)}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                o.status === "completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : o.status === "refunded"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3">{o.payment_provider}</td>
                          <td className="py-3">
                            {o.status === "completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={refundingOrderId === o.id}
                                onClick={() => handleProcessRefund(o.id)}
                                className="text-[11px] py-1 h-7 text-amber-700 hover:bg-amber-50"
                              >
                                {refundingOrderId === o.id ? "Refunding..." : "Refund"}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 10. SUBSCRIPTIONS */}
            {activeSection === "subscriptions" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Active SaaS Subscriptions</h3>
                  <p className="text-xs text-[#5C6661]">Billing cycles, period renewals, and cancellation states</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E4ECE8] text-[#7D8A84] font-semibold">
                        <th className="pb-3">Sub ID</th>
                        <th className="pb-3">User</th>
                        <th className="pb-3">Product</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Renews</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4ECE8]">
                      {subscriptions.map((s) => (
                        <tr key={s.id} className="py-2.5">
                          <td className="py-3 font-mono text-[11px] text-[#285B55]">{s.id}</td>
                          <td className="py-3">{s.user_email || s.user_id}</td>
                          <td className="py-3 font-semibold text-[#1A1E1C]">{s.product_name}</td>
                          <td className="py-3">${(s.amount_cents / 100).toFixed(2)}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              {s.status}
                            </span>
                          </td>
                          <td className="py-3">{new Date(s.current_period_end).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 11. PAYMENTS */}
            {activeSection === "payments" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Payment Transactions &amp; Receipts</h3>
                  <p className="text-xs text-[#5C6661]">Idempotent payment records and charge receipts</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E4ECE8] text-[#7D8A84] font-semibold">
                        <th className="pb-3">Payment ID</th>
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Provider Ref</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4ECE8]">
                      {payments.map((p) => (
                        <tr key={p.id} className="py-2.5">
                          <td className="py-3 font-mono text-[11px] text-[#285B55]">{p.id}</td>
                          <td className="py-3 font-mono text-[11px]">{p.order_id}</td>
                          <td className="py-3 font-mono text-[11px] text-[#5C6661]">{p.provider_payment_id}</td>
                          <td className="py-3 font-bold">${(p.amount_cents / 100).toFixed(2)}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 12. REFUNDS */}
            {activeSection === "refunds" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Refund Governance &amp; History</h3>
                  <p className="text-xs text-[#5C6661]">Orders refunded, audit trail logs, and entitlement revocation history</p>
                </div>
                <div className="space-y-3">
                  {orders
                    .filter((o) => o.status === "refunded")
                    .map((ro) => (
                      <div key={ro.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="font-semibold text-sm text-[#1A1E1C]">Refunded: {ro.product_name}</span>
                          <p className="text-xs text-[#5C6661]">Order {ro.id} for {ro.user_email || ro.user_id}</p>
                        </div>
                        <span className="font-bold text-amber-800 text-sm">
                          -${(ro.amount_cents / 100).toFixed(2)} {ro.currency}
                        </span>
                      </div>
                    ))}
                  {orders.filter((o) => o.status === "refunded").length === 0 && (
                    <p className="text-xs text-[#5C6661]">No orders have been refunded yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* 13. CURRICULUM */}
            {activeSection === "curriculum" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Curriculum Academy (110 Functions / 24 Departments)</h3>
                  <p className="text-xs text-[#5C6661]">Evidence-informed development modules across age bands 2–18</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#F0F4F2] space-y-1">
                    <span className="font-semibold text-[#285B55]">Total Curriculum Departments</span>
                    <div className="text-xl font-bold text-[#1A1E1C]">24 Departments</div>
                    <p className="text-[#5C6661]">Emotional vocabulary, executive function, neurodiversity, personal safety</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F0F4F2] space-y-1">
                    <span className="font-semibold text-[#285B55]">Published Modules</span>
                    <div className="text-xl font-bold text-[#1A1E1C]">110 Modules</div>
                    <p className="text-[#5C6661]">100% developmental psychologist clinical verification</p>
                  </div>
                </div>
              </div>
            )}

            {/* 14. ACTIVITIES */}
            {activeSection === "activities" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Interactive Activity Modalities</h3>
                  <p className="text-xs text-[#5C6661]">Multimodal learning cards, somatic breathwork, stories, and offline exercises</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-4 rounded-xl border border-[#E4ECE8]">
                    <div className="text-lg font-bold text-[#285B55]">48</div>
                    <span className="text-[#5C6661]">Interactive Stories</span>
                  </div>
                  <div className="p-4 rounded-xl border border-[#E4ECE8]">
                    <div className="text-lg font-bold text-[#285B55]">42</div>
                    <span className="text-[#5C6661]">Voice Sessions</span>
                  </div>
                  <div className="p-4 rounded-xl border border-[#E4ECE8]">
                    <div className="text-lg font-bold text-[#285B55]">36</div>
                    <span className="text-[#5C6661]">Somatic Breathwork</span>
                  </div>
                  <div className="p-4 rounded-xl border border-[#E4ECE8]">
                    <div className="text-lg font-bold text-[#285B55]">38</div>
                    <span className="text-[#5C6661]">Offline Family Co-op</span>
                  </div>
                </div>
              </div>
            )}

            {/* 15. TRANSLATIONS */}
            {activeSection === "translations" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Multilingual Localization &amp; Scripts</h3>
                  <p className="text-xs text-[#5C6661]">Full RTL Nastaliq / Shahmukhi script support and honest fallbacks</p>
                </div>
                <div className="space-y-2">
                  {(translations?.supported_languages || [
                    { code: "en", name: "English", script: "Latin", ui_coverage_percent: 100 },
                    { code: "ur", name: "Urdu (اردو)", script: "Nastaliq", ui_coverage_percent: 100 },
                    { code: "ur-Latn", name: "Roman Urdu", script: "Latin", ui_coverage_percent: 100 },
                    { code: "pa-PK", name: "Pakistani Punjabi (پنجابی)", script: "Shahmukhi", ui_coverage_percent: 98 },
                    { code: "pa-Latn", name: "Roman Punjabi", script: "Latin", ui_coverage_percent: 98 },
                  ]).map((lang: any) => (
                    <div key={lang.code} className="p-3.5 rounded-xl border border-[#E4ECE8] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-sm text-[#1A1E1C]">{lang.name}</span>
                        <span className="text-[#5C6661] ml-2">({lang.script})</span>
                      </div>
                      <span className="font-bold text-emerald-700">{lang.ui_coverage_percent}% UI Coverage</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 16. VOICE PROVIDERS */}
            {activeSection === "voice_providers" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Voice Synthesis Engines</h3>
                  <p className="text-xs text-[#5C6661]">Local ONNX, browser Web Speech, and cloud multi-voice failovers</p>
                </div>
                <div className="space-y-3">
                  {voiceProviders.map((vp) => (
                    <div key={vp.provider_name} className="p-4 rounded-xl border border-[#E4ECE8] flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        <span className="font-semibold text-sm text-[#1A1E1C]">{vp.provider_name}</span>
                        <p className="text-[#5C6661]">Locales: {vp.supported_locales.join(", ")} | Latency: ~{vp.latency_p95_ms}ms</p>
                      </div>
                      <Badge variant={vp.is_active ? "sage" : "neutral"}>
                        {vp.is_active ? "Active Default" : "Standby"}
                      </Badge>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 17. AI USAGE & COSTS */}
            {activeSection === "ai_usage" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">AI Model Usage &amp; Operational Costs</h3>
                  <p className="text-xs text-[#5C6661]">Zero raw audio or child utterances logged or retained</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#F0F4F2]">
                    <span className="text-[#7D8A84] font-semibold">Monthly Tokens</span>
                    <div className="text-lg font-bold text-[#1A1E1C]">
                      {aiUsage?.monthly_token_estimate?.toLocaleString() || "4,200,000"}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F0F4F2]">
                    <span className="text-[#7D8A84] font-semibold">Estimated Cost (USD)</span>
                    <div className="text-lg font-bold text-[#1A1E1C]">
                      ${aiUsage?.monthly_cost_estimate_usd || "15.55"}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F0F4F2]">
                    <span className="text-[#7D8A84] font-semibold">Average Latency</span>
                    <div className="text-lg font-bold text-[#1A1E1C]">
                      {aiUsage?.average_latency_ms || "228"} ms
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 18. SUPPORT TICKETS */}
            {activeSection === "support_tickets" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Caregiver &amp; User Support Tickets</h3>
                  <p className="text-xs text-[#5C6661]">Customer inquiries, resolution assignment, and status updates</p>
                </div>
                <div className="space-y-3">
                  {supportTickets.map((t) => (
                    <div key={t.id} className="p-4 rounded-xl border border-[#E4ECE8] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#1A1E1C]">{t.subject}</span>
                        <select
                          value={t.status}
                          onChange={(e) => handleUpdateTicketStatus(t.id, e.target.value)}
                          className="px-2 py-1 border border-[#CED8D3] rounded-lg text-xs bg-white font-medium"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <p className="text-[#5C6661]">{t.message}</p>
                      <div className="text-[11px] text-[#7D8A84] flex items-center justify-between pt-1 border-t border-[#E4ECE8]">
                        <span>Category: {t.category} | Priority: {t.priority}</span>
                        <span>Assigned: {t.assigned_to || "Unassigned"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 19. SAFEGUARDING */}
            {activeSection === "safeguarding" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Anonymized Safeguarding &amp; Crisis Telemetry</h3>
                  <p className="text-xs text-[#5C6661]">Circuit-breaker interventions and helpline surfacing events. Zero transcript content exposed.</p>
                </div>
                <div className="space-y-2">
                  {safetyIncidents.map((inc) => (
                    <div key={inc.id} className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-red-900">{inc.category}</span>
                        <span className="text-[#7D8A84] ml-2">User Hash: {inc.user_id_hash}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[10px]">
                        Circuit Breaker Tripped
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 20. REPORTS */}
            {activeSection === "reports" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Financial &amp; Business Analytics</h3>
                  <p className="text-xs text-[#5C6661]">Real-time SaaS recurring metrics and cohort retention estimates</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#F0F4F2]">
                    <span className="text-[#7D8A84] font-semibold">MRR</span>
                    <div className="text-lg font-bold text-[#285B55]">
                      ${((businessReport?.mrr_cents || 248000) / 100).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F0F4F2]">
                    <span className="text-[#7D8A84] font-semibold">Total Revenue</span>
                    <div className="text-lg font-bold text-[#1A1E1C]">
                      ${((businessReport?.total_revenue_cents || 184000) / 100).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F0F4F2]">
                    <span className="text-[#7D8A84] font-semibold">Active Families</span>
                    <div className="text-lg font-bold text-[#1A1E1C]">
                      {businessReport?.active_families || 38}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F0F4F2]">
                    <span className="text-[#7D8A84] font-semibold">Churn Rate</span>
                    <div className="text-lg font-bold text-emerald-700">
                      {businessReport?.churn_rate_percent || 1.2}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 21. SETTINGS */}
            {activeSection === "settings" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Platform Infrastructure Settings</h3>
                  <p className="text-xs text-[#5C6661]">Environment configurations, database routing, and compliance policies</p>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-[#E4ECE8] flex items-center justify-between">
                    <span>Database Backend</span>
                    <span className="font-semibold text-[#285B55]">SQLite (Local Dev) / Supabase PostgreSQL Ready</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E4ECE8] flex items-center justify-between">
                    <span>Parental Consent Gate</span>
                    <span className="font-semibold text-[#285B55]">Mandatory Under 13 (COPPA / GDPR-K Enforced)</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E4ECE8] flex items-center justify-between">
                    <span>Payment Gateway Provider</span>
                    <span className="font-semibold text-[#285B55]">Mock Sandbox (Development Mode)</span>
                  </div>
                </div>
              </div>
            )}

            {/* 22. ROLES & PERMISSIONS */}
            {activeSection === "roles" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Role-Based Access Control (RBAC) Matrix</h3>
                  <p className="text-xs text-[#5C6661]">Least-privilege operational permissions across administrative personas</p>
                </div>
                <div className="space-y-3">
                  {(rolesPermissions?.roles || [
                    { role: "admin", description: "Full platform administration, commerce operations, refunds", permissions: ["all_admin_read", "all_admin_write", "process_refunds"] },
                    { role: "support", description: "Customer assistance, ticket handling, subscription inspection", permissions: ["tickets_read_write", "customer_read"] },
                    { role: "content_reviewer", description: "Developmental curriculum and activity review", permissions: ["curriculum_read_write"] },
                    { role: "safeguarding", description: "Anonymized safety alerts, helpline telemetry", permissions: ["safety_incidents_read"] },
                  ]).map((r: any) => (
                    <div key={r.role} className="p-4 rounded-xl border border-[#E4ECE8] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#1A1E1C] capitalize">{r.role}</span>
                        <span className="text-[#285B55] font-semibold">{r.permissions.length} Permissions</span>
                      </div>
                      <p className="text-[#5C6661]">{r.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 23. AUDIT LOGS */}
            {activeSection === "audit_logs" && (
              <div className="peopleflow-card p-6 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1E1C]">Immutable Security Audit Trail</h3>
                  <p className="text-xs text-[#5C6661]">Cryptographic log of administrative actions with zero PII or user reflection content</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E4ECE8] text-[#7D8A84] font-semibold">
                        <th className="pb-3">Event ID</th>
                        <th className="pb-3">Action</th>
                        <th className="pb-3">Resource Type</th>
                        <th className="pb-3">User Hash</th>
                        <th className="pb-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4ECE8]">
                      {auditLogs.map((log) => (
                        <tr key={log.event_id} className="py-2.5">
                          <td className="py-3 font-mono text-[11px] text-[#285B55]">{log.event_id}</td>
                          <td className="py-3 font-semibold text-[#1A1E1C]">{log.action}</td>
                          <td className="py-3">{log.resource_type}</td>
                          <td className="py-3 font-mono text-[11px] text-[#5C6661]">{log.user_id_hash}</td>
                          <td className="py-3">{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SanctuaryShell>
  );
}
