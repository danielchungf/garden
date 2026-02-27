"use client";

import { motion, LayoutGroup } from "framer-motion";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type { LogDay } from "@/lib/logs";

const ANIMATE_COUNT = 5;
const TYPEWRITER_SPEED = 20;
const STAGGER_DELAY = 0.08;
const STAGGER_DURATION = 0.35;
const PAUSE_BETWEEN = 600;

function getSectionLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This week";

  const sameYear = date.getFullYear() === now.getFullYear();
  const lastMonth =
    (sameYear && date.getMonth() === now.getMonth() - 1) ||
    (date.getFullYear() === now.getFullYear() - 1 &&
      now.getMonth() === 0 &&
      date.getMonth() === 11);

  if (lastMonth) return "Last month";

  if (sameYear) {
    return date.toLocaleDateString("en-US", { month: "long" });
  }
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function EntryText({ text }: { text: string }) {
  const commaIndex = text.indexOf(",");
  if (commaIndex === -1) {
    return <span className="text-content-primary">{text}</span>;
  }
  return (
    <>
      <span className="text-content-primary">{text.slice(0, commaIndex)}</span>
      <span className="text-content-tertiary">{text.slice(commaIndex)}</span>
    </>
  );
}

function TypewriterText({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) {
  const [charCount, setCharCount] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const isComplete = charCount >= text.length;

  useEffect(() => {
    if (charCount < text.length) {
      const timer = setTimeout(
        () => setCharCount((c) => c + 1),
        TYPEWRITER_SPEED
      );
      return () => clearTimeout(timer);
    } else {
      onCompleteRef.current?.();
    }
  }, [charCount, text.length]);

  return (
    <>
      <EntryText text={text.slice(0, charCount)} />
      {!isComplete && (
        <motion.span
          className="text-content-muted"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        >
          |
        </motion.span>
      )}
    </>
  );
}

interface FlatEntry {
  text: string;
  sectionLabel: string;
}

function flattenDays(days: LogDay[]): FlatEntry[] {
  return days.flatMap((day) => {
    const label = getSectionLabel(day.date);
    return day.entries.map((entry) => ({
      text: entry.text,
      sectionLabel: label,
    }));
  });
}

type RenderItem =
  | { type: "header"; label: string; key: string; hasGap: boolean; isNew: boolean; staggerDelay: number }
  | { type: "entry"; text: string; key: string; isNew: boolean; isTyping: boolean; staggerDelay: number };

export default function LogFeed({ days }: { days: LogDay[] }) {
  const allEntries = useMemo(() => flattenDays(days), [days]);
  const animateCount = Math.min(ANIMATE_COUNT, allEntries.length);

  const [revealedCount, setRevealedCount] = useState(0);
  const [typingDone, setTypingDone] = useState(true);

  // Count initial (non-animated) render items for stagger timing
  const initialItemCount = useMemo(() => {
    const initialEntries = allEntries.slice(animateCount);
    let count = 0;
    let lastSection = "";
    for (const entry of initialEntries) {
      if (entry.sectionLabel !== lastSection) {
        count++;
        lastSection = entry.sectionLabel;
      }
      count++;
    }
    return count;
  }, [allEntries, animateCount]);

  const staggerFinishMs =
    Math.max(0, initialItemCount - 1) * STAGGER_DELAY * 1000 +
    STAGGER_DURATION * 1000 +
    200;

  useEffect(() => {
    if (revealedCount < animateCount && typingDone) {
      const delay = revealedCount === 0 ? staggerFinishMs : PAUSE_BETWEEN;
      const timer = setTimeout(() => {
        setRevealedCount((c) => c + 1);
        setTypingDone(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [revealedCount, animateCount, typingDone, staggerFinishMs]);

  const handleTypingComplete = useCallback(() => {
    setTypingDone(true);
  }, []);

  const visibleFrom = animateCount - revealedCount;
  const visibleEntries = allEntries.slice(visibleFrom);

  const items: RenderItem[] = [];
  let lastSection = "";
  let initialIdx = 0;

  visibleEntries.forEach((entry, i) => {
    const globalIdx = visibleFrom + i;
    const isNew = globalIdx < animateCount;
    const isTyping = i === 0 && !typingDone && isNew && revealedCount > 0;

    if (entry.sectionLabel !== lastSection) {
      const staggerDelay = isNew ? 0 : initialIdx * STAGGER_DELAY;
      if (!isNew) initialIdx++;
      items.push({
        type: "header",
        label: entry.sectionLabel,
        key: `h-${entry.sectionLabel}`,
        hasGap: lastSection !== "",
        isNew,
        staggerDelay,
      });
      lastSection = entry.sectionLabel;
    }

    const staggerDelay = isNew ? 0 : initialIdx * STAGGER_DELAY;
    if (!isNew) initialIdx++;
    items.push({
      type: "entry",
      text: entry.text,
      key: `e-${globalIdx}`,
      isNew,
      isTyping,
      staggerDelay,
    });
  });

  return (
    <LayoutGroup>
      <div className="flex flex-col">
        {items.map((item) => {
          if (item.type === "header") {
            return (
              <motion.h3
                key={item.key}
                layout="position"
                className={`text-h3 text-content-muted ${item.hasGap ? "mt-10" : ""} mb-4`}
                initial={{ opacity: 0, y: item.isNew ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  opacity: { duration: 0.4, delay: item.isNew ? 0 : item.staggerDelay },
                  y: { duration: STAGGER_DURATION, delay: item.staggerDelay },
                  layout: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
                }}
              >
                {item.label}
              </motion.h3>
            );
          }

          return (
            <motion.p
              key={item.key}
              layout="position"
              className="text-body-regular mb-1"
              initial={{ opacity: 0, y: item.isNew ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                opacity: { duration: 0.4, delay: item.isNew ? 0 : item.staggerDelay },
                y: { duration: STAGGER_DURATION, delay: item.staggerDelay },
                layout: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
              }}
            >
              {item.isTyping ? (
                <TypewriterText
                  text={item.text}
                  onComplete={handleTypingComplete}
                />
              ) : (
                <EntryText text={item.text} />
              )}
            </motion.p>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
