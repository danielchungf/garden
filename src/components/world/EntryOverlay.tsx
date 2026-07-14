"use client";

// The "front door" of the world: a soft blurred overlay with a single
// button. Clicking it requests pointer lock (drei's PointerLockControls
// is bound to the button's id — see PlayerController), the overlay fades
// out, and you're inside. Pressing ESC unlocks and the overlay returns.
//
// It fades rather than unmounting, so the return on ESC is graceful.
// Note: after ESC, browsers enforce a ~1.3s cooldown before pointer lock
// can re-engage; clicking too soon just no-ops (drei swallows the error).

interface EntryOverlayProps {
  locked: boolean;
  hasEntered: boolean;
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-neutral-300 bg-white/70 px-1.5 py-0.5 font-sans text-[11px] text-neutral-500">
      {children}
    </kbd>
  );
}

export default function EntryOverlay({ locked, hasEntered }: EntryOverlayProps) {
  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 bg-[#efe6d8]/60 backdrop-blur-sm transition-opacity duration-500 ${
        locked ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <p className="text-sm tracking-wide text-neutral-500">a small world</p>

      <button
        id="enter-world"
        className="cursor-pointer rounded-full bg-white/90 px-8 py-3.5 text-sm text-neutral-700 shadow-md transition-shadow duration-300 hover:shadow-lg"
      >
        {hasEntered ? "click to continue" : "click to explore"}
      </button>

      <div className="flex items-center gap-4 text-xs text-neutral-400">
        <span className="flex items-center gap-1">
          <Key>W</Key>
          <Key>A</Key>
          <Key>S</Key>
          <Key>D</Key>
          <span className="ml-1">move</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Key>space</Key> jump
        </span>
        <span className="flex items-center gap-1.5">
          <Key>mouse</Key> look
        </span>
        <span className="flex items-center gap-1.5">
          <Key>esc</Key> pause
        </span>
      </div>
    </div>
  );
}
