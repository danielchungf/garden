"use client";

// The ocean: one huge flat plane, brought alive entirely by a shader.
// The water never actually moves — instead, for every pixel, we invent
// a tiny rocking "wave normal" (which way the surface tilts) from a few
// overlapping sine waves, and tilt it over time. Light bouncing off
// those imaginary tilts is what reads as glints and shimmer.
//
// Three layers build the look, all using the same sunset colors:
//   1. Base water: indigo up close, melting into horizon-orange far away
//      (the same trick the old fog did — the seam with the sky vanishes).
//   2. The sun path: a broad warm lane on the water pointing at the sun.
//   3. Glints: sharp sparkles where a wave happens to tilt just right.

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SUNSET, OCEAN } from "./constants";

const VERTEX = /* glsl */ `
  // Passes each point's position in the world to the fragment shader,
  // so it can measure distances and directions per pixel.
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vWorldPosition;

  uniform float uTime;
  uniform vec3 uSunDirection;
  uniform vec3 uDeepColor;
  uniform vec3 uHorizonColor;
  uniform vec3 uSunColor;

  // Invent a gently-rocking surface tilt at point p. Three sine waves
  // with different directions, sizes and speeds overlap — one alone
  // looks mechanical; three together look like water breathing.
  vec3 waveNormal(vec2 p, float t) {
    float slopeX = 0.0;
    float slopeZ = 0.0;

    slopeX += 0.22 * cos(p.x * 0.9  + p.y * 0.4  + t * 1.1);
    slopeZ += 0.22 * cos(p.y * 0.8  - p.x * 0.3  + t * 0.9);
    slopeX += 0.10 * cos(p.x * 2.3  - p.y * 1.1  + t * 1.7);
    slopeZ += 0.10 * cos(p.y * 2.9  + p.x * 1.3  - t * 1.4);
    slopeX += 0.05 * cos(p.x * 6.1  + p.y * 5.2  + t * 2.3);
    slopeZ += 0.05 * cos(p.y * 6.7  - p.x * 4.8  + t * 2.1);

    // A surface tilted by those slopes points in this direction:
    return normalize(vec3(-slopeX, 1.0, -slopeZ));
  }

  void main() {
    vec3 sunDir = normalize(uSunDirection);
    vec3 normal = waveNormal(vWorldPosition.xz * 0.5, uTime);

    // Which way is the camera from this pixel of water?
    vec3 toCamera = normalize(cameraPosition - vWorldPosition);

    // --- 1. Base water ---------------------------------------------
    float distance = length(vWorldPosition.xz - cameraPosition.xz);
    float horizonFade = smoothstep(60.0, 800.0, distance);
    vec3 color = mix(uDeepColor, uHorizonColor, horizonFade);

    // Water seen at a glancing angle mirrors the sky a little
    // (the "fresnel" effect) — lifts the surface, keeps it airy.
    float grazing = pow(1.0 - clamp(dot(toCamera, vec3(0.0, 1.0, 0.0)), 0.0, 1.0), 3.0);
    color = mix(color, uHorizonColor, grazing * 0.35);

    // --- 2. The sun path -------------------------------------------
    // How aligned is "camera → this pixel" with "toward the sun",
    // measured flat on the water? High power = a focused lane.
    vec2 towardPixel = normalize(vWorldPosition.xz - cameraPosition.xz);
    vec2 towardSun = normalize(sunDir.xz);
    float lane = pow(clamp(dot(towardPixel, towardSun), 0.0, 1.0), 16.0);
    color += uSunColor * lane * 0.22;

    // --- 3. Glints ---------------------------------------------------
    // Mirror the sun off the rocking surface; where the bounce heads
    // at the camera, the water flashes. The wave motion makes the
    // flashes wander and twinkle on their own.
    vec3 bounce = reflect(-sunDir, normal);
    float glint = pow(clamp(dot(bounce, toCamera), 0.0, 1.0), 120.0);
    // Calm the water near the island (up close the sparkles would look
    // like big white blobs); let it twinkle freely in the distance.
    float nearCalm = 0.25 + 0.75 * smoothstep(15.0, 80.0, distance);
    color += uSunColor * glint * nearCalm * (0.35 + 0.55 * lane);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function Ocean() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunDirection: {
        value: new THREE.Vector3(...SUNSET.SUN_DIRECTION).normalize(),
      },
      uDeepColor: { value: new THREE.Color(OCEAN.DEEP_COLOR) },
      uHorizonColor: { value: new THREE.Color(SUNSET.SKY_HORIZON) },
      uSunColor: { value: new THREE.Color(SUNSET.SUN_COLOR) },
    }),
    []
  );

  // Advance the water's clock every frame — this is the only thing
  // JavaScript does per frame; all the motion lives in the shader.
  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    // A plane is born vertical; rotate it flat and sink it to sea level.
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, OCEAN.LEVEL, 0]}>
      <planeGeometry args={[OCEAN.SIZE, OCEAN.SIZE]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
      />
    </mesh>
  );
}
