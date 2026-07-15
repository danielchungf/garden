"use client";

// The 3D scene itself: sunset sky, ocean, lights, the island, one cube,
// and the first-person controller. Composed here so each piece stays small.

import { Canvas } from "@react-three/fiber";
import { PLAYER, SUNSET } from "./constants";
import PlayerController from "./PlayerController";
import SkyDome from "./SkyDome";
import Ocean from "./Ocean";
import Land from "./Land";
import SumiCat from "./SumiCat";

// The sun sits low in the west; the shadow-casting light shines from the
// same direction so the whole scene agrees about where the light is.
const SUN = SUNSET.SUN_DIRECTION;

interface WorldCanvasProps {
  onLockChange: (locked: boolean) => void;
}

export default function WorldCanvas({ onLockChange }: WorldCanvasProps) {
  return (
    <Canvas
      // One shadow-casting light is cheap and makes space legible —
      // low sunset light means long, dramatic shadows for free.
      // ("percentage" = PCF shadow maps; three deprecated the old
      // PCFSoft default, and PCF looks identical at this scale.)
      shadows="percentage"
      // Cap device-pixel-ratio at 2 so retina laptops don't render 9x pixels.
      dpr={[1, 2]}
      // far must reach the sky dome (radius 900) and the ocean horizon.
      camera={{
        fov: 75,
        near: 0.1,
        far: 2000,
        position: [...PLAYER.SPAWN],
      }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      {/* Fog melts the island's far edge into the sunset. The sky and
          ocean shaders don't participate — they paint their own air. */}
      <fog attach="fog" args={[SUNSET.FOG_COLOR, SUNSET.FOG_NEAR, SUNSET.FOG_FAR]} />

      {/* Pink bounce from the sky above, cool violet from the shadow side
          below — this pair is what makes the whole island feel bathed
          in sunset instead of lit by a lamp. */}
      <hemisphereLight args={["#f2a0a4", "#6b5a7d", 0.8]} />

      {/* The sun: low in the west, warm orange, casting long shadows.
          Positioned 40 units out along the sun direction. */}
      <directionalLight
        position={[SUN[0] * 40, SUN[1] * 40, SUN[2] * 40]}
        intensity={1.7}
        color="#ffb271"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* A gentle warm floor so shadows never go fully black. */}
      <ambientLight intensity={0.28} color="#ffd9c2" />

      <SkyDome />
      <Ocean />
      <Land />
      <SumiCat />
      <PlayerController onLockChange={onLockChange} />
    </Canvas>
  );
}
