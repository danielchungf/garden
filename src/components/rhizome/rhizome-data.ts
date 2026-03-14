import type { SimulationNodeDatum, SimulationLinkDatum } from "d3-force";

// --- Types ---

export interface RhizomeNode extends SimulationNodeDatum {
  id: string;
  group: string;
  label: string;
}

export interface RhizomeLink extends SimulationLinkDatum<RhizomeNode> {
  source: string | RhizomeNode;
  target: string | RhizomeNode;
}

// --- Categories ---
//
// Informed by Deleuze & Guattari's rhizome principles.
// These aren't hierarchies — they're hues of intensity.

export const CATEGORIES: Record<string, string> = {
  reflective: "#2B9E7A",
  temporal: "#7B73D6",
  intake: "#C4912B",
  relational: "#D47050",
  generative: "#4A8FCC",
  somatic: "#D16A8F",
  meta: "#8C8C8C",
};

// --- Nodes ---

export const nodes: RhizomeNode[] = [
  // reflective — self-understanding, direction, memory
  { id: "journal", group: "reflective", label: "journal" },
  { id: "goals", group: "reflective", label: "goals" },
  { id: "growth", group: "reflective", label: "growth" },
  { id: "logs", group: "reflective", label: "logs" },
  { id: "monologue", group: "reflective", label: "monologue" },
  { id: "identity", group: "reflective", label: "identity" },

  // temporal — rhythm, cadence
  { id: "journal/daily", group: "temporal", label: "daily" },
  { id: "journal/weekly", group: "temporal", label: "weekly" },
  { id: "journal/monthly", group: "temporal", label: "monthly" },

  // intake — raw capture, information in
  { id: "work/digests", group: "intake", label: "digests" },
  { id: "work/briefings", group: "intake", label: "briefings" },
  { id: "inbox", group: "intake", label: "inbox" },

  // relational — people, encounters
  { id: "people", group: "relational", label: "people" },
  { id: "people/work", group: "relational", label: "work" },
  { id: "people/personal", group: "relational", label: "personal" },
  { id: "work/meetings", group: "relational", label: "meetings" },

  // generative — building, output, lines of flight
  { id: "work", group: "generative", label: "work" },
  { id: "work/clients", group: "generative", label: "clients" },
  { id: "work/tasks", group: "generative", label: "tasks" },
  { id: "projects", group: "generative", label: "projects" },
  { id: "resources", group: "generative", label: "resources" },
  { id: "scripts", group: "generative", label: "scripts" },

  // somatic — body, senses, routine
  { id: "health", group: "somatic", label: "health" },
  { id: "routines", group: "somatic", label: "routines" },
  { id: "music", group: "somatic", label: "music" },

  // meta — the plateau, not the root
  { id: "CLAUDE.md", group: "meta", label: "CLAUDE.md" },
];

// --- Links ---
//
// These are rhizomatic connections — heterogeneous, non-hierarchical.
// A meeting note links to a client, which links to a person, which shows up
// in a journal entry alongside what you cooked that night.
// Any point connects to any other.

const rawLinks: [string, string][] = [
  // --- Inbox: raw capture flows everywhere ---
  ["inbox", "work/tasks"],
  ["inbox", "work/briefings"],
  ["inbox", "journal/daily"],
  ["inbox", "people"],
  ["inbox", "projects"], // raw ideas become project plans
  ["inbox", "monologue"], // quick thoughts connect to thinking out loud

  // --- Work cluster ---
  ["work", "work/clients"],
  ["work", "work/digests"],
  ["work", "work/meetings"],
  ["work", "work/briefings"],
  ["work", "work/tasks"],
  ["work/briefings", "work/meetings"],
  ["work/briefings", "CLAUDE.md"],
  ["work/digests", "journal/weekly"],
  ["work/digests", "growth"],
  ["work/meetings", "people/work"],
  ["work/meetings", "journal/weekly"],
  ["work/meetings", "journal/daily"], // meetings show up in daily journal
  ["work/tasks", "projects"],
  ["work/tasks", "goals"],
  ["work/clients", "projects"],
  ["work/clients", "people/work"],
  ["work/clients", "journal/daily"], // client work referenced in journal
  ["work/clients", "logs"], // logs document client work shipped

  // --- Journal: the connective tissue ---
  // "A daily journal entry might reference a meeting, a recipe you cooked,
  //  a Slack message, and how you felt about a design crit."
  ["journal", "journal/daily"],
  ["journal", "journal/weekly"],
  ["journal", "journal/monthly"],
  ["journal/daily", "work/tasks"],
  ["journal/daily", "routines"], // daily routine feeds journal
  ["journal/daily", "logs"],
  ["journal/daily", "monologue"],
  ["journal/daily", "people"], // journal entries reference people
  ["journal/daily", "health"], // cooking, exercise, how you felt
  ["journal/daily", "music"], // what you're listening to
  ["journal", "identity"],
  ["journal", "growth"],
  ["journal", "health"],
  ["journal/weekly", "goals"],
  ["journal/weekly", "journal/monthly"],
  ["journal/monthly", "goals"],

  // --- People: heterogeneous connections ---
  // "A person file for Gabe touches design feedback, career growth,
  //  emotional patterns, and client work — all in one node."
  ["people", "people/work"],
  ["people", "people/personal"],
  ["people", "work/clients"], // people connect to client work directly
  ["people/work", "projects"],
  ["people/work", "work"],
  ["people/work", "growth"], // mentor relationships drive growth
  ["people/personal", "identity"],
  ["people/personal", "music"],

  // --- Goals, growth, identity: the reflective web ---
  ["goals", "growth"],
  ["goals", "projects"],
  ["goals", "identity"], // goals reflect who you want to become
  ["goals", "health"], // health is a life pillar
  ["growth", "identity"],
  ["growth", "resources"],
  ["growth", "health"],

  // --- Body, senses, routine ---
  ["health", "identity"],
  ["health", "routines"],
  ["routines", "logs"],

  // --- Projects: lines of flight ---
  // "Every side project is a line of flight. They break away from client work
  //  and create new connections. Building SipSip teaches you code, which changes
  //  how you work with engineers on Dex, which changes your career trajectory."
  ["projects", "work"],
  ["projects", "scripts"],
  ["projects", "resources"],
  ["projects", "goals"],
  ["projects", "growth"], // building teaches you — lines of flight feed back
  ["projects", "logs"], // logs document what you shipped

  // --- Logs: the public trace ---
  ["logs", "health"],
  ["logs", "music"], // logs include what you listened to
  ["logs", "resources"], // logs reference eng lexicon additions

  // --- Meta: CLAUDE.md as plateau ---
  // "CLAUDE.md is not a root — it's a plateau. A self-sustaining region
  //  of intensity that the whole system vibrates through."
  ["scripts", "CLAUDE.md"],
  ["resources", "CLAUDE.md"],
  ["CLAUDE.md", "work/briefings"],

  // --- Monologue: thinking out loud ---
  ["monologue", "journal"],
  ["monologue", "identity"],
  ["monologue", "growth"], // monologue explores growth edges
  ["monologue", "projects"], // brainstorming about what to build

  // --- Cross-category (heterogeneity) ---
  ["identity", "music"],
  ["music", "people/personal"],
  ["resources", "projects"],
  ["work", "scripts"],
];

export const links: RhizomeLink[] = rawLinks.map(([s, t]) => ({
  source: s,
  target: t,
}));
