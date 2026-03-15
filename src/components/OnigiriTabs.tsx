"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LogFeed from "@/components/LogFeed";
import dynamic from "next/dynamic";
import type { LogDay } from "@/lib/logs";

const RhizomeGraph = dynamic(
  () => import("@/components/rhizome/RhizomeGraph"),
  {
    ssr: false,
    loading: () => (
      <div className="mt-6 h-[500px] flex items-center justify-center">
        <p className="text-body-small text-content-muted">Loading...</p>
      </div>
    ),
  }
);

interface OnigiriTabsProps {
  days: LogDay[];
  aboutHtml: string | null;
}

export default function OnigiriTabs({ days, aboutHtml }: OnigiriTabsProps) {
  return (
    <Tabs defaultValue="about">
      <TabsList className="bg-neutral-100 gap-0.5">
        <TabsTrigger value="about" className="text-content-tertiary data-[state=active]:bg-white data-[state=active]:text-neutral-800">About</TabsTrigger>
        <TabsTrigger value="log" className="text-content-tertiary data-[state=active]:bg-white data-[state=active]:text-neutral-800">Feed</TabsTrigger>
        <TabsTrigger value="rhizome" className="text-content-tertiary data-[state=active]:bg-white data-[state=active]:text-neutral-800">Rhizome</TabsTrigger>
      </TabsList>

      <TabsContent value="about">
        {aboutHtml ? (
          <div
            className="prose mt-6"
            dangerouslySetInnerHTML={{ __html: aboutHtml }}
          />
        ) : (
          <p className="text-body-regular text-content-tertiary mt-6">
            No about content yet.
          </p>
        )}
      </TabsContent>

      <TabsContent value="log">
        <div className="mt-6 space-y-4">
          <h2 className="text-h2 text-content-primary">Feed</h2>
          <p className="text-body-regular text-content-tertiary">
            This is a live feed from Onigiri. A record of what is being built, how it changes, what I&apos;m doing. Each entry comes after a file is created or updated.
          </p>
        </div>
        <div className="mt-10">
          <LogFeed days={days} />
        </div>
      </TabsContent>

      <TabsContent value="rhizome">
        <div className="w-screen relative left-1/2 -translate-x-1/2">
          <RhizomeGraph />
        </div>
      </TabsContent>
    </Tabs>
  );
}
