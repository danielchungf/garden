"use client";

// The client-side shell for /world. It does three jobs:
//
// 1. Lazy-loads the 3D scene with `ssr: false`, so three.js is only ever
//    downloaded by visitors who open this route (and never on the server).
// 2. Owns the pointer-lock state, shared between the 3D scene (which
//    triggers lock) and the DOM entry overlay (which reacts to it).
// 3. Detects touch devices and shows a friendly notice instead of the
//    canvas — phones never pay for the 3D bundle at all.

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
import EntryOverlay from "./EntryOverlay";

const WorldCanvas = dynamic(() => import("./WorldCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="text-sm text-neutral-400">warming up…</p>
    </div>
  ),
});

// Standard trick to know when we're past server rendering: the server
// snapshot says false, the client snapshot says true, and React swaps
// them for us without any effects or extra state.
const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function World() {
  // Whether the pointer is currently locked (i.e. the visitor is "inside").
  const [locked, setLocked] = useState(false);

  // True once the visitor has entered at least once — lets the overlay
  // say "click to continue" instead of "click to explore" after ESC.
  const [hasEntered, setHasEntered] = useState(false);

  // Fades the canvas in once it has mounted, so the world breathes in
  // instead of popping.
  const [visible, setVisible] = useState(false);

  // null while server-rendering, then true/false on the client. A "coarse"
  // primary pointer means finger/touch rather than a mouse.
  const hydrated = useHydrated();
  const isTouch = hydrated
    ? window.matchMedia("(pointer: coarse)").matches
    : null;

  useEffect(() => {
    if (isTouch === false) {
      // Next frame, so the opacity transition actually runs.
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isTouch]);

  const handleLockChange = (isLocked: boolean) => {
    setLocked(isLocked);
    if (isLocked) setHasEntered(true);
  };

  if (isTouch === null) {
    // One blank frame while we check the pointer type.
    return <div className="fixed inset-0 bg-[#efe6d8]" />;
  }

  if (isTouch) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#efe6d8] px-6">
        <div className="max-w-xs rounded-xl bg-white/80 p-6 text-center shadow-sm">
          <p className="text-sm text-neutral-600">
            This little world needs a keyboard and a mouse — come back on a
            desktop to walk around.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#efe6d8]">
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <WorldCanvas onLockChange={handleLockChange} />
      </div>
      <EntryOverlay locked={locked} hasEntered={hasEntered} />
    </div>
  );
}
