"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Tell me about yourself",
  "What are you working on right now?",
  "What guides your craft?",
  "How did you get into design?",
];

const MAX_MESSAGE_CHARS = 1000;

type Segment = { type: "text" | "link"; text: string; href?: string };

/** Split markdown links [label](href) — plus bare URLs as a fallback — out of plain text. */
function segment(text: string): Segment[] {
  const segs: Segment[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s()]+[^\s().,!?])/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) segs.push({ type: "text", text: text.slice(last, m.index) });
    if (m[1]) segs.push({ type: "link", text: m[1], href: m[2] });
    else segs.push({ type: "link", text: m[3], href: m[3] });
    last = m.index + m[0].length;
  }
  if (last < text.length) segs.push({ type: "text", text: text.slice(last) });
  return segs;
}

/** Hide a partially-streamed markdown link so raw [label](http… syntax never flashes. */
function trimPartialLink(text: string): string {
  return text.replace(/\[[^\]]*(?:\]\([^)\s]*)?$/, "");
}

function MessageContent({ text, streaming }: { text: string; streaming: boolean }) {
  const segs = segment(streaming ? trimPartialLink(text) : text);
  return (
    <>
      {segs.map((s, i) =>
        s.type === "link" ? (
          <a
            key={i}
            href={s.href}
            {...(s.href!.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={
              "underline underline-offset-2 decoration-neutral-300 hover:decoration-current transition-colors" +
              (streaming ? " chat-word" : "")
            }
          >
            {s.text}
          </a>
        ) : streaming ? (
          s.text
            .split(/(\s+)/)
            .map((word, j) =>
              /\s/.test(word) || !word ? (
                word
              ) : (
                <span key={`${i}-${j}`} className="chat-word">
                  {word}
                </span>
              ),
            )
        ) : (
          s.text
        ),
      )}
    </>
  );
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef(0);
  const sessionIdRef = useRef("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  async function send(text: string) {
    const trimmed = text.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!trimmed || loading) return;

    const history = [...messages, { role: "user" as const, content: trimmed }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    const setLast = (content: string) =>
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content };
        return next;
      });

    // Network chunks arrive in bursts, which makes text jump. Buffer them and
    // reveal at a steady time-based rate, speeding up as the backlog grows so
    // we never lag far behind the stream.
    const target = { text: "", done: false };
    let shown = 0;
    let prevTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - prevTime) / 1000, 0.1);
      prevTime = now;
      if (shown < target.text.length) {
        const backlog = target.text.length - shown;
        const speed = Math.max(70, backlog * 4); // chars per second
        shown = Math.min(target.text.length, shown + speed * dt);
        setLast(target.text.slice(0, Math.floor(shown)));
      }
      if (!target.done || shown < target.text.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setLoading(false);
        inputRef.current?.focus();
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    const finish = (text?: string) => {
      if (text !== undefined) target.text = text;
      target.done = true;
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Keep the request bounded — the API only accepts short conversations.
        body: JSON.stringify({
          messages: history.slice(-19),
          sessionId: (sessionIdRef.current ||= crypto.randomUUID()),
        }),
      });

      if (!res.ok || !res.body) {
        finish(
          res.status === 429
            ? await res.text()
            : "Something went wrong — try again in a moment.",
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        target.text += decoder.decode(value, { stream: true });
      }
      finish(target.text || "Hmm, I came up empty — try rephrasing?");
    } catch {
      finish("Something went wrong — try again in a moment.");
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="chat-scroll-fade flex-1 min-h-0 overflow-y-auto pt-14 pb-6 flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex gap-3">
            <Image
              src="/image-portfolio.jpg"
              alt="Daniel Chung"
              width={96}
              height={96}
              className="rounded-full object-cover w-7 h-7 shrink-0 mt-0.5"
            />
            <p className="text-body-regular text-content-primary">
              Hey! What do you want to know?
            </p>
          </div>
          {messages.length === 0 && (
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="self-start px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-150 border border-neutral-150 text-body-regular text-content-secondary transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

      <div className="flex flex-col gap-5">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div
              key={i}
              className="self-end max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md bg-neutral-100 border border-neutral-150 text-body-regular text-content-primary whitespace-pre-wrap"
            >
              {m.content}
            </div>
          ) : (
            <div key={i} className="flex gap-3">
              <Image
                src="/image-portfolio.jpg"
                alt=""
                width={56}
                height={56}
                className="rounded-full object-cover w-7 h-7 shrink-0 mt-0.5"
              />
              <p className="text-body-regular text-content-primary whitespace-pre-wrap min-h-6">
                <MessageContent
                  text={m.content}
                  streaming={loading && i === messages.length - 1}
                />
                {loading && i === messages.length - 1 && !m.content && (
                  <span className="inline-flex items-center gap-1 ml-1">
                    <span className="chat-dot w-1.5 h-1.5 rounded-full bg-neutral-300" />
                    <span className="chat-dot w-1.5 h-1.5 rounded-full bg-neutral-300" />
                    <span className="chat-dot w-1.5 h-1.5 rounded-full bg-neutral-300" />
                  </span>
                )}
              </p>
            </div>
          ),
        )}
        <div ref={bottomRef} />
      </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="shrink-0 mb-[max(1.25rem,env(safe-area-inset-bottom))] flex items-center gap-2 bg-white border border-muted rounded-full pl-5 pr-2 py-2 shadow-sm"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about me…"
          maxLength={MAX_MESSAGE_CHARS}
          className="flex-1 bg-transparent text-body-regular text-content-primary placeholder:text-content-muted outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send"
          className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center disabled:opacity-30 transition-opacity cursor-pointer disabled:cursor-default"
        >
          <ArrowUp size={16} />
        </button>
      </form>
    </div>
  );
}
