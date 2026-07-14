"use client";

// The 3D scene itself: sky, fog, lights, the island, one cube, and the
// first-person controller. Composed here so each piece stays small.

import { Canvas } from "@react-three/fiber";
import { PLAYER, SKY } from "./constants";
import PlayerController from "./PlayerController";
import Island from "./Island";
import PlaceholderCube from "./PlaceholderCube";

interface WorldCanvasProps {
  onLockChange: (locked: boolean) => void;
}

export default function WorldCanvas({ onLockChange }: WorldCanvasProps) {
  return (
    <Canvas
      // One shadow-casting light is cheap and makes space legible —
      // without a contact shadow, the cube would float ambiguously.
      // ("percentage" = PCF shadow maps; three deprecated the old
      // PCFSoft default, and PCF looks identical at this scale.)
      shadows="percentage"
      // Cap device-pixel-ratio at 2 so retina laptops don't render 9x pixels.
      dpr={[1, 2]}
      camera={{
        fov: 75,
        near: 0.1,
        far: 100,
        position: [...PLAYER.SPAWN],
      }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      {/* Background and fog share one cream color, so distant geometry
          dissolves into the sky with no visible horizon line. */}
      <color attach="background" args={[SKY.COLOR]} />
      <fog attach="fog" args={[SKY.COLOR, SKY.FOG_NEAR, SKY.FOG_FAR]} />

      {/* Warm sky bounce from above + warm ground bounce from below.
          This light is what makes flat grey read "watercolor" not "unlit". */}
      <hemisphereLight args={["#fdf6ec", "#d9cbb8", 0.85]} />

      {/* One soft warm sun. The shadow camera is a box around the island —
          keeping it tight keeps the 1024px shadow map crisp. */}
      <directionalLight
        position={[8, 14, 6]}
        intensity={1.4}
        color="#fff4e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* A gentle floor so shadows never go fully black. */}
      <ambientLight intensity={0.25} />

      <Island />
      <PlaceholderCube />
      <PlayerController onLockChange={onLockChange} />
    </Canvas>
  );
}
