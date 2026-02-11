'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { MediaItem } from '@/types/project';
import MediaRenderer from './MediaRenderer';

type LightboxContextType = {
  open: (item: MediaItem) => void;
  close: () => void;
};

const LightboxContext = createContext<LightboxContextType | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox must be used within LightboxProvider');
  return ctx;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<MediaItem | null>(null);

  const open = useCallback((item: MediaItem) => {
    if (window.innerWidth < 768) return;
    setItem(item);
  }, []);
  const close = useCallback(() => setItem(null), []);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, close]);

  return (
    <LightboxContext.Provider value={{ open, close }}>
      {children}
      {item && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={close}
        >
          <div className="relative m-8 max-w-[1000px]">
            <div className="absolute -right-12 z-10">
              <button
                onClick={close}
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center cursor-pointer transition-colors hover:bg-white/40"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
            {(() => {
              const isFill = 'fill' in item && item.fill;
              const base = 'rounded-[8px] border border-muted bg-[#fdfdfc] overflow-hidden';
              const className = isFill
                ? `${base} [&_img]:max-h-[calc(100vh-64px)] [&_img]:w-auto [&_img]:h-auto [&_video]:max-h-[calc(100vh-64px)] [&_video]:w-auto [&_video]:h-auto`
                : `${base} px-20 py-10 [&_img]:max-h-[calc(100vh-144px)] [&_img]:w-auto [&_img]:h-auto [&_video]:max-h-[calc(100vh-144px)] [&_video]:w-auto [&_video]:h-auto`;
              return (
                <div
                  className={className}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MediaRenderer item={item} />
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  );
}
