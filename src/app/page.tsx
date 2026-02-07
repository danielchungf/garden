import Image from "next/image";
import Link from "next/link";
import { Mail, Twitter } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import { getProjectBySlug } from "@/data/projects";

const workProjects = [
  {
    slug: "dex",
    name: "Dex",
    tagline: "The Language Learning Camera",
    image: "/dex-mini.webp",
  },
  {
    slug: "supper",
    name: "Supper",
    tagline: "AI Data Agent",
    image: "/supper-mini.webp",
  },
  {
    slug: "workmate",
    name: "Workmate",
    tagline: "Everyone's Executive Assistant",
    image: "/workmate-mini.webp",
  },
  {
    slug: "sensible",
    name: "Sensible",
    tagline: "High-Yield Account",
    image: "/sensible-mini.webp",
  },
];

function WorkCard({
  project,
}: {
  project: (typeof workProjects)[number];
}) {
  const hasDetailPage = !!getProjectBySlug(project.slug);

  const content = (
    <div className="bg-white border border-muted rounded-lg p-4 hover:border-neutral-200 transition-colors">
      <div className="flex items-center justify-center h-[140px]">
        <Image
          src={project.image}
          alt={project.name}
          width={420}
          height={420}
          className="w-[132px] h-[132px] object-contain"
        />
      </div>
      <div className="mt-2 flex flex-col gap-0">
        <h3 className="text-h2 text-content-primary">{project.name}</h3>
        <p className="text-body-regular text-content-tertiary">
          {project.tagline}
        </p>
      </div>
    </div>
  );

  if (hasDetailPage) {
    return <Link href={`/${project.slug}`}>{content}</Link>;
  }

  return content;
}

export default function Home() {
  return (
    <main className="max-w-[660px] mx-auto px-5 py-[120px] flex flex-col gap-[80px]">
      {/* Intro */}
      <section>
        <div className="flex items-center gap-4 mb-5">
          <Image
            src="/image-portfolio.jpg"
            alt="Daniel Chung"
            width={168}
            height={168}
            className="rounded-full object-cover w-14 h-14"
          />
          <div>
            <h1 className="text-h1 text-content-primary">Daniel Chung</h1>
            <p className="text-h2 text-content-secondary">
              Product Designer for Early-Stage Teams
            </p>
          </div>
        </div>

        <p className="text-body-regular text-content-tertiary">
          I design and build products that transform how we live. I focus on
          quality, empathy, and curiosity. I create products that feel like
          someone truly cared, that make us more human, and that keep us
          learning. I build tools that bring joy to everyday moments.
        </p>
      </section>

      {/* Work */}
      <section>
        <h2 className="text-h2 text-content-primary mb-5">Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {workProjects.map((project) => (
            <WorkCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* Projects */}
      <section>
        <h2 className="text-h2 text-content-primary mb-5">Projects</h2>
        <div className="flex flex-col gap-3 -mx-2">
          {[
            {
              name: "Piper",
              tagline: "Ultimate Travel Planner",
              href: "https://www.piper.travel/",
              image: "/piper-logo.webp",
            },
            {
              name: "Waffle",
              tagline: "The Visual Organization App",
              href: "https://heywaffle.app/",
              image: "/waffle-logo.webp",
            },
            {
              name: "SipSip",
              tagline: "Coffee Intake Tracker",
              href: "https://sipsip.cafe/",
              image: "/sipsip-logo.webp",
            },
          ].map((project) => (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Image
                src={project.image}
                alt={project.name}
                width={150}
                height={150}
                className="w-[50px] h-[50px] object-contain"
              />
              <div className="flex flex-col gap-[2px]">
                <h3 className="text-h2 text-content-primary">
                  {project.name}
                </h3>
                <p className="text-body-regular text-content-tertiary">
                  {project.tagline}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section>
        <h2 className="text-h2 text-content-primary mb-5">Stack</h2>
        <div className="flex -ml-[4px]">
          {[
            { name: "Figma", image: "/figma-logo.png" },
            { name: "Claude", image: "/claude-logo.png" },
            { name: "Conductor", image: "/conductor-logo.png" },
            { name: "Monologue", image: "/monologue-logo.png" },
            { name: "Mobbin", image: "/mobbin-logo.png" },
            { name: "Supabase", image: "/subapase-logo.png" },
          ].map((tool) => (
            <div key={tool.name} className="relative group">
              <Image
                src={tool.image}
                alt={tool.name}
                width={192}
                height={192}
                className="w-16 h-16 object-contain"
              />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Social */}
      <section>
        <h2 className="text-h2 text-content-primary mb-5">Reach me</h2>
        <div className="flex gap-3">
          <IconButton
            icon={Mail}
            href="mailto:danielchungfung@gmail.com"
          />
          <IconButton
            icon={Twitter}
            href="https://x.com/itsdanielchung"
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>
      </section>
    </main>
  );
}
