import { ProjectData } from '@/types/project';
import { supperProject } from './supper';
import { dexProject } from './dex';

export const projects: Record<string, ProjectData> = {
  supper: supperProject,
  dex: dexProject,
};

export const getProjectBySlug = (slug: string): ProjectData | undefined =>
  projects[slug];

export const getAllProjectSlugs = (): string[] =>
  Object.keys(projects);

export const getAllProjects = (): ProjectData[] =>
  Object.values(projects);
