'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

interface ProjectHeaderProps {
  projectTitle: string;
}

export default function ProjectHeader({ projectTitle }: ProjectHeaderProps) {
  const [showProjectTitle, setShowProjectTitle] = useState(false);

  useEffect(() => {
    const infoSection = document.getElementById('project-info');
    if (!infoSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only show project title when scrolled DOWN past info section
        // Check if the section is above the viewport (scrolled past)
        const rect = infoSection.getBoundingClientRect();
        const isPastSection = rect.bottom < 80; // 80px accounts for header height
        setShowProjectTitle(isPastSection);
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );

    observer.observe(infoSection);

    return () => observer.disconnect();
  }, []);

  return (
    <header className="flex gap-5 p-4 border-b border-muted sticky top-0 bg-white z-10">
      <Link href="/" className="text-h2 text-content-primary flex-1">
        Daniel Chung
      </Link>
      <span className="text-h2 text-content-primary flex-1 relative overflow-hidden">
        <span
          className={`transition-all duration-300 ${
            showProjectTitle
              ? 'opacity-0 -translate-y-full'
              : 'opacity-100 translate-y-0'
          } block`}
        >
          Product Designer
        </span>
        <span
          className={`transition-all duration-300 absolute top-0 left-0 ${
            showProjectTitle
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-full'
          }`}
        >
          {projectTitle}
        </span>
      </span>
    </header>
  );
}
