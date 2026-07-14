"use client";

// Sumi: a small fluffy grey-brown tabby, built entirely from spheres,
// cones and cylinders. She sits near the bluff, facing the sunset.
//
// The likeness strategy (since primitives can't do fur or stripes):
// get the SILHOUETTE and the COLOR MAP right and the brain does the
// rest. Sumi's silhouette: big ears for her head, upright fluffy
// chest, tail curled around her side. Her color map: warm grey-brown
// coat, a darker mantle over the back, cream chest and paws, and a
// dark chocolate tail tip.

import ProximityTooltip from "./ProximityTooltip";

// Where she sits (a short walk from spawn, silhouetted against the sea).
const AT: [number, number, number] = [4, 0, -3];

// Sumi's palette, from her photos.
const COAT = "#9a8672";   // warm grey-brown base
const MANTLE = "#6b5a4b"; // the darker tabby back
const CREAM = "#d8c3a5";  // chest ruff, muzzle, paws
const DARK = "#413528";   // tail tip and ear tips
const EYE = "#7a8c52";    // hazel-green

// Every part shares these so she stays cohesively low-poly.
function Fur({ color }: { color: string }) {
  return <meshStandardMaterial color={color} flatShading />;
}

export default function SumiCat() {
  return (
    <>
      <group position={AT} rotation={[0, -0.2, 0]}>
      {/* Haunches — the round rear she sits on. */}
      <mesh position={[0, 0.2, 0.08]} scale={[1, 0.85, 1.1]} castShadow>
        <sphereGeometry args={[0.2, 12, 9]} />
        <Fur color={COAT} />
      </mesh>

      {/* The darker mantle draped over her back. */}
      <mesh position={[0, 0.27, 0.07]} scale={[0.85, 0.8, 1.02]} castShadow>
        <sphereGeometry args={[0.195, 12, 9]} />
        <Fur color={MANTLE} />
      </mesh>

      {/* Chest, leaning tall and upright. */}
      <mesh position={[0, 0.3, -0.1]} scale={[0.95, 1.15, 0.95]} castShadow>
        <sphereGeometry args={[0.16, 12, 9]} />
        <Fur color={COAT} />
      </mesh>

      {/* The cream ruff puffing out of her front. */}
      <mesh position={[0, 0.27, -0.18]} castShadow>
        <sphereGeometry args={[0.105, 12, 9]} />
        <Fur color={CREAM} />
      </mesh>

      {/* Head. */}
      <mesh position={[0, 0.5, -0.14]} scale={[1, 0.95, 0.95]} castShadow>
        <sphereGeometry args={[0.125, 12, 9]} />
        <Fur color={COAT} />
      </mesh>

      {/* Muzzle. */}
      <mesh position={[0, 0.465, -0.235]} scale={[1.1, 0.75, 0.85]}>
        <sphereGeometry args={[0.045, 10, 8]} />
        <Fur color={CREAM} />
      </mesh>

      {/* Nose. */}
      <mesh position={[0, 0.483, -0.28]}>
        <sphereGeometry args={[0.012, 8, 6]} />
        <Fur color="#a7756a" />
      </mesh>

      {/* Eyes — hazel-green, set wide. */}
      <mesh position={[-0.05, 0.525, -0.243]}>
        <sphereGeometry args={[0.023, 8, 6]} />
        <Fur color={EYE} />
      </mesh>
      <mesh position={[0.05, 0.525, -0.243]}>
        <sphereGeometry args={[0.023, 8, 6]} />
        <Fur color={EYE} />
      </mesh>

      {/* Ears — comically big, like the photos. Tilted outward. */}
      <mesh position={[-0.08, 0.63, -0.1]} rotation={[-0.15, 0, 0.3]} castShadow>
        <coneGeometry args={[0.05, 0.12, 7]} />
        <Fur color={MANTLE} />
      </mesh>
      <mesh position={[0.08, 0.63, -0.1]} rotation={[-0.15, 0, -0.3]} castShadow>
        <coneGeometry args={[0.05, 0.12, 7]} />
        <Fur color={MANTLE} />
      </mesh>

      {/* Front legs, straight and prim, close together. */}
      <mesh position={[-0.055, 0.13, -0.16]} castShadow>
        <cylinderGeometry args={[0.032, 0.032, 0.26, 8]} />
        <Fur color={COAT} />
      </mesh>
      <mesh position={[0.055, 0.13, -0.16]} castShadow>
        <cylinderGeometry args={[0.032, 0.032, 0.26, 8]} />
        <Fur color={COAT} />
      </mesh>

      {/* Paws. */}
      <mesh position={[-0.055, 0.03, -0.18]}>
        <sphereGeometry args={[0.042, 8, 6]} />
        <Fur color={CREAM} />
      </mesh>
      <mesh position={[0.055, 0.03, -0.18]}>
        <sphereGeometry args={[0.042, 8, 6]} />
        <Fur color={CREAM} />
      </mesh>

      {/* Tail: three overlapping puffs curling around her right side,
          darkening to the chocolate tip. */}
      <mesh position={[0.16, 0.07, 0.15]} castShadow>
        <sphereGeometry args={[0.06, 10, 8]} />
        <Fur color={COAT} />
      </mesh>
      <mesh position={[0.23, 0.06, 0.06]} castShadow>
        <sphereGeometry args={[0.055, 10, 8]} />
        <Fur color={MANTLE} />
      </mesh>
      <mesh position={[0.26, 0.055, -0.03]} castShadow>
        <sphereGeometry args={[0.05, 10, 8]} />
        <Fur color={MANTLE} />
      </mesh>
      <mesh position={[0.27, 0.05, -0.11]} castShadow>
        <sphereGeometry args={[0.045, 10, 8]} />
        <Fur color={DARK} />
      </mesh>
      </group>

      {/* Her tooltip floats just overhead. It lives OUTSIDE the rotated
          group because it anchors in world coordinates. */}
      <ProximityTooltip position={[AT[0], 1.0, AT[2]]}>
        sumi. supervising the sunset.
      </ProximityTooltip>
    </>
  );
}
