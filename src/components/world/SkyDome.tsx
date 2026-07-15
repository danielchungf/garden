"use client";

// The sunset sky: a huge sphere we stand inside, painted by a small
// shader. Shaders are programs that run on the GPU for every pixel;
// this one decides each pixel's color from two things:
//
//   1. How HIGH the pixel is in the sky → a three-stop gradient
//      (orange at the horizon → pink → lavender overhead).
//   2. How CLOSE the pixel is to the sun's direction → a soft warm
//      halo, and inside that, the sun's bright disc.
//
// The dome ignores scene fog (the gradient IS the atmosphere).

import { useMemo } from "react";
import * as THREE from "three";
import { SUNSET } from "./constants";
import { SKY_GRADIENT_GLSL } from "./skyGradient";

const VERTEX = /* glsl */ `
  // Runs once per corner of the sphere. Passes the direction of that
  // corner (from the center, where the viewer stands) to the fragment
  // shader below, which fills in every pixel between corners.
  varying vec3 vDirection;

  void main() {
    vDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vDirection;

  uniform vec3 uTopColor;
  uniform vec3 uMidColor;
  uniform vec3 uHorizonColor;
  uniform vec3 uSunColor;
  uniform vec3 uSunDirection;

  ${SKY_GRADIENT_GLSL}

  void main() {
    vec3 dir = normalize(vDirection);
    vec3 sunDir = normalize(uSunDirection);

    // The gradient + the sun's halo (shared with the ocean, which
    // reflects this exact same sky — see skyGradient.ts).
    vec3 color = skyGradient(
      dir, sunDir, uTopColor, uMidColor, uHorizonColor, uSunColor
    );

    // The sun's disc itself: oversized (a real sun is ~0.5° across;
    // this one is ~4°) because sunsets remember bigger than they are.
    float towardSun = clamp(dot(dir, sunDir), 0.0, 1.0);
    color += uSunColor * smoothstep(0.9975, 0.9987, towardSun) * 1.1;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function SkyDome() {
  // Uniforms are the knobs the shader exposes to JavaScript. Built once;
  // colors come straight from constants.ts.
  const uniforms = useMemo(
    () => ({
      uTopColor: { value: new THREE.Color(SUNSET.SKY_TOP) },
      uMidColor: { value: new THREE.Color(SUNSET.SKY_MID) },
      uHorizonColor: { value: new THREE.Color(SUNSET.SKY_HORIZON) },
      uSunColor: { value: new THREE.Color(SUNSET.SUN_COLOR) },
      uSunDirection: {
        value: new THREE.Vector3(...SUNSET.SUN_DIRECTION).normalize(),
      },
    }),
    []
  );

  return (
    <mesh>
      {/* Radius must sit inside the camera's far plane. Low segment
          counts are fine — the gradient happens per-pixel, not per-vertex. */}
      <sphereGeometry args={[900, 32, 16]} />
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        // BackSide: paint the INSIDE of the sphere — we live in it.
        side={THREE.BackSide}
        // The sky is behind everything; never block other objects.
        depthWrite={false}
      />
    </mesh>
  );
}
