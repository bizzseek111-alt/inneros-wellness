/**
 * InnerOS Privacy-Respecting Marketing Analytics Architecture
 *
 * Principles:
 * 1. Zero third-party advertising trackers or cross-site cookies.
 * 2. Never logs personal reflections, chat inputs, or emotional check-in values.
 * 3. Honors browser Do Not Track (DNT) and Global Privacy Control (GPC).
 * 4. Stores only aggregate, anonymous navigation & CTA interaction events locally
 *    unless the user explicitly opts into anonymous product telemetry.
 */

export type MarketingEventName =
  | "marketing_page_view"
  | "cta_start_journey_click"
  | "cta_try_demo_click"
  | "cta_explore_features_click"
  | "cta_open_app_click"
  | "interactive_demo_mode_switch"
  | "interactive_orb_state_change"
  | "language_switched"
  | "contact_form_submitted";

export interface MarketingAnalyticsEvent {
  id: string;
  event: MarketingEventName;
  path: string;
  locale: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

const STORAGE_KEY = "inneros_anonymous_marketing_events";
const CONSENT_KEY = "inneros_marketing_telemetry_enabled";

export function isTelemetryAllowed(): boolean {
  if (typeof window === "undefined") return false;
  // Respect Do Not Track & Global Privacy Control
  const nav = window.navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.doNotTrack === "1" || nav.globalPrivacyControl === true) {
    return false;
  }
  const stored = window.localStorage.getItem(CONSENT_KEY);
  // Default to privacy-safe local-only mode unless opted out
  return stored !== "false";
}

export function setTelemetryPreference(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, String(enabled));
  if (!enabled) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function trackMarketingEvent(
  event: MarketingEventName,
  metadata?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  if (!isTelemetryAllowed()) return;

  try {
    const entry: MarketingAnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      event,
      path: window.location.pathname,
      locale: document.documentElement.lang || "en",
      metadata,
      timestamp: new Date().toISOString(),
    };

    const existingRaw = window.localStorage.getItem(STORAGE_KEY);
    const list: MarketingAnalyticsEvent[] = existingRaw
      ? JSON.parse(existingRaw)
      : [];
    const updated = [entry, ...list].slice(0, 50);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Fail silently if storage is restricted
  }
}
