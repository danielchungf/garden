// Shared types + section config for the /activity feed.
// Pure module (no server-only imports) so it is safe on the client too.

export type ActivitySection =
  | "home"
  | "work"
  | "project"
  | "onigiri"
  | "music"
  | "photography"
  | "writing"
  | "outbound";

export type ActivityType = "view" | "click";

export interface ActivityEvent {
  /** epoch milliseconds */
  ts: number;
  type: ActivityType;
  section: ActivitySection;
  /** human label, e.g. "Supper", "Music" */
  label: string;
  /** destination, e.g. "/supper" — used to build the feed link */
  href: string;
  /** rough, IP-derived location from Netlify's edge */
  city?: string;
  region?: string;
  country?: string;
}

/** Per-section verb used to phrase the feed row. */
export const SECTION_VERB: Record<ActivitySection, { view: string; click: string }> = {
  home: { view: "landed on", click: "landed on" },
  work: { view: "viewed", click: "opened" },
  project: { view: "viewed", click: "opened" },
  onigiri: { view: "explored", click: "opened" },
  music: { view: "browsed", click: "tapped" },
  photography: { view: "browsed", click: "tapped" },
  writing: { view: "read", click: "opened" },
  outbound: { view: "followed", click: "followed" },
};

/** Turn a location into a short "from X" phrase. */
export function locationPhrase(e: Pick<ActivityEvent, "city" | "region" | "country">): string {
  if (e.city) return `from ${e.city}`;
  if (e.region) return `from ${e.region}`;
  if (e.country) return `from ${e.country}`;
  return "";
}

/**
 * Build the feed sentence for an event, using the same
 * `[label](href)` link syntax as the onigiri logs.
 */
export function activityText(e: ActivityEvent): string {
  const where = locationPhrase(e);
  const who = where ? `Someone ${where}` : "Someone";
  const verb = SECTION_VERB[e.section][e.type];
  return `${who} ${verb} [${e.label}](${e.href})`;
}
