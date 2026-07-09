import "server-only";
import { getStore } from "@netlify/blobs";
import type { ActivityEvent } from "./activity";

const STORE_NAME = "activity";
const EVENTS_KEY = "events";
// Keep the feed bounded — newest N events only.
const MAX_EVENTS = 500;

function store() {
  // Strong consistency so a freshly tracked event shows up on the next read.
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export async function readEvents(): Promise<ActivityEvent[]> {
  try {
    const events = await store().get(EVENTS_KEY, { type: "json" });
    return Array.isArray(events) ? (events as ActivityEvent[]) : [];
  } catch {
    // Not running on Netlify (e.g. local `next dev` without netlify) — degrade gracefully.
    return [];
  }
}

export async function appendEvent(event: ActivityEvent): Promise<void> {
  const s = store();
  const existing = await readEvents();
  // Prepend newest; cap length. Low-traffic personal site, so a rare
  // concurrent-write race dropping one event is an acceptable tradeoff.
  const next = [event, ...existing].slice(0, MAX_EVENTS);
  await s.setJSON(EVENTS_KEY, next);
}
