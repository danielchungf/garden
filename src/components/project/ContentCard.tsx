'use client';

import { ReactNode } from 'react';

interface ContentCardProps {
  children: ReactNode;
  noPadding?: boolean;
  className?: string;
}

export default function ContentCard({ children, noPadding, className }: ContentCardProps) {
  return (
    <div className={`bg-white border border-muted rounded-lg overflow-hidden ${noPadding ? '' : 'p-10'} ${className ?? ''}`}>
      {children}
    </div>
  );
}
