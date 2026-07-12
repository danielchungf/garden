import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import { readChatSessions } from "@/lib/chat-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Chats — Daniel Chung",
  robots: { index: false, follow: false },
};

function formatWhen(ts: number): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatLocation(s: { city?: string; region?: string; country?: string }) {
  return [s.city, s.region, s.country].filter(Boolean).join(", ") || "Unknown location";
}

export default async function ChatsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const adminKey = process.env.CHAT_ADMIN_KEY;
  if (!adminKey || key !== adminKey) notFound();

  const sessions = await readChatSessions();

  return (
    <main className="max-w-[660px] mx-auto px-5 py-[60px]">
      <Link href="/">
        <IconButton icon={ArrowLeft} />
      </Link>

      <div className="mt-[60px] flex items-baseline justify-between">
        <h1 className="text-hero text-content-primary">Chats</h1>
        <p className="text-body-small text-content-muted">
          {sessions.length} session{sessions.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {sessions.length === 0 && (
          <p className="text-body-regular text-content-tertiary">
            No conversations yet.
          </p>
        )}
        {sessions.map((s) => (
          <section key={s.id} className="flex flex-col gap-3">
            <header className="flex items-baseline justify-between gap-4">
              <p className="text-body-small text-content-secondary">
                {formatLocation(s)}
              </p>
              <p className="text-body-small text-content-muted whitespace-nowrap">
                {formatWhen(s.updatedAt)}
              </p>
            </header>
            <div className="flex flex-col gap-2 border-l-2 border-neutral-150 pl-4">
              {s.messages.map((m, i) =>
                m.role === "user" ? (
                  <p
                    key={i}
                    className="text-body-regular text-content-primary whitespace-pre-wrap"
                  >
                    {m.content}
                  </p>
                ) : (
                  <p
                    key={i}
                    className="text-body-regular text-content-muted whitespace-pre-wrap"
                  >
                    {m.content}
                  </p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
