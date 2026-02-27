import { getAllLogs } from "@/lib/logs";
import Image from "next/image";
import LogFeed from "@/components/LogFeed";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/IconButton";

export const metadata = {
  title: "Onigiri — Daniel Chung",
  description: "My personal OS in Markdown. A feed of what I'm doing.",
};

export default function LogsPage() {
  const days = getAllLogs();

  return (
    <main className="max-w-[660px] mx-auto px-5 py-[60px] md:py-[80px]">
      <Link href="/">
        <IconButton icon={ArrowLeft} />
      </Link>

      <div id="project-info" className="mt-[60px]">
        <Image
          src="/onigiri-logo.avif"
          alt="Onigiri"
          width={44}
          height={44}
          className="mb-6"
        />
        <h1 className="text-hero text-content-primary">Onigiri</h1>

        <div className="mt-3 space-y-4">
          <p className="text-body-regular text-content-tertiary">
            This is my personal OS, built entirely in markdown, called Onigiri. I use Claude Code to run local agents that help me throughout my day: tracking goals, Slack messages, journal entries, people, meeting notes, Git contributions, daily work digests, all of it. Here&apos;s a snippet of what gets logged.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <LogFeed days={days} />
      </div>
    </main>
  );
}
