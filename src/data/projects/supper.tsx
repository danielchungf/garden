import { ProjectData } from '@/types/project';

export const supperProject: ProjectData = {
  slug: 'supper',
  title: 'Supper',
  tagline: 'AI Data Agent for High-Growth Companies',
  url: 'https://www.supper.co/',
  heroAlt: '',
  description: [
    'Supper is an AI data tool for fast-growing companies. It connects to platforms like HubSpot, Quickbooks, and Airtable, and gives teams instant answers to questions about their business. So whether they\u2019re prepping a board deck, responding to investors, or preparing monthly reports, Supper makes sure the data is ready when they need it.',
    'I joined as the lead designer when the product was just a handful of screens and a basic design system, and spent a year and a half shaping every part of the product. The result was an AI-native data stack agent capable of seamlessly turning the raw data into decision-ready insights, in the form of exploratory conversations, live dashboards, and robust data warehouses.',
  ],
  team: [
    { name: 'Lowell Putnam', url: 'https://www.linkedin.com/in/lowell-putnam', avatar: '/projects/supper/lowell.jpeg' },
    { name: 'Andrew Salamon', url: 'https://www.linkedin.com/in/andysalamon/', avatar: '/projects/supper/andrew.jpeg' },
    { name: 'Serena Tsay', url: 'https://www.linkedin.com/in/serenatsay', avatar: '/projects/supper/serena.jpeg' },
    { name: 'Nitzan Israel', url: 'https://www.linkedin.com/in/nitzan-israel-b81748172/', avatar: '/projects/supper/nitzan.avif' },
    { name: 'Aziz Hasan', url: 'https://www.linkedin.com/in/azizhasan/', avatar: '/projects/supper/aziz.avif' },
    { name: 'Gabriel Valdivia', url: 'https://www.gabrielvaldivia.com/', avatar: '/projects/dex/gabe.avif' },
  ],
  duration: '2024—2025',
  sections: [
    {
      title: 'Agent conversations',
      body: 'We built Supper around a conversation. Anyone in the company can ask questions in plain language and get validated answers, supported by structured tables that expose all the data behind each insight. The agent guides users by suggesting next steps and leading them into deeper analysis. We designed a split-screen layout that keeps the chat persistent while users explore charts and validate results side by side.',
      media: [
        { type: 'image', src: '/projects/supper/supper-new-chat.avif', alt: 'Supper new chat', columns: 2, fill: true, noBorder: false },
        { type: 'image', src: '/projects/supper/tagging-chat.avif', alt: 'Supper tagging chat', columns: 2, fill: true, noBorder: false },
        { type: 'description', text: 'Tagging system for column names, metrics, and business logic' },
        { type: 'image', src: '/projects/supper/supper-test.png', alt: 'Supper test', columns: 2, fill: true, noBorder: false },
        { type: 'image', src: '/projects/supper/loading-components.avif', alt: 'Supper loading components', columns: 2, fill: true, noBorder: false },
        { type: 'image', src: '/projects/supper/chat-source.avif', alt: 'Supper chat source', columns: 2, fill: true, noBorder: false },
      ],
    },
    {
      title: 'Live dashboards',
      body: 'We designed Supper\u2019s dashboards as a flexible workspace where raw data becomes clear, explorable insight. The main challenge was striking the right balance between invoking the AI agent and using deterministic controls to build a reliable master data source and meaningful data visualizations. The result is a board that brings live data, AI-driven exploration, anomaly detection, and complex filtering into a single, cohesive workspace.',
      media: [
        { type: 'image', src: '/projects/supper/dashboard.avif', alt: 'Supper dashboard', columns: 2, fill: true, noBorder: false },
        { type: 'image', src: '/projects/supper/new-widget.avif', alt: 'Supper new widget', columns: 2, fill: true, noBorder: false },
        { type: 'image', src: '/projects/supper/dashboard-filter.avif', alt: 'Supper dashboard filter', columns: 2, fill: true, noBorder: false },
        { type: 'image', src: '/projects/supper/filter-components.avif', alt: 'Supper filter components', columns: 2, fill: true, noBorder: false },
      ],
    },
    {
      title: 'Data infrastructure',
      body: 'Companies need confidence in their data to trust Supper. We built a data warehouse that lets users ensure Supper is grounded in trusted, well-structured data. From a single place, users can control what data is available to Supper and to their teammates, audit how entities and metrics connect across sources, and confidently power analytics across SaaS tools and custom databases.',
      media: [
        { type: 'image', src: '/projects/supper/data-warehouse.avif', alt: 'Supper data warehouse', columns: 2, fill: true, noBorder: false },
        { type: 'image', src: '/projects/supper/business-logic.avif', alt: 'Supper business logic', columns: 2, fill: true, noBorder: false },
        { type: 'image', src: '/projects/supper/sources.avif', alt: 'Supper sources', columns: 2, fill: true, noBorder: false },
        { type: 'image', src: '/projects/supper/query-review.avif', alt: 'Supper query review', columns: 2, fill: true, noBorder: false },
      ],
    },
  ],
  gallery: [
    { type: 'video', src: 'https://customer-udqkpp9csg2qzoe3.cloudflarestream.com/23a829454b25ea5082bdffffe638475e/manifest/video.m3u8', columns: 2, fill: true, noBorder: true },
    { type: 'description', text: 'Manifesto video with Andy and Lowell, co-founders of Supper' },
  ],
  coverImage: '/supper-cover.jpg',
};
