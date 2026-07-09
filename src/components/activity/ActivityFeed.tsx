"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";
import {
  House,
  Rocket,
  Music,
  Camera,
  PencilLine,
  ArrowUpRight,
} from "lucide-react";
import type { ActivityEvent, ActivitySection } from "@/lib/activity";
import { activityText } from "@/lib/activity";

// One icon per section — the feed varies its glyph by what was touched.
const SECTION_ICON: Record<ActivitySection, React.ReactNode> = {
  home: <House size={16} />,
  work: <Rocket size={16} />,
  project: <Rocket size={16} />,
  onigiri: (
    <Image src="/onigiri-icon.svg" width={16} height={16} alt="Onigiri" loading="eager" />
  ),
  music: <Music size={16} />,
  photography: <Camera size={16} />,
  writing: <PencilLine size={16} />,
  outbound: <ArrowUpRight size={16} />,
};

function sectionIcon(section: ActivitySection): React.ReactNode {
  const icon = SECTION_ICON[section];
  // Branded (Image) icons render as-is; lucide glyphs get the muted treatment.
  if (section === "onigiri") return icon;
  return <span className="text-content-muted">{icon}</span>;
}

// --- date grouping (mirrors the onigiri LogFeed section labels) ---
function getSectionLabel(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((today.getTime() - target.getTime()) / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This week";

  const sameYear = date.getFullYear() === now.getFullYear();
  if (sameYear) return date.toLocaleDateString("en-US", { month: "long" });
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// --- `[label](href)` link parsing (same syntax as the logs) ---
type Segment = { type: "text"; content: string } | { type: "link"; content: string; href: string };

const LINK_CLASS =
  "underline underline-offset-[3px] decoration-muted hover:text-content-primary hover:decoration-content-primary";

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: "link", content: match[1], href: match[2] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }
  return segments;
}

function EntryText({ text }: { text: string }) {
  const segments = useMemo(() => parseSegments(text), [text]);
  const commaIndex = text.indexOf(",");
  let pos = 0;
  const primary: React.ReactNode[] = [];
  const tertiary: React.ReactNode[] = [];

  segments.forEach((seg, i) => {
    const start = pos;
    pos += seg.content.length;
    const isInternal = seg.type === "link" && seg.href.startsWith("/");
    const node =
      seg.type === "link" ? (
        <a
          key={i}
          href={seg.href}
          target={isInternal ? undefined : "_blank"}
          rel={isInternal ? undefined : "noopener noreferrer"}
          className={LINK_CLASS}
        >
          {seg.content}
        </a>
      ) : (
        seg.content
      );
    if (commaIndex === -1 || start < commaIndex) primary.push(node);
    else tertiary.push(node);
  });

  if (tertiary.length === 0) return <span className="text-content-primary">{primary}</span>;
  return (
    <>
      <span className="text-content-primary">{primary}</span>
      <span className="text-content-tertiary">{tertiary}</span>
    </>
  );
}

interface Row {
  kind: "header" | "entry";
  key: string;
  label?: string;
  hasGap?: boolean;
  event?: ActivityEvent;
}

export default function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  const rows = useMemo<Row[]>(() => {
    const out: Row[] = [];
    let lastSection = "";
    events.forEach((event, i) => {
      const label = getSectionLabel(event.ts);
      if (label !== lastSection) {
        out.push({ kind: "header", key: `h-${label}-${i}`, label, hasGap: lastSection !== "" });
        lastSection = label;
      }
      out.push({ kind: "entry", key: `e-${event.ts}-${i}`, event });
    });
    return out;
  }, [events]);

  if (events.length === 0) {
    return (
      <p className="text-body-regular text-content-tertiary">
        No activity yet. As people visit and tap around, it&apos;ll show up here.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {rows.map((row, i) => {
        if (row.kind === "header") {
          return (
            <motion.h3
              key={row.key}
              className={`text-h3 text-content-muted ${row.hasGap ? "mt-10" : ""} mb-4`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.6) }}
            >
              {row.label}
            </motion.h3>
          );
        }
        const event = row.event!;
        return (
          <motion.div
            key={row.key}
            className="flex items-center gap-3 mb-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.6) }}
          >
            <span className="flex-shrink-0">{sectionIcon(event.section)}</span>
            <p className="text-body-regular">
              <EntryText text={activityText(event)} />
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
