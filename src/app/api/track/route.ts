import { appendEvent } from "@/lib/activity-store";
import type { ActivityEvent, ActivitySection, ActivityType } from "@/lib/activity";

// Run on the Node serverless runtime (where Netlify injects x-nf-geo).
export const runtime = "nodejs";
// Never cache — every hit is a fresh event.
export const dynamic = "force-dynamic";

const SECTIONS: ActivitySection[] = [
  "home",
  "work",
  "project",
  "onigiri",
  "music",
  "photography",
  "writing",
  "chat",
  "outbound",
];
const TYPES: ActivityType[] = ["view", "click"];

interface NetlifyGeo {
  city?: string;
  country?: { code?: string; name?: string };
  subdivision?: { code?: string; name?: string };
}

function readGeo(req: Request): NetlifyGeo | null {
  const raw = req.headers.get("x-nf-geo");
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function isBot(req: Request): boolean {
  const ua = req.headers.get("user-agent")?.toLowerCase() ?? "";
  return /bot|crawl|spider|preview|facebookexternalhit|slurp|bingpreview|headless/.test(ua);
}

export async function POST(req: Request) {
  if (isBot(req)) return new Response(null, { status: 204 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("bad json", { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const section = b.section as ActivitySection;
  const type = b.type as ActivityType;
  const label = typeof b.label === "string" ? b.label.slice(0, 80) : "";
  const href = typeof b.href === "string" ? b.href.slice(0, 300) : "";

  if (!SECTIONS.includes(section) || !TYPES.includes(type) || !label) {
    return new Response("bad request", { status: 400 });
  }

  const geo = readGeo(req);
  const event: ActivityEvent = {
    ts: Date.now(),
    type,
    section,
    label,
    href,
    city: geo?.city || undefined,
    region: geo?.subdivision?.name || undefined,
    country: geo?.country?.name || undefined,
  };

  try {
    await appendEvent(event);
  } catch {
    // Storage unavailable — swallow so tracking never breaks the page.
  }

  return new Response(null, { status: 204 });
}
