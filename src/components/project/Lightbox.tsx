'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { MediaItem } from '@/types/project';
import MediaRenderer from './MediaRenderer';

// Strong ease-out (matches --ease-out in globals.css)
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

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
  const shouldReduceMotion = useReducedMotion();

  // Modals stay centered — scale from center, not from a trigger.
  // Under reduced motion, cross-fade only (no scale).
  const panelInitial = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 };
  const panelAnimate = { opacity: 1, scale: 1 };

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
      <AnimatePresence>
        {item && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15, ease: EASE_OUT } }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            <motion.div
              className="relative m-8 max-w-[1000px]"
              initial={panelInitial}
              animate={panelAnimate}
              exit={{ ...panelInitial, transition: { duration: 0.15, ease: EASE_OUT } }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}
