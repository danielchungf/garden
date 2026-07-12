import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import { Chat } from "@/components/chat/Chat";

export const metadata = {
  title: "Chat — Daniel Chung",
  description: "Ask anything about Daniel — his work, projects, and background.",
};

export default function ChatPage() {
  return (
    <main className="h-dvh max-w-[660px] mx-auto px-5 flex flex-col">
      <div className="shrink-0 pt-6">
        <Link href="/">
          <IconButton icon={ArrowLeft} />
        </Link>
      </div>

      <Chat />
    </main>
  );
}
