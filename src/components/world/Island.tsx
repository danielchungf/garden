"use client";

// The floating island: a single tapered cylinder. Fourteen radial segments
// plus flat shading gives the faceted low-poly look for free, and the taper
// (top wider than bottom) reads "floating island" even in plain grey.

import { ISLAND } from "./constants";

// How tall the island's rocky underside is, and where the top face sits.
const THICKNESS = 7;

export default function Island() {
  return (
    <mesh position={[0, -THICKNESS / 2, 0]} receiveShadow>
      {/* args: [topRadius, bottomRadius, height, radialSegments, heightSegments] */}
      <cylinderGeometry
        args={[ISLAND.RADIUS, ISLAND.RADIUS * 0.55, THICKNESS, 14, 1]}
      />
      <meshStandardMaterial color="#d8d2c6" flatShading />
    </mesh>
  );
}
