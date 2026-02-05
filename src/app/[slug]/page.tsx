import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjectSlugs } from '@/data/projects';
import ProjectHeader from '@/components/project/ProjectHeader';
import ProjectHero from '@/components/project/ProjectHero';
import ProjectInfo from '@/components/project/ProjectInfo';
import ProjectGallery from '@/components/project/ProjectGallery';

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
    <main>
      <ProjectHeader projectTitle={project.title} />

      {/* Content with 16px padding */}
      <div className="p-4">
        {/* Hero - full width */}
        <ProjectHero image={project.heroImage} alt={project.heroAlt} />

        {/* 40px gap between hero and info */}
        <div className="h-10" />

        {/* Two column layout - info in second column */}
        <div id="project-info" className="flex gap-5">
          <div className="flex-1" />
          <div className="flex-1">
            <ProjectInfo
              title={project.title}
              url={project.url}
              description={project.description}
              team={project.team}
              duration={project.duration}
            />
          </div>
        </div>

        {/* 40px gap between info and gallery */}
        <div className="h-10" />

        {/* Gallery - full width with flexible columns */}
        <ProjectGallery items={project.gallery} />

        {/* 40px bottom margin */}
        <div className="h-10" />
      </div>
    </main>
  );
}
