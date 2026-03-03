"use client";

import { useRef, useEffect, useState } from "react";
import {
  PLANT_1_PALETTE,
  PLANT_1_GRID,
  PLANT_1_PRESS_PALETTE,
  PLANT_1_PRESS_GRID,
} from "./sprites";

const CANVAS_W = 75;
const CANVAS_H = 33;
const SPRITE_SIZE = 32;
const PLANT_ROWS = 24;
const GROUND_Y = 22;

// Sky gradient colors (RGB for interpolation)
const SKY_STOPS = [
  [11, 143, 214],   // top: deep blue
  [60, 186, 236],   // bottom: pale
];
const CLOUD_LIGHT = "#e8f4fb";
const CLOUD_MID = "#d6eef8";
const CLOUD_SHADOW = "#b0d8ee";

// Ground colors: clean simple bands
const GROUND_TOP = "#4a8a38";    // dark grass line
const SOIL_BAND_1 = "#8b6038";   // light soil
const SOIL_BAND_2 = "#7b5030";   // mid soil
const SOIL_BAND_3 = "#6b4228";   // dark soil

// Cloud shapes
const CLOUD_BIG = [
  "....LLLL.....",
  "..LLLLLLLL...",
  ".LLLLLLLLLL..",
  "LLLLLLLLLLLLL",
  ".MMMMMMMMMMM.",
  "..SSSSSSSSS..",
  "....SSSSS....",
];
const CLOUD_SMALL = [
  "..LLLL...",
  ".LLLLLLL.",
  "LLLLLLLLL",
  ".MMMMMMM.",
  "..SSSSS..",
];

const CLOUD_MED = [
  "...LLL...",
  ".LLLLLLL.",
  "LLLLLLLLL",
  "LLLLLLLLL",
  ".MMMMMMM.",
  "..SSSSS..",
];

// Shared wrap cycle so clouds maintain fixed spacing and never collide
const CLOUD_WRAP = CANVAS_W + 15; // 90px cycle
const CLOUD_SPEED = 1.8;
const CLOUDS = [
  { startX: 5, y: 2, shape: CLOUD_BIG },
  { startX: 35, y: 7, shape: CLOUD_SMALL },
  { startX: 65, y: 5, shape: CLOUD_MED },
];

function lerpColor(a: number[], b: number[], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

function drawCloudPixels(ctx: CanvasRenderingContext2D, cx: number, cy: number, shape: string[]) {
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[dy].length; dx++) {
      const px = cx + dx;
      if (px < 0 || px >= CANVAS_W) continue; // clip at canvas edges
      const ch = shape[dy][dx];
      if (ch === "L") ctx.fillStyle = CLOUD_LIGHT;
      else if (ch === "M") ctx.fillStyle = CLOUD_MID;
      else if (ch === "S") ctx.fillStyle = CLOUD_SHADOW;
      else continue;
      ctx.fillRect(px, cy + dy, 1, 1);
    }
  }
}

function drawEnvironment(ctx: CanvasRenderingContext2D, time: number) {
  // Sky — clean gradient with minimal noise
  for (let y = 0; y < GROUND_Y; y++) {
    const t = Math.min(y / (GROUND_Y - 1), 1);
    const segment = t * (SKY_STOPS.length - 1);
    const i = Math.min(Math.floor(segment), SKY_STOPS.length - 2);
    const frac = segment - i;
    ctx.fillStyle = lerpColor(SKY_STOPS[i], SKY_STOPS[i + 1], frac);
    // Draw entire row at once — no per-pixel noise
    ctx.fillRect(0, y, CANVAS_W, 1);
  }

  // Clouds — drifting left to right, shared wrap cycle
  for (const cloud of CLOUDS) {
    const rawX = cloud.startX + time * CLOUD_SPEED;
    const cx = Math.floor(((rawX % CLOUD_WRAP) + CLOUD_WRAP) % CLOUD_WRAP - 15);
    drawCloudPixels(ctx, cx, cloud.y, cloud.shape);
  }

  // Ground — clean horizontal bands
  // Row 1: dark grass line at GROUND_Y
  ctx.fillStyle = GROUND_TOP;
  ctx.fillRect(0, GROUND_Y, CANVAS_W, 1);

  // Row 2: slightly lighter grass
  ctx.fillStyle = "#5a9a42";
  ctx.fillRect(0, GROUND_Y + 1, CANVAS_W, 1);

  // Soil bands — simple flat fills, no noise
  const soilStart = GROUND_Y + 2;
  const soilColors = [SOIL_BAND_1, SOIL_BAND_1, SOIL_BAND_2, SOIL_BAND_2, SOIL_BAND_3, SOIL_BAND_3, SOIL_BAND_3, SOIL_BAND_3, SOIL_BAND_3];
  for (let y = soilStart; y < CANVAS_H; y++) {
    const idx = Math.min(y - soilStart, soilColors.length - 1);
    ctx.fillStyle = soilColors[idx];
    ctx.fillRect(0, y, CANVAS_W, 1);
  }
}

// Check if a color is sky/background (blue-dominant)
function isSkyColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return b > 180 && g > 150;
}

function drawPlantSprite(
  ctx: CanvasRenderingContext2D,
  grid: string[],
  palette: Record<string, string>,
  time: number
) {
  const scaledW = SPRITE_SIZE / 2;
  const scaledH = PLANT_ROWS / 2;
  const offsetX = Math.floor((CANVAS_W - scaledW) / 2);
  const stemScaledRow = 11;
  const offsetY = GROUND_Y - stemScaledRow;

  // Sway: gentle sine oscillation, ±1px, ~2.5s period
  const swayPhase = Math.sin(time * (2 * Math.PI / 2.5));

  for (let dy = 0; dy < scaledH; dy++) {
    // Per-row sway offset: 0 at bottom (stem base), max at top (leaves)
    const swayT = Math.max(0, 1 - dy / (scaledH - 1)); // 1 at top, 0 at bottom
    const swayOffset = Math.round(swayPhase * swayT);

    for (let dx = 0; dx < scaledW; dx++) {
      let fillColor: string | null = null;

      for (let sy = 0; sy < 2; sy++) {
        for (let sx = 0; sx < 2; sx++) {
          const srcY = dy * 2 + sy;
          const srcX = dx * 2 + sx;
          if (srcY >= PLANT_ROWS || srcX >= SPRITE_SIZE) continue;
          const ch = grid[srcY]?.[srcX];
          if (!ch) continue;
          const color = palette[ch];
          if (!color || isSkyColor(color)) continue;
          if (!fillColor) {
            fillColor = color;
          }
        }
      }

      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(offsetX + dx + swayOffset, offsetY + dy, 1, 1);
      }
    }
  }
}

export function PixelPlantCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pressed, setPressed] = useState(false);
  const pressedRef = useRef(false);
  const animRef = useRef<number>(0);

  // Keep a ref in sync so the animation loop always has the latest value
  useEffect(() => {
    pressedRef.current = pressed;
  }, [pressed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      drawEnvironment(ctx, elapsed);

      const grid = pressedRef.current ? PLANT_1_PRESS_GRID : PLANT_1_GRID;
      const palette = pressedRef.current ? PLANT_1_PRESS_PALETTE : PLANT_1_PALETTE;
      drawPlantSprite(ctx, grid, palette, elapsed);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      className="select-none rounded-lg"
      style={{
        width: 600,
        height: 264,
        imageRendering: "pixelated",
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    />
  );
}
