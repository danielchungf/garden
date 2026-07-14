// ============================================================
// WORLD TUNING
//
// Every number that affects how the world FEELS lives here.
// Change a value, save, and the dev server hot-reloads it —
// this file is meant to be played with.
// ============================================================

export const PLAYER = {
  // Camera height above the ground, in meters. Human eye level.
  EYE_HEIGHT: 1.6,

  // Top walking speed in meters/second. 5 is a brisk walk.
  MOVE_SPEED: 5.0,

  // How quickly you reach top speed. This is a damping rate:
  // higher = snappier starts and stops, lower = floaty / ice-skaty.
  ACCELERATION: 10,

  // Fraction of ACCELERATION you keep while airborne. 1 would let you
  // steer mid-jump like on the ground; 0 would lock your arc entirely.
  AIR_CONTROL: 0.35,

  // Upward speed at the moment of a jump, in m/s.
  // Jump height works out to JUMP_VELOCITY² / (2 × GRAVITY) ≈ 1.1m.
  JUMP_VELOCITY: 7.0,

  // Downward acceleration in m/s². Deliberately stronger than Earth's
  // 9.8 — realistic gravity feels moon-like in games. 20–25 feels grounded.
  GRAVITY: 22,

  // Where you appear, as [x, y, z]. Faces -z by default, toward the cube.
  SPAWN: [0, 1.6, 8] as const,
};

export const ISLAND = {
  // Radius of the island's flat top.
  RADIUS: 16,

  // Invisible fence — the player can't walk past this radius. Slightly
  // inside RADIUS so you can peer over the edge but never tumble off.
  WALK_RADIUS: 15,
};

// ------------------------------------------------------------
// The sunset. The sun hangs low in the west over the ocean; the
// sky grades from orange at the horizon, through pink, to a soft
// lavender overhead. Every color here feeds both the sky shader
// and the ocean shader, so the scene always agrees with itself.
// ------------------------------------------------------------
export const SUNSET = {
  // Which way the sun is, as a direction from the island. Mostly -z
  // (which is where you face when you spawn), slightly to the left,
  // and just barely above the horizon.
  SUN_DIRECTION: [-0.22, 0.11, -1] as const,

  SKY_TOP: "#8d84c6",     // soft lavender, straight up
  SKY_MID: "#f591a3",     // pink, mid-height
  SKY_HORIZON: "#ffa563", // orange, right at the waterline
  SUN_COLOR: "#fff0c9",   // the sun's disc and its glints on the water

  // Fog only touches the island and objects (the sky and ocean shaders
  // opt out) — it melts their far edges into the sunset.
  FOG_COLOR: "#f9a06f",
  FOG_NEAR: 14,
  FOG_FAR: 70,
};

export const OCEAN = {
  LEVEL: -5,              // water height; the island's rock dips into it
  DEEP_COLOR: "#455493",  // the water's own indigo, away from the sun
  SIZE: 3000,             // width of the water plane (meters) — the horizon
};

export const TOOLTIP = {
  // The tooltip fades in when the camera gets closer than this (meters)...
  SHOW_DISTANCE: 3.5,

  // ...and fades out once you're farther than this. The gap between the
  // two means standing right at the boundary never makes it flicker.
  HIDE_DISTANCE: 4.3,
};

// Longest single frame step we'll simulate, in seconds. Browsers pause
// animation in background tabs; without this clamp, coming back after 10
// seconds would apply 10 seconds of gravity in one frame and teleport you.
export const MAX_DELTA = 0.05;
