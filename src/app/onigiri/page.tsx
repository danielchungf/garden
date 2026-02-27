import { getAllLogs } from "@/lib/logs";
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

      <h1 className="text-h1 text-content-primary mt-[60px] mb-2">Onigiri</h1>
      <p className="text-body-regular text-content-tertiary mb-10">
        This is my personal OS, built entirely in markdown, called Onigiri. I use Claude Code to run local agents that help me throughout my day: tracking goals, Slack messages, journal entries, people, meeting notes, Git contributions, daily work digests, all of it. Here&apos;s a snippet of what gets logged.
      </p>

      <LogFeed days={days} />
    </main>
  );
}
