import fs from "fs";
import path from "path";
import type { MonthlyMusic } from "@/types/music";

const MUSIC_DIR = path.join(process.cwd(), "content", "music");

export function getAllMusic(): MonthlyMusic[] {
  if (!fs.existsSync(MUSIC_DIR)) return [];

  const files = fs
    .readdirSync(MUSIC_DIR)
    .filter((f) => f.endsWith(".json"));

  const months = files.map((file) => {
    const raw = fs.readFileSync(path.join(MUSIC_DIR, file), "utf-8");
    return JSON.parse(raw) as MonthlyMusic;
  });

  // Sort newest first
  months.sort((a, b) => b.month.localeCompare(a.month));

  return months;
}
