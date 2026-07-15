"use client";

// The first-person controller — the heart of this whole prototype.
//
// Split of responsibilities:
//   - LOOKING is handled by drei's <PointerLockControls>. The Pointer Lock
//     browser API is full of quirks (re-lock cooldowns, vendor errors,
//     clamping pitch so you can't somersault) and drei handles all of it.
//   - MOVING is hand-rolled below, because that's where all the feel lives:
//     eased acceleration, fake gravity, a jump, and an invisible fence at
//     the island's rim. No physics engine — just a few lines of math.
//
// All the tunable numbers live in constants.ts.

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { PLAYER, LAND, MAX_DELTA } from "./constants";

// Scratch vectors for the frame loop, allocated once at module load.
// Never call `new` inside useFrame — allocating 60 times a second
// creates garbage-collector stutter.
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const wishDir = new THREE.Vector3();

interface PlayerControllerProps {
  onLockChange: (locked: boolean) => void;
}

export default function PlayerController({
  onLockChange,
}: PlayerControllerProps) {
  // Which keys are held right now. A ref, not state — this changes many
  // times per second and must never trigger React re-renders.
  const keys = useRef<Record<string, boolean>>({});

  // Whether the pointer is locked, mirrored into a ref so the frame loop
  // can read it without re-subscribing.
  const isLocked = useRef(false);

  // The player's velocity in m/s, persisted across frames.
  const velocity = useRef(new THREE.Vector3());

  // Are we standing on the ground (vs. mid-jump)?
  const grounded = useRef(true);

  useEffect(() => {
    // e.code ("KeyW", "Space") names the physical key, so this works on
    // any keyboard layout, unlike e.key which changes with Shift/AZERTY.
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      // Space would otherwise scroll the page.
      if (e.code === "Space") e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((state, delta) => {
    // Clamp the frame step: after a backgrounded tab, delta can be huge,
    // and applying 10s of gravity at once would teleport the player.
    const dt = Math.min(delta, MAX_DELTA);
    const cam = state.camera;
    const k = keys.current;

    // 1. Camera-relative ground axes. We flatten the look direction onto
    //    the XZ plane so that looking up at the sky doesn't slow walking.
    cam.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, cam.up).normalize();

    // 2. Where the player WANTS to go, from held keys. Normalized so
    //    walking diagonally isn't √2 faster. Ignored while the entry
    //    overlay is up, so the world sits still behind it.
    wishDir.set(0, 0, 0);
    if (isLocked.current) {
      if (k.KeyW || k.ArrowUp) wishDir.add(forward);
      if (k.KeyS || k.ArrowDown) wishDir.sub(forward);
      if (k.KeyD || k.ArrowRight) wishDir.add(right);
      if (k.KeyA || k.ArrowLeft) wishDir.sub(right);
      if (wishDir.lengthSq() > 0) wishDir.normalize();
    }

    // 3. Ease the horizontal velocity toward the wish. The exponential
    //    form makes the feel identical at 30fps and 144fps. Less steering
    //    is available mid-air (AIR_CONTROL), which makes jumps feel real.
    const rate =
      PLAYER.ACCELERATION * (grounded.current ? 1 : PLAYER.AIR_CONTROL);
    const t = 1 - Math.exp(-rate * dt);
    velocity.current.x += (wishDir.x * PLAYER.MOVE_SPEED - velocity.current.x) * t;
    velocity.current.z += (wishDir.z * PLAYER.MOVE_SPEED - velocity.current.z) * t;

    // 4. Jump + gravity. (Holding Space auto-hops on every landing —
    //    that's deliberate, it feels playful.)
    if (k.Space && grounded.current && isLocked.current) {
      velocity.current.y = PLAYER.JUMP_VELOCITY;
      grounded.current = false;
    }
    velocity.current.y -= PLAYER.GRAVITY * dt;

    // 5. Move the camera by this frame's velocity.
    cam.position.addScaledVector(velocity.current, dt);

    // 6. Ground clamp — the island top is flat at y = 0, so the camera
    //    rests exactly at eye height.
    if (cam.position.y <= PLAYER.EYE_HEIGHT) {
      cam.position.y = PLAYER.EYE_HEIGHT;
      velocity.current.y = 0;
      grounded.current = true;
    }

    // 7. Invisible fences. West: stop just before the cliff edge so you
    //    can stand at the brink and look down at the sea. Everywhere
    //    else: a wide boundary long before the land visibly ends.
    //    Each axis clamps independently, so you slide along the fence
    //    instead of sticking to it.
    cam.position.z = Math.min(
      Math.max(cam.position.z, LAND.COAST_Z + LAND.CLIFF_MARGIN),
      LAND.EXTENT
    );
    cam.position.x = Math.min(
      Math.max(cam.position.x, -LAND.EXTENT),
      LAND.EXTENT
    );
  });

  return (
    <PointerLockControls
      // Clicking the overlay's button (which has this id) requests pointer
      // lock — no onClick wiring needed anywhere.
      selector="#enter-world"
      onLock={() => {
        isLocked.current = true;
        onLockChange(true);
      }}
      onUnlock={() => {
        isLocked.current = false;
        onLockChange(false);
      }}
    />
  );
}
