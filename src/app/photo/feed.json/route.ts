import { buildFeed } from '@/lib/photo-feed';

// JSON Feed 1.1 for OpenFeed, served at /photo/feed.json. Statically generated at build
// time (force-static), so it regenerates automatically whenever a photo is added and the
// site is rebuilt — never hand-edited.
export const dynamic = 'force-static';

export async function GET() {
  const feed = await buildFeed();
  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'content-type': 'application/feed+json; charset=utf-8' },
  });
}
