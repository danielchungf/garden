"use client";

// The ocean: one huge flat plane, brought alive entirely by a shader.
// The water never actually moves — instead, for every pixel, we invent
// a tiny rocking "wave normal" (which way the surface tilts) from a few
// overlapping sine waves, and tilt it over time. Light bouncing off
// those imaginary tilts is what reads as glints and shimmer.
//
// The big idea: water is a soft MIRROR of the sky. For every pixel we
// bounce the viewing ray off the surface and ask the shared skyGradient
// "what color is the sky over there?" — so the pink and orange spread
// across the whole sea, not just near the sun. How mirror-like the
// water is follows the Fresnel rule: nearly a mirror at a glancing
// look (the distance), more its own indigo when you look straight
// down into it (at your feet).

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SUNSET, OCEAN } from "./constants";
import { SKY_GRADIENT_GLSL } from "./skyGradient";

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
  uniform vec3 uTopColor;
  uniform vec3 uMidColor;
  uniform vec3 uHorizonColor;
  uniform vec3 uSunColor;

  ${SKY_GRADIENT_GLSL}

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
    vec3 toCamera = normalize(cameraPosition - vWorldPosition);
    float distance = length(vWorldPosition.xz - cameraPosition.xz);

    // The waves flatten out with distance. Partly realism (far water
    // reads calm), mostly craft: far away, one screen pixel covers many
    // wave crests, and sampling that with full-strength waves turns the
    // horizon into flickering noise. Flat far water = a clean mirror.
    vec3 normal = waveNormal(vWorldPosition.xz * 0.5, uTime);
    float calm = smoothstep(25.0, 140.0, distance);
    normal = normalize(mix(normal, vec3(0.0, 1.0, 0.0), calm));

    // --- 1. The sky, mirrored ---------------------------------------
    // Bounce the view ray off the rocking surface and look up the sky's
    // color in that direction. abs() keeps the bounce above the horizon
    // (water can only reflect sky, never the void beneath it).
    vec3 bounced = reflect(-toCamera, normal);
    bounced.y = abs(bounced.y);
    vec3 skyMirror = skyGradient(
      bounced, sunDir, uTopColor, uMidColor, uHorizonColor, uSunColor
    );

    // Fresnel: how mirror-like is this pixel? Glancing look (far water)
    // → almost pure mirror; steep look (near your feet) → mostly the
    // water's own deep color.
    float steepness = clamp(dot(toCamera, normal), 0.0, 1.0);
    float mirrorAmount = 0.08 + 0.92 * pow(1.0 - steepness, 3.0);
    vec3 color = mix(uDeepColor, skyMirror, mirrorAmount);

    // --- 2. The sun path --------------------------------------------
    // A gentle extra warmth in the lane toward the sun — wide and soft;
    // the mirrored sky already does most of this work.
    vec2 towardPixel = normalize(vWorldPosition.xz - cameraPosition.xz);
    vec2 towardSun = normalize(sunDir.xz);
    float lane = pow(clamp(dot(towardPixel, towardSun), 0.0, 1.0), 8.0);
    // A sun path only exists off toward the horizon. For water nearly
    // beneath you the horizontal direction is meaningless, and without
    // this fade the lane paints a fake light-beam at the shore's base
    // (like a reflector inside a pool).
    lane *= smoothstep(10.0, 40.0, distance);
    color += uSunColor * lane * 0.10;

    // --- 3. Glints ---------------------------------------------------
    // Mirror the sun off the rocking surface; where the bounce heads
    // at the camera, the water flashes. This plays the role of the
    // sun-disc's reflection, so it stays strongest inside the lane.
    vec3 sunBounce = reflect(-sunDir, normal);
    float glint = pow(clamp(dot(sunBounce, toCamera), 0.0, 1.0), 90.0);
    // Calm the sparkle near the shore so it doesn't turn into big
    // white blobs right below you; let it twinkle in the distance.
    float nearCalm = 0.2 + 0.8 * smoothstep(15.0, 80.0, distance);
    color += uSunColor * glint * nearCalm * (0.25 + 0.5 * lane);

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
      uTopColor: { value: new THREE.Color(SUNSET.SKY_TOP) },
      uMidColor: { value: new THREE.Color(SUNSET.SKY_MID) },
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
