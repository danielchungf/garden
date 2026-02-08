import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProjectBySlug, getAllProjectSlugs } from '@/data/projects';
import { IconButton } from '@/components/IconButton';
import MediaRenderer from '@/components/project/MediaRenderer';
import ContentCard from '@/components/project/ContentCard';
import ProjectSection from '@/components/project/ProjectSection';
import ProjectSidebarIndex from '@/components/project/ProjectSidebarIndex';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: 'Not Found' };
  }

  return {
    title: `${project.title} | Daniel Chung`,
    description: project.tagline,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="max-w-[660px] mx-auto px-5 py-[60px] md:py-[80px] flex flex-col">
      {/* Back button - hidden on wide viewports where sidebar index has its own */}
      <Link href="/" className="xl:hidden">
        <IconButton icon={ArrowLeft} />
      </Link>

      {/* Project info - 60px gap from back button */}
      <div id="project-info" className="mt-[60px] scroll-mt-20">
        <h1 className="text-hero text-content-primary">{project.title}</h1>

        {/* Description - 12px gap from title */}
        <div className="mt-3 space-y-4">
          {project.description.map((paragraph, index) => (
            <p key={index} className="text-body-regular text-content-tertiary">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Metadata - 32px gap from description */}
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-h2 text-content-primary mb-3">Team</h3>
            <div className="flex gap-1">
              {project.team.map((member) => (
                <div key={member.name} className="relative group">
                  {member.avatar ? (
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={64}
                      height={64}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white" />
                  )}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {member.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-h2 text-content-primary mb-3">Duration</h3>
            <p className="text-body-regular text-content-tertiary">{project.duration}</p>
          </div>
        </div>
        {/* Hero */}
        <div className="mt-[60px] w-full overflow-hidden rounded-lg bg-neutral-100">
          {project.heroVideo ? (
            <video
              src={project.heroVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="block w-full aspect-video object-cover"
            />
          ) : project.heroImage ? (
            <Image
              src={project.heroImage}
              alt={project.heroAlt}
              width={1920}
              height={1080}
              className="block w-full h-auto"
              unoptimized
              priority
            />
          ) : null}
        </div>
        <div className="pb-[60px] border-b border-muted" />
      </div>

      {/* Sidebar Index */}
      {project.sections && project.sections.length > 0 && (
        <ProjectSidebarIndex projectTitle={project.title} sections={project.sections.map(s => ({ title: s.title }))} />
      )}

      {/* Sections */}
      {project.sections && project.sections.length > 0 && (
        <div className="mt-[60px] flex flex-col gap-[60px]">
          {project.sections.map((section, index) => (
            <ProjectSection key={index} id={`section-${index}`} title={section.title} body={section.body} media={section.media} />
          ))}
        </div>
      )}

      {/* Gallery - 80px gap from metadata */}
      {project.gallery.length > 0 && (
        <div className="mt-[80px] grid grid-cols-6 gap-8">
          {project.gallery.map((item, index) => {
            const columns = item.columns ?? 2;
            const colSpanClass = columns === 2 ? 'col-span-6' : columns === 3 ? 'col-span-2' : 'col-span-3';
            return (
              <div
                key={index}
                className={colSpanClass}
              >
                <ContentCard noPadding={item.type === 'image' || (item.type === 'video' && item.fill)}>
                  <MediaRenderer item={item} />
                </ContentCard>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
