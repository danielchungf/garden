'use client';

import { useEffect, useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { LexiconHeading } from '@/lib/lexicon';

interface LexiconSidebarIndexProps {
  headings: LexiconHeading[];
}

export default function LexiconSidebarIndex({ headings }: LexiconSidebarIndexProps) {
  const [activeHeading, setActiveHeading] = useState<string>(headings[0]?.id ?? '');
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      isScrollingRef.current = true;
      setActiveHeading(id);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  if (!headings.length) return null;

  return (
    <nav
      className="hidden xl:block fixed top-[92px] w-[280px] left-[60px]"
    >
      <Link
        href="/"
        className="flex items-center gap-2 mb-8 text-h3 text-content-muted hover:text-content-primary transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Index</span>
      </Link>

      <ul className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-hide">
        {headings.map((heading) => {
          const isActive = activeHeading === heading.id;
          return (
            <li key={heading.id}>
              <button
                onClick={() => handleClick(heading.id)}
                className={`text-left text-h3 w-full cursor-pointer transition-colors ${
                  isActive
                    ? 'text-content-primary'
                    : 'text-content-muted hover:text-content-primary'
                }`}
              >
                {heading.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
