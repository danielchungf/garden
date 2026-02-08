'use client';

import { useEffect, useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProjectSidebarIndexProps {
  projectTitle: string;
  sections: { title: string }[];
}

export default function ProjectSidebarIndex({ projectTitle, sections }: ProjectSidebarIndexProps) {
  const [activeSection, setActiveSection] = useState<string>('project-info');
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const projectInfo = document.getElementById('project-info');
    const sectionElements = sections
      .map((_, i) => document.getElementById(`section-${i}`))
      .filter(Boolean) as HTMLElement[];

    const allElements = [projectInfo, ...sectionElements].filter(Boolean) as HTMLElement[];
    if (!allElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    allElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      isScrollingRef.current = true;
      setActiveSection(id);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  if (!sections.length) return null;

  const allItems = [
    { id: 'project-info', title: projectTitle },
    ...sections.map((s, i) => ({ id: `section-${i}`, title: s.title })),
  ];

  return (
    <nav
      className="hidden xl:block fixed top-[92px] w-[280px] left-[60px]"
    >
      <Link
        href="/"
        className="flex items-center gap-2 mb-8 text-h3 text-content-tertiary hover:text-content-secondary transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Index</span>
      </Link>

      <ul className="flex flex-col gap-1">
        {allItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={`text-left text-h3 w-full cursor-pointer ${
                  isActive
                    ? 'text-content-primary'
                    : 'text-content-muted hover:text-content-primary'
                }`}
              >
                {item.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
