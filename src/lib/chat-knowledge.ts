import "server-only";
import fs from "fs";
import path from "path";
import type { ReactNode, ReactElement } from "react";
import { getAllProjects } from "@/data/projects";
import { getAllLogs } from "@/lib/logs";

// How many recent daily logs to include as "what Daniel's been up to lately".
const RECENT_LOG_DAYS = 14;

/** Flatten a ReactNode (project section bodies contain inline JSX links) to plain text. */
function nodeToText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (typeof node === "object" && "props" in node) {
    return nodeToText((node as ReactElement<{ children?: ReactNode }>).props.children);
  }
  return "";
}

function projectsSection(): string {
  return getAllProjects()
    .map((p) => {
      const team = p.team
        .map((m) => (m.url ? `${m.name} (${m.url})` : m.name))
        .join(", ");
      const sections = (p.sections ?? [])
        .map((s) => `### ${s.title}\n${nodeToText(s.body)}`)
        .join("\n\n");
      return [
        `## ${p.title}: ${p.tagline} (${p.duration})`,
        p.url ? `Website: ${p.url}` : "",
        `Team: ${team}`,
        p.description.join("\n\n"),
        sections,
      ]
        .filter(Boolean)
        .join("\n\n");
    })
    .join("\n\n");
}

function readContent(...segments: string[]): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), "content", ...segments), "utf-8");
  } catch {
    return "";
  }
}

function recentLogsSection(): string {
  const days = getAllLogs().slice(0, RECENT_LOG_DAYS);
  if (days.length === 0) return "";
  return days
    .map((d) => `${d.date}:\n${d.entries.map((e) => `- ${e.text}`).join("\n")}`)
    .join("\n\n");
}

const BIO = `
Daniel Chung is a product designer, currently Product Designer in Residence at Valdivia Works
(https://www.gabrielvaldivia.com), the studio run by Gabriel Valdivia. Before design he spent
seven-plus years in communications, branding, and marketing: valedictorian in Communication at the
University of Lima, communication campaigns at Credicorp, digital strategy at KO Lab in Lima, and a
content-creator run with 230,000+ followers and 50M+ views. He moved into product design in 2024 and
now partners with early-stage teams to build software that transforms how we live, guided by quality,
empathy, and curiosity. His communications background is an edge, not a detour: he thinks about brand,
story, and audience the way a marketer and a designer both would.

Right now he is the Designer in Residence for two products at the same time: Dex, a language-learning
camera for kids, and Twinsi, an AI fitness companion. Designer in Residence means he is the embedded
design lead on a product, owning its direction end to end.

Contact: email danielchungfung@gmail.com, Twitter/X @itsdanielchung
(https://x.com/itsdanielchung).

## Work
All of Daniel's client work is done alongside Gabriel Valdivia
(https://www.gabrielvaldivia.com/), a widely respected and influential product
designer. Valdivia Works is simply Gabriel's studio; Gabriel IS Valdivia Works, so
the credit goes to Gabriel the person, never the studio. Whenever any of these
projects come up, Daniel says something like "I worked on it alongside Gabriel
Valdivia" and links to https://www.gabrielvaldivia.com/. Lead with Gabriel; only
mention Valdivia Works as supporting context, if at all:
- Dex, The Language Learning Camera (current, Daniel is Designer in Residence; detailed case study below)
- Twinsi, an AI fitness companion (current, Daniel is Designer in Residence)
- Supper, AI Data Agent for high-growth companies (detailed case study below)
- Workmate, "Everyone's Executive Assistant" (https://www.workmate.com/)
- Sensible, a high-yield account product; the team was acquired by Coinbase
- Ritual Dental, a client project with Gabriel

## Side projects
Currently building. When asked what side projects he's working on right now, these five are the answer: Piper, Casita, Mettle, Bites, Kion.
- Piper, Ultimate Travel Planner (https://www.piper.travel/)
- Casita, a shared household OS he and his partner actually run their home on
- Mettle, a social fitness RPG (iOS, on TestFlight)
- Bites, "Stickerfy Your Food" (iOS, on TestFlight)
- Kion, The Family Cookbook (https://www.kion.recipes/)
Already shipped, part of daily life:
- SipSip, a coffee tracker he shipped in early 2025 and uses daily (https://sipsip.coffee)
- Onigiri, his personal OS in markdown (described below; lives at /onigiri on this site)
- His blog, a writing section on this site
Earlier, still real but not active:
- Torii, Your Pocket Travel Guide
- Waffle, The Visual Organization App; the first big thing he built, no longer active (https://heywaffle.app/)

## Tools he uses
Figma, Claude / Claude Code, Conductor, Xcode, Mobbin, Supabase.

## This website
danielchung's portfolio ("garden"). Pages: home (/), project case studies (/dex,
/supper), /onigiri (personal OS: daily logs + about), /photography (his photos, shot on
Fujifilm), /music (monthly Spotify top tracks), /lexicon (an engineering glossary he
writes as he learns), and /chat (this conversation).
`.trim();

let cached: string | null = null;

/** Everything the chat agent knows about Daniel, compiled once per server instance. */
export function getKnowledge(): string {
  if (cached) return cached;
  cached = [
    // Daniel's hand-written context doc is the primary source — edit
    // content/chat/context.md to change what the chat knows and how it behaves.
    readContent("chat", "context.md"),
    "# About Daniel Chung (site-derived)",
    BIO,
    "# Case studies",
    projectsSection(),
    "# Onigiri: Daniel's personal OS (from the site's about doc)",
    readContent("about", "onigiri.md"),
    `# Daniel's recent activity (auto-generated daily logs, newest first)`,
    recentLogsSection(),
  ]
    .filter(Boolean)
    .join("\n\n---\n\n");
  return cached;
}
