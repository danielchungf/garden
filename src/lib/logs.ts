import fs from "fs";
import path from "path";

const LOGS_DIR = path.join(process.cwd(), "content", "logs");

export interface LogEntry {
  text: string;
}

export interface LogDay {
  date: string;
  entries: LogEntry[];
}

export function getAllLogs(): LogDay[] {
  if (!fs.existsSync(LOGS_DIR)) return [];

  const files = fs
    .readdirSync(LOGS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();

  return files
    .map((filename) => {
      const date = filename.replace(/\.md$/, "");
      const content = fs.readFileSync(path.join(LOGS_DIR, filename), "utf-8");

      const entries = content
        .split("\n")
        .filter((line) => line.startsWith("—") || line.startsWith("— "))
        .map((line) => ({
          text: line.replace(/^—\s*/, ""),
        }));

      if (entries.length === 0) return null;
      return { date, entries };
    })
    .filter((day): day is LogDay => day !== null);
}
