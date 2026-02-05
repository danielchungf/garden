import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug } from "@/data/projects";

interface Project {
  slug: string;
  name: string;
  tagline: string;
  image: string;
}

const defaultProjects: Project[] = [
  {
    slug: "dex",
    name: "Dex",
    tagline: "The Language Learning Camera",
    image: "/dex-horizontal.jpg",
  },
  {
    slug: "supper",
    name: "Supper",
    tagline: "AI Data Agent for High-Growth Companies",
    image: "/supper-cover.jpg",
  },
  {
    slug: "sensible",
    name: "Sensible",
    tagline: "High-Yield Account for Crypto",
    image: "/sensible-cover.webp",
  },
  {
    slug: "waffle",
    name: "Waffle",
    tagline: "The Visual Organization App",
    image: "/waffle-cover.jpg",
  },
  {
    slug: "ritual-dental",
    name: "Ritual Dental",
    tagline: "Personalized Preventive Oral Care",
    image: "/ritual-horizontal.jpg",
  },
];

function ProjectCard({ project }: { project: Project }) {
  const hasDetailPage = !!getProjectBySlug(project.slug);

  const content = (
    <div className="flex flex-col gap-3 group cursor-pointer">
      <div className="aspect-video w-full overflow-hidden relative">
        <Image
          src={project.image}
          alt={project.name}
          width={600}
          height={338}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
        {!hasDetailPage && (
          <span
            className="absolute top-3 right-3 bg-white/75 backdrop-blur-sm px-2 py-1 rounded-lg text-h4 uppercase text-content-primary opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ fontWeight: 700 }}
          >
            Coming Soon
          </span>
        )}
      </div>
      <p className="text-body-small">
        <span className="text-content-primary">{project.name}</span>
        <span className="text-content-secondary"> — {project.tagline}</span>
      </p>
    </div>
  );

  if (hasDetailPage) {
    return <Link href={`/${project.slug}`}>{content}</Link>;
  }

  return content;
}

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10">
      {defaultProjects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
