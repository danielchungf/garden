"use client";

// Milestone 1's single object: a grey cube standing in for the future
// memory objects (the ocean, the cats, the coffee cup...). Its job is to
// prove the proximity tooltip works before any real content exists.

import ProximityTooltip from "./ProximityTooltip";

// A short walk from spawn, visible as soon as you enter.
const CUBE_POSITION: [number, number, number] = [4, 0.5, -3];

export default function PlaceholderCube() {
  return (
    <group>
      <mesh position={CUBE_POSITION} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#c9c2b8" />
      </mesh>

      {/* Floats just above the cube. */}
      <ProximityTooltip
        position={[CUBE_POSITION[0], CUBE_POSITION[1] + 1.2, CUBE_POSITION[2]]}
      >
        a cube. it&apos;s thinking.
      </ProximityTooltip>
    </group>
  );
}
