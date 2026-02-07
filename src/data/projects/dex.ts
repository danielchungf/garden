import { ProjectData } from '@/types/project';

export const dexProject: ProjectData = {
  slug: 'dex',
  title: 'Dex',
  tagline: 'The Language Learning Camera',
  heroVideo: 'https://www.dex.camera/cdn/shop/videos/c/vp/e2a452bc8452493c9e428a85a5fa459a/e2a452bc8452493c9e428a85a5fa459a.HD-1080p-7.2Mbps-65204699.mp4?v=0',
  heroAlt: 'Dex language learning camera interface',
  description: [
    'Dex turns real-world moments into language lessons for kids ages 3-8. Instead of passive screen time, Dex invites kids to notice the world around them with curiosity and talk back to it, transforming routines into learning opportunities. The result is a gentle rhythm of daily speaking, listening, and discovery that feels like play but compounds into real progress.',
  ],
  team: [
    { name: 'Reni Cao', avatar: '/projects/dex/reni.avif' },
    { name: 'Charlie Zhang', avatar: '/projects/dex/charlie.avif' },
    { name: 'Susan Rosenthal', avatar: '/projects/dex/susan.avif' },
    { name: 'Aparna Dixit', avatar: '/projects/dex/aparna.avif' },
    { name: 'Gabriel Valdivia', avatar: '/projects/dex/gabe.avif' },
  ],
  duration: '2025—2026',
  sections: [
    {
      title: 'The Language Learning Camera',
      body: 'Dex is shaped like a magnifying glass, with a camera on one side and a screen on the other. Kids take photos of whatever catches their attention, and Dex teaches them how to say it in their family\'s language. From there, it might tell a story about the word or prompt a small activity to help it stick.',
      media: [
        { type: 'image', src: '/projects/dex/renders-1.webp', alt: 'Dex device render', columns: 2 },
        { type: 'image', src: '/projects/dex/renders-2.webp', alt: 'Dex device render', columns: 2 },
        { type: 'image', src: '/projects/dex/camera-1.avif', alt: 'Dex camera in use', columns: 3, fill: true, noBorder: true },
        { type: 'image', src: '/projects/dex/camera-3.avif', alt: 'Dex camera in use', columns: 3, fill: true, noBorder: true },
        { type: 'image', src: '/projects/dex/camera-2.avif', alt: 'Dex camera in use', columns: 3, fill: true, noBorder: true },
      ],
    },
    {
      title: 'Activities: Stories, Games, Scavenger Hunts',
      body: 'Each day, new language learning activities unlock to complement the free-camera exploration, and completed ones are saved to a library. Kids engage in interactive stories that let them choose their path by saying words out loud, and practice previously learned words with flashcard games. Some activities involve scavenger hunts, shaking the device, and even dancing.',
      media: [
        { type: 'video', src: '/projects/dex/completed-activity.mp4', columns: 2, fill: true },
        { type: 'video', src: '/projects/dex/next-day.mp4', columns: 2, fill: true },
        { type: 'video', src: '/projects/dex/flashcard-game1080.mp4', columns: 2, fill: true },
      ],
    },
    {
      title: 'Parent Copilot App',
      body: 'Dex includes a parent app that gives families visibility into their kid\'s progress without interrupting independent play. The app needed to echo the playful tone kids recognize without feeling childish for parents. We built a design system with characters and visual language that carries across both the device and the app.',
      media: [
        { type: 'video', src: '/projects/dex/copilot-dino-studio.mp4', columns: 2 },
        { type: 'image', src: '/projects/dex/copilot-onboarding.webp', alt: 'Copilot onboarding', columns: 2 },
        { type: 'image', src: '/projects/dex/copilot-sheets.avif', alt: 'Copilot sheets', columns: 2 },
      ],
    },
    {
      title: 'Product Photography',
      body: 'Using Nano Banana Pro by Google, we created a unified visual language for ads, packaging, and the website. The device\'s shape, colors, and proportions stayed consistent while we swapped scenes, families, moods, and settings, so every photo felt real and part of the same world.',
      media: [
        { type: 'image', src: '/projects/dex/dex-photos-4.avif', alt: 'Dex product photography', columns: 2, fill: true },
        { type: 'image', src: '/projects/dex/dex-photos-5.avif', alt: 'Dex photos', columns: 1, fill: true },
        { type: 'image', src: '/projects/dex/dex-photos-6.avif', alt: 'Dex photos', columns: 1, fill: true },
        { type: 'image', src: '/projects/dex/dex-photos-8.avif', alt: 'Dex photos', columns: 1, fill: true, noBorder: true },
        { type: 'image', src: '/projects/dex/dex-photos-7.avif', alt: 'Dex photos', columns: 1, fill: true, noBorder: true },
        { type: 'image', src: '/projects/dex/dex-photos-3.avif', alt: 'Dex product photography', columns: 2, fill: true },
        { type: 'image', src: '/projects/dex/dex-photos-1.webp', alt: 'Dex photos', columns: 1, fill: true },
        { type: 'image', src: '/projects/dex/dex-photos-2.webp', alt: 'Dex photos', columns: 1, fill: true },
      ],
    },
    {
      title: 'Marketing Website',
      body: '',
      media: [
        { type: 'video', src: '/projects/dex/site-hero720.mp4', columns: 2, fill: true, noBorder: true },
        { type: 'image', src: '/projects/dex/site-pdp-hero.avif', alt: 'Dex marketing website hero', columns: 2, fill: true, noBorder: false },
        { type: 'image', src: '/projects/dex/side-pdp-tech.avif', alt: 'Dex marketing website tech', columns: 2, fill: true, noBorder: true },
      ],
    },
  ],
  gallery: [],
  coverImage: '/dex-mini.webp',
};
