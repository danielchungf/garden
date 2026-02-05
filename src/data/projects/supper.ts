import { ProjectData } from '@/types/project';

export const supperProject: ProjectData = {
  slug: 'supper',
  title: 'Supper',
  tagline: 'AI Data Agent for High-Growth Companies',
  url: 'https://www.supper.co/',
  heroImage: '/projects/supper/supper-hero.webp',
  heroAlt: 'Supper dashboard showing data analytics',
  description: [
    'We built Supper for fast-growing companies that want to understand their data and make decisions quickly. Whether their data stack is mature or still coming together, Supper supports better decision-making through deep analysis, live dashboards, and ad hoc questions.',
    'We partnered with the founders to take a prompt bar that once struggled to answer "How many employees work here?" into a truly agentic platform capable of deep analysis, understanding custom company jargon, and making sense of even the thorniest databases.',
  ],
  team: [
    { name: 'Gabriel Valdivia', url: 'https://www.gabrielvaldivia.com/' },
    { name: 'Lowell Putnam', url: 'https://www.linkedin.com/in/lowell-putnam' },
    { name: 'Andrew Salamon', url: 'https://www.linkedin.com/in/andysalamon/' },
    { name: 'Serena Tsay', url: 'https://www.linkedin.com/in/serenatsay' },
  ],
  duration: '2024—2025',
  gallery: [
    { type: 'image', src: '/projects/supper/new-conversation.webp', alt: 'New conversation interface', caption: 'New conversation', columns: 1 },
    { type: 'image', src: '/projects/supper/tagging-system.webp', alt: 'Tagging system interface', caption: 'Tagging system', columns: 1 },
    { type: 'image', src: '/projects/supper/loading.webp', alt: 'Loading answer state', caption: 'Loading answer', columns: 1 },
    { type: 'image', src: '/projects/supper/loading-components.webp', alt: 'Loading components state', caption: 'Loading components', columns: 1 },
    { type: 'image', src: '/projects/supper/conversation.webp', alt: 'Conversation source tab', caption: 'Conversation, "Source" tab', columns: 2 },
    { type: 'image', src: '/projects/supper/dashboard.webp', alt: 'Live dashboard', caption: 'Live dashboard', columns: 2 },
    { type: 'image', src: '/projects/supper/widgets.webp', alt: 'New widget creation', caption: 'New widget creation', columns: 1 },
    { type: 'image', src: '/projects/supper/date-filter.webp', alt: 'Date filter', caption: 'Date filter', columns: 1 },
    { type: 'image', src: '/projects/supper/filter-components.webp', alt: 'Dashboard filtering system', caption: 'Dashboard filtering system', columns: 2 },
    { type: 'image', src: '/projects/supper/data-warehouse.webp', alt: 'Data Warehouse', caption: 'Data Warehouse', columns: 2 },
    { type: 'image', src: '/projects/supper/business-logic.webp', alt: 'Business Logic', caption: 'Business Logic', columns: 1 },
    { type: 'image', src: '/projects/supper/sources.webp', alt: 'Data Sources', caption: 'Data Sources', columns: 1 },
    { type: 'image', src: '/projects/supper/query-review.webp', alt: 'Query Review', caption: 'Query Review', columns: 2 },
  ],
  coverImage: '/supper-cover.jpg',
};
