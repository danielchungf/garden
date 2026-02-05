import Image from 'next/image';

interface ProjectHeroProps {
  image: string;
  alt: string;
}

export default function ProjectHero({ image, alt }: ProjectHeroProps) {
  return (
    <section className="w-full bg-neutral-100 h-[700px] overflow-hidden">
      <Image
        src={image}
        alt={alt}
        width={1920}
        height={700}
        className="w-full h-full object-cover"
        priority
      />
    </section>
  );
}
