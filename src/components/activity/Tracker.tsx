"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { ActivitySection, ActivityType } from "@/lib/activity";

// Top-level paths that are their own section; anything else under "/" is a project.
const PATH_SECTION: Record<string, { section: ActivitySection; label: string }> = {
  "": { section: "home", label: "Home" },
  onigiri: { section: "onigiri", label: "Onigiri" },
  music: { section: "music", label: "Music" },
  photography: { section: "photography", label: "Photography" },
  writing: { section: "writing", label: "Writing" },
};
// Paths we never track (avoid noise / self-referential loops).
const IGNORED = new Set(["activity", "api"]);

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function pageViewFor(pathname: string): { section: ActivitySection; label: string; href: string } | null {
  const clean = pathname.replace(/\/+$/, "");
  const parts = clean.split("/").filter(Boolean);
  const top = parts[0] ?? "";

  if (IGNORED.has(top)) return null;
  if (top in PATH_SECTION) {
    return { ...PATH_SECTION[top], href: clean || "/" };
  }
  // e.g. /supper, /dex, or /writing/some-post handled above — treat as a project page.
  return { section: "project", label: titleCase(parts[parts.length - 1] ?? top), href: clean };
}

function send(payload: {
  type: ActivityType;
  section: ActivitySection;
  label: string;
  href: string;
}) {
  const body = JSON.stringify(payload);
  // Beacon survives page navigation (crucial for outbound-link clicks).
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
  } else {
    fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
  }
}

export default function Tracker() {
  const pathname = usePathname();

  // Page views.
  useEffect(() => {
    const view = pageViewFor(pathname);
    if (view) send({ type: "view", ...view });
  }, [pathname]);

  // Tagged clicks (elements with data-track-section).
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>("[data-track-section]");
      if (!el) return;
      const section = el.dataset.trackSection as ActivitySection | undefined;
      const label = el.dataset.trackLabel;
      if (!section || !label) return;
      send({
        type: "click",
        section,
        label,
        href: el.dataset.trackHref ?? "",
      });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
