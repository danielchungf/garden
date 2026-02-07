import { ProjectData } from '@/types/project';

export const dexProject: ProjectData = {
  slug: 'dex',
  title: 'Dex',
  tagline: 'The Language Learning Camera',
  heroImage: '/projects/dex/dex-photos-3.avif',
  heroAlt: 'Dex language learning camera interface',
  description: [
    'Dex turns real-world moments into language lessons for kids. Instead of passive screen time, Dex invites kids to notice the world around them and talk back to it, transforming routines into learning opportunities. The result is a gentle rhythm of daily speaking, listening, and discovery that feels like play but compounds into real progress.',
    'Dex is shaped like a magnifying glass, with a camera on one side and a screen on the other. Kids take photos of whatever catches their attention, and Dex teaches them how to say it in their family\'s language. From there, it might tell a story about the word or prompt a small activity to help it stick.',
  ],
  team: [
    { name: 'Reni Cao', avatar: '/projects/dex/reni.avif' },
    { name: 'Charlie Zhang', avatar: '/projects/dex/charlie.avif' },
    { name: 'Susan Rosenthal', avatar: '/projects/dex/susan.avif' },
    { name: 'Aparna Dixit', avatar: '/projects/dex/aparna.avif' },
    { name: 'Gabriel Valdivia', avatar: '/projects/dex/gabe.avif' },
  ],
  duration: '2024—2025',
  gallery: [
    { type: 'video', src: '/projects/dex/copilot-dino-studio.mp4', columns: 2 },
    { type: 'image', src: '/projects/dex/dex-photos-1.webp', alt: 'Dex photos', columns: 1 },
    { type: 'image', src: '/projects/dex/dex-photos-2.webp', alt: 'Dex photos', columns: 1 },
  ],
  coverImage: '/dex-mini.webp',
};
