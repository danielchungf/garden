"use client";

// A tooltip that fades in when you walk close to a point in the world.
//
// How it works: every frame we measure the camera's distance to the anchor.
// Crossing below SHOW_DISTANCE turns it on; crossing above HIDE_DISTANCE
// turns it off. The gap between the two (hysteresis) means standing right
// at the boundary never makes it flicker. React state only changes on
// those crossings, so the per-frame cost is a single distance check.
//
// The fade itself is plain CSS: opacity plus a 4px rise, which reads as
// the tooltip "surfacing" rather than blinking on.

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { TOOLTIP } from "./constants";

interface ProximityTooltipProps {
  /** World position the tooltip floats at, as [x, y, z]. */
  position: [number, number, number];
  children: React.ReactNode;
}

export default function ProximityTooltip({
  position,
  children,
}: ProximityTooltipProps) {
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const anchor = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame(({ camera }) => {
    const distance = camera.position.distanceTo(anchor);
    const next =
      distance < TOOLTIP.SHOW_DISTANCE
        ? true
        : distance > TOOLTIP.HIDE_DISTANCE
          ? false
          : visibleRef.current; // in the gap: keep whatever it was
    if (next !== visibleRef.current) {
      visibleRef.current = next;
      setVisible(next);
    }
  });

  return (
    <Html
      position={position}
      center
      // The tooltip is read-only — it must never steal the mouse.
      style={{ pointerEvents: "none" }}
      // Keep it below the entry overlay (which sits at z-20).
      zIndexRange={[10, 0]}
    >
      <div
        className={`w-max max-w-[220px] rounded-lg bg-white/95 px-3.5 py-2.5 text-sm text-neutral-600 shadow-md transition-all duration-300 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        {children}
      </div>
    </Html>
  );
}
