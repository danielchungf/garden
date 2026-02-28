"use client";

import { useState } from "react";
import type { MonthlyMusic } from "@/types/music";

function formatMonthLabel(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(parseInt(year), parseInt(m) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function MusicList({ months }: { months: MonthlyMusic[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (months.length === 0) {
    return (
      <p className="text-body-regular text-content-tertiary">
        No music data yet.
      </p>
    );
  }

  const current = months[selectedIndex];

  return (
    <div>
      {months.length > 1 && (
        <div className="flex gap-2 mb-8 flex-wrap">
          {months.map((m, i) => (
            <button
              key={m.month}
              onClick={() => setSelectedIndex(i)}
              className={`px-3 py-1.5 rounded-full text-h3 transition-colors ${
                i === selectedIndex
                  ? "bg-neutral-800 text-white"
                  : "bg-neutral-100 text-content-secondary hover:bg-neutral-150"
              }`}
            >
              {formatMonthLabel(m.month)}
            </button>
          ))}
        </div>
      )}

      {months.length === 1 && (
        <p className="text-h3 text-content-muted mb-6">
          {formatMonthLabel(current.month)}
        </p>
      )}

      <div className="flex flex-col">
        {current.tracks.map((track) => (
          <a
            key={track.rank}
            href={track.spotify_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <span className="w-5 text-h3 text-content-muted tabular-nums shrink-0">
              {String(track.rank).padStart(2, "0")}
            </span>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={track.album_art.medium || track.album_art.large || track.album_art.small}
              alt={track.album}
              width={40}
              height={40}
              className="rounded shrink-0"
            />

            <div className="min-w-0 flex-1">
              <p className="text-h3 text-content-primary truncate">
                {track.name}
              </p>
              <p className="text-body-small text-content-tertiary truncate">
                {track.artists.join(", ")}
              </p>
            </div>

          </a>
        ))}
      </div>
    </div>
  );
}
