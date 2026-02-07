'use client';

import { ReactNode } from 'react';

interface ContentCardProps {
  children: ReactNode;
  noPadding?: boolean;
  noBorder?: boolean;
  className?: string;
}

export default function ContentCard({ children, noPadding, noBorder, className }: ContentCardProps) {
  return (
    <div className={`${noBorder ? '' : 'rounded-lg overflow-hidden bg-white border border-muted'} ${noPadding ? '' : 'p-7'} ${className ?? ''}`}>
      {children}
    </div>
  );
}
