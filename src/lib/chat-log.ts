import "server-only";
import { getStore } from "@netlify/blobs";

const STORE_NAME = "chat-logs";

export interface ChatLogMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  id: string;
  startedAt: number;
  updatedAt: number;
  city?: string;
  region?: string;
  country?: string;
  messages: ChatLogMessage[];
}

function store() {
  // Strong consistency so a just-finished conversation shows up on /chats.
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

/**
 * Upsert a session with its full transcript. Each chat request carries the
 * whole conversation, so overwriting is simpler and safer than appending.
 * Callers must treat failures as non-fatal — logging never blocks a reply.
 */
export async function saveChatSession(
  session: Omit<ChatSession, "startedAt">,
): Promise<void> {
  const s = store();
  const key = `session:${session.id}`;
  const existing = (await s
    .get(key, { type: "json" })
    .catch(() => null)) as ChatSession | null;
  await s.setJSON(key, {
    ...session,
    startedAt: existing?.startedAt ?? session.updatedAt,
    // Geo comes from the first request that had it — don't let a later
    // request without the header blank it out.
    city: session.city ?? existing?.city,
    region: session.region ?? existing?.region,
    country: session.country ?? existing?.country,
  });
}

/** All sessions, newest activity first. Empty when Blobs is unavailable. */
export async function readChatSessions(): Promise<ChatSession[]> {
  try {
    const s = store();
    const { blobs } = await s.list({ prefix: "session:" });
    const sessions = await Promise.all(
      blobs.map(
        (b) => s.get(b.key, { type: "json" }) as Promise<ChatSession | null>,
      ),
    );
    return (sessions.filter(Boolean) as ChatSession[]).sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
  } catch {
    return [];
  }
}
