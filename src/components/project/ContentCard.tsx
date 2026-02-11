'use client';

import { ReactNode } from 'react';

interface ContentCardProps {
  children: ReactNode;
  noPadding?: boolean;
  noBorder?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function ContentCard({ children, noPadding, noBorder, className, onClick }: ContentCardProps) {
  return (
    <div
      className={`rounded-[8px] overflow-hidden bg-white ${noBorder ? '' : 'border border-muted'} ${noPadding ? '' : 'p-7'} ${onClick ? 'cursor-pointer' : ''} ${className ?? ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
