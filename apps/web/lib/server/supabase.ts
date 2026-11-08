/**
 * Minimal Supabase REST helper (no extra npm dependency).
 *
 * Uses SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY
 * (or SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY) on the server only.
 * If not configured, returns null so callers can keep working with their
 * in-memory fallback and mark responses `persisted: false`.
 */

function getConfig(): { url: string; key: string } | null {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  if (!url || !key) return null;
  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  return getConfig() !== null;
}

export async function sbSelect<T = Record<string, unknown>>(
  table: string,
  query = "select=*&order=created_at.desc&limit=50"
): Promise<T[] | null> {
  const cfg = getConfig();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.url}/rest/v1/${table}?${query}`, {
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T[];
  } catch {
    return null;
  }
}

export async function sbInsert<T = Record<string, unknown>>(
  table: string,
  row: T | Record<string, unknown>
): Promise<T | null> {
  const cfg = getConfig();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as T[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}
