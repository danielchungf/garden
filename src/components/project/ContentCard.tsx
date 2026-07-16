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
      className={`rounded-[8px] overflow-hidden bg-white ${noBorder ? '' : 'border border-muted'} ${noPadding ? '' : 'p-7'} ${onClick ? 'cursor-pointer transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.985]' : ''} ${className ?? ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
