import { getAllLogs } from "@/lib/logs";
import { getAbout } from "@/lib/about";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import OnigiriTabs from "@/components/OnigiriTabs";

export const metadata = {
  title: "Onigiri — Daniel Chung",
  description: "My personal OS in Markdown. A feed of what I'm doing.",
};

export default async function OnigiriPage() {
  const days = getAllLogs();
  const aboutHtml = await getAbout();

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
            Onigiri is my personal OS, built entirely in markdown. Everything lives in plain text files, organized in folders, tracked with git, and currently managed by Claude Code.
          </p>
          <p className="text-body-regular text-content-tertiary">
            It&apos;s a system that captures my context so the agent can answer any question accurately. Goals, people, work, project ideas, meetings, messages, tasks. Claude reads the system, connects all the dots, and keeps deepening its understanding of my psyche with each new addition.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <OnigiriTabs days={days} aboutHtml={aboutHtml} />
      </div>
    </main>
  );
}
