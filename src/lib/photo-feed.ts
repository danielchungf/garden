import { getPhotos } from '@/lib/photography';
import { formatShutter, formatFStop, formatFocal } from '@/lib/photo-exif';
import { SITE_URL } from '@/lib/site';

// Builds the OpenFeed / JSON Feed 1.1 document for /photo/feed.json at BUILD TIME.
//
// Everything comes from getPhotos(), which reads EXIF from the ORIGINAL image files — so the
// feed is never hand-edited and can't drift from the site. Publishing a photo is just "drop
// the file, build, deploy". The feed is regenerated because the route that emits it is
// statically generated.

/** Display-formatted EXIF for OpenFeed's info card. Only present keys are included. */
export interface FeedExif {
  camera?: string;
  lens?: string;
  shutter?: string;
  aperture?: string;
  iso?: string;
  focal?: string;
}

export interface FeedItem {
  id: string;
  url: string;
  image: string;
  date_published: string;
  _photoring?: { exif: FeedExif };
}

/** All feed items, newest first (by capture date). */
export async function buildFeedItems(): Promise<FeedItem[]> {
  const photos = await getPhotos();

  const items = photos.map((p) => {
    const e = p.exif;
    const card: FeedExif = {};
    const shutter = formatShutter(e.exposureTime);
    const fstop = formatFStop(e.fNumber);
    const focal = formatFocal(e.focalLength);
    if (e.camera) card.camera = e.camera;
    if (e.lens) card.lens = e.lens;
    if (shutter) card.shutter = shutter;
    if (fstop) card.aperture = `ƒ/${fstop}`;
    if (e.iso != null) card.iso = String(e.iso);
    if (focal) card.focal = focal;

    const permalink = `${SITE_URL}/photo/${p.slug}/`;
    const item: FeedItem = {
      id: permalink,
      url: permalink,
      image: `${SITE_URL}${p.src}`, // full-size original in /photography
      date_published: e.capturedAt,
    };
    if (Object.keys(card).length) item._photoring = { exif: card };
    return item;
  });

  return items.sort((a, b) => b.date_published.localeCompare(a.date_published));
}

/** The complete JSON Feed 1.1 document served at /photo/feed.json. */
export async function buildFeed() {
  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Daniel Chung — Photos',
    home_page_url: `${SITE_URL}/photography`,
    feed_url: `${SITE_URL}/photo/feed.json`,
    authors: [
      {
        name: 'Daniel Chung',
        url: SITE_URL,
        avatar: `${SITE_URL}/image-portfolio.jpg`,
      },
    ],
    _photoring: { ring: 'openfeed-demo', creator: 'danielchung' },
    items: await buildFeedItems(),
  };
}
