import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import ActivityFeed from "@/components/activity/ActivityFeed";
import { readEvents } from "@/lib/activity-store";

// Always render fresh so the feed reflects the latest visits.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Activity — Daniel Chung",
  description: "A live feed of who's visiting and what they're tapping on.",
};

export default async function ActivityPage() {
  const events = await readEvents();

  return (
    <main className="max-w-[660px] mx-auto px-5 py-[60px] md:py-[80px]">
      <Link href="/">
        <IconButton icon={ArrowLeft} />
      </Link>

      <div className="mt-[60px]">
        <h1 className="text-hero text-content-primary">Activity</h1>
        <p className="mt-3 text-body-regular text-content-tertiary">
          A live, roughly-located feed of who&apos;s stopping by and what they tap
          on. Locations are approximate (based on network, not precise), and no
          personal data is stored.
        </p>
      </div>

      <div className="mt-10">
        <ActivityFeed events={events} />
      </div>
    </main>
  );
}
