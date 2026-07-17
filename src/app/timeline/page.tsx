import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import TimelineTrack from "@/components/TimelineTrack";
import { getTimelineEvents } from "@/lib/timeline";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline — Daniel Chung",
  description: "A lifeline of moments, left to right — from born to now.",
};

export default function TimelinePage() {
  const events = getTimelineEvents();

  return (
    <main className="flex min-h-screen flex-col py-[60px] md:py-[80px]">
      <div className="mx-auto w-full max-w-[660px] px-5">
        <Link href="/">
          <IconButton icon={ArrowLeft} />
        </Link>

        <div className="mt-[60px]">
          <h1 className="text-hero text-content-primary">Timeline</h1>
          <p className="mt-3 text-body-regular text-content-tertiary">
            A lifeline of moments, read left to right — from born to now. Scroll
            sideways to move through the years.
          </p>
        </div>
      </div>

      <div className="mt-[60px]">
        {events.length === 0 ? (
          <p className="mx-auto max-w-[660px] px-5 text-body-regular text-content-tertiary">
            No moments yet.
          </p>
        ) : (
          <TimelineTrack events={events} />
        )}
      </div>
    </main>
  );
}
