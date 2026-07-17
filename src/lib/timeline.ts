import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { DatePrecision, TimelineEvent } from "@/types/timeline";

const TIMELINE_DIR = path.join(process.cwd(), "content", "timeline");

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDisplayDate(date: string, precision: DatePrecision): string {
  const [year, month, day] = date.split("-").map((n) => parseInt(n, 10));
  const monthName = MONTHS[month - 1] ?? "";
  if (precision === "month") return `${monthName} ${year}`;
  return `${monthName} ${day}, ${year}`;
}

function parseEventFile(filename: string): TimelineEvent | null {
  const slug = filename.replace(/\.md$/, "");
  const filePath = path.join(TIMELINE_DIR, filename);
  const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));

  const date =
    typeof data.date === "string"
      ? data.date
      : data.date
        ? new Date(data.date).toISOString().split("T")[0]
        : undefined;

  if (!date || !data.title) {
    console.warn(`Timeline event "${filename}" is missing a date or title.`);
    return null;
  }

  const precision: DatePrecision = data.precision === "month" ? "month" : "day";
  const note = content.trim();

  return {
    slug,
    date,
    precision,
    title: data.title,
    displayDate: formatDisplayDate(date, precision),
    photos: Array.isArray(data.photos) ? data.photos : [],
    note: note.length > 0 ? note : undefined,
  };
}

/** All life events, sorted oldest → newest (left = born, right = now). */
export function getTimelineEvents(): TimelineEvent[] {
  if (!fs.existsSync(TIMELINE_DIR)) return [];

  return fs
    .readdirSync(TIMELINE_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parseEventFile)
    .filter((e): e is TimelineEvent => e !== null)
    .sort((a, b) => a.date.localeCompare(b.date));
}
