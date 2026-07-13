import "server-only";
import { getStore } from "@netlify/blobs";

const STORE_NAME = "chat-ratelimit";

// Per-IP: 20 messages per 10 minutes. Global: hard daily cap as a cost backstop.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const MAX_GLOBAL_PER_DAY = 400;

function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export type RateLimitResult = { ok: true } | { ok: false; reason: "ip" | "global" };

/**
 * Sliding-window limit per IP plus a global daily counter.
 * Fails open when Blobs is unavailable (local dev) so the chat still works.
 * Read-then-write races are acceptable for a low-traffic personal site.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  try {
    const s = store();
    const now = Date.now();

    const day = new Date(now).toISOString().slice(0, 10);
    const globalKey = `global:${day}`;
    const globalCount = ((await s.get(globalKey, { type: "json" })) as number) ?? 0;
    if (globalCount >= MAX_GLOBAL_PER_DAY) return { ok: false, reason: "global" };

    const ipKey = `ip:${ip}`;
    const raw = (await s.get(ipKey, { type: "json" })) as number[] | null;
    const recent = (Array.isArray(raw) ? raw : []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) return { ok: false, reason: "ip" };

    await s.setJSON(ipKey, [...recent, now]);
    await s.setJSON(globalKey, globalCount + 1);
    return { ok: true };
  } catch {
    return { ok: true };
  }
}
