"use client";

// The land: a vast coastal shelf. One huge box whose top face is the
// ground you walk on and whose west face is the bluff dropping to the
// sea — think Lima's Costa Verde. It stretches far past the fog in
// every other direction, so from the shore the country feels endless.

import { LAND } from "./constants";

export default function Land() {
  return (
    <mesh
      // Top face at y = 0; the box is centered, so sink it half its
      // height. Push it east so its west face sits exactly at the coast.
      position={[0, -LAND.HEIGHT / 2, LAND.COAST_Z + LAND.SIZE / 2]}
      receiveShadow
    >
      <boxGeometry args={[LAND.SIZE, LAND.HEIGHT, LAND.SIZE]} />
      {/* Warm mid-tone earth: the low sun paints the west faces orange
          and leaves the east faces in cool violet shadow. */}
      <meshStandardMaterial color="#c49a7d" />
    </mesh>
  );
}
