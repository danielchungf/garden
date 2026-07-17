export type DatePrecision = "day" | "month";

export interface TimelineEvent {
  slug: string;
  /** ISO date (YYYY-MM-DD) used for sorting; the day is ignored when precision is "month". */
  date: string;
  precision: DatePrecision;
  title: string;
  /** Preformatted, human-readable date respecting precision (e.g. "May 28, 1996" or "July 2023"). */
  displayDate: string;
  /** Root-relative image paths under /public (e.g. "/timeline/wedding.webp"). */
  photos: string[];
  /** Optional longer note from the markdown body. */
  note?: string;
}
