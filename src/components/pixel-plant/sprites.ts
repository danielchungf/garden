// Palette: each character in the grid maps to a hex color
// Hand-crafted Stardew Valley-inspired sapling (32×32, top 24 rows rendered)

// Palette: . = sky (transparent), O = outline, D = dark green, M = mid green,
// L = light/highlight green, S = stem brown, B = stem highlight, R = root dark
export const PLANT_1_PALETTE: Record<string, string> = {
  ".": "#03a6eb", // sky (will be treated as transparent)
  O: "#2d5a1e",   // dark outline
  D: "#3a7a28",   // dark green
  M: "#5aaa3a",   // mid green
  L: "#8eda56",   // highlight green
  S: "#6b4225",   // stem brown
  B: "#8b6040",   // stem highlight
  R: "#4b2312",   // root dark
};

export const PLANT_1_GRID = [
  // Row 0-7: sky / top of canopy
  "................................",
  "................................",
  "..............OOO...............",
  ".............OMLLO..............",
  "............OMLLLO..............",
  "...........OMLLMMO..............",
  "......OOO..OMLLDMO..............",
  ".....OMLLO.OMMDMO...............",
  // Row 8-11: main canopy
  "....OMLLLOOOMMMO....OOO.........",
  "...OMLLMMDOODMO....OMLLO........",
  "..OMLLMMDDDOMO....OMLMLO........",
  "..OMMDDDMMOOO..OOOMMDDMO........",
  // Row 12-15: lower canopy + stem top
  "...OMMDMOO....OMLLLMDDMO........",
  "....OOOO.....OMLLMMDMOO.........",
  "..........OOMMLLDDDMOO..........",
  "..........OMMDDDMMOOO...........",
  // Row 16-19: stem
  "...........OMMMMOO..............",
  "............OSSO................",
  "............OBSO................",
  "............OSSO................",
  // Row 20-23: stem base / roots
  "............OSSO................",
  "............OBSO................",
  "...........OSSSO................",
  "..........OORRRO................",
];

export const PLANT_1_PRESS_PALETTE: Record<string, string> = {
  ".": "#03a6eb",
  O: "#2d5a1e",
  D: "#3a7a28",
  M: "#5aaa3a",
  L: "#8eda56",
  S: "#6b4225",
  B: "#8b6040",
  R: "#4b2312",
};

// Press state: squished down — canopy wider and shorter, stem compressed
export const PLANT_1_PRESS_GRID = [
  // Row 0-5: sky
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  // Row 6-9: squished canopy (wider, lower)
  ".....OOO.....OOO................",
  "....OMLLOOOOMMLLO...............",
  "...OMLLMMDMMLLLMO...OOO.........",
  "..OMLLMMDDDDLMMO..OMLLLO........",
  // Row 10-13: lower canopy
  "..OMMDDDDDDMMMOOOOMLLMMO........",
  "...OMMDDDMMMOOOMLLLMDDMO........",
  "....OOMMMOOO..OMLLMMDMOO........",
  "..........OOMMLLDDDMOO..........",
  // Row 14-17: compressed stem area
  "..........OMMDDDMMOOO...........",
  "...........OMMMMOO..............",
  "............OSSO................",
  "............OBSO................",
  // Row 18-23: stem base (shorter)
  "............OSSO................",
  "............OSSO................",
  "............OBSO................",
  "...........OSSSO................",
  "..........OOSSSO................",
  "..........OORRRO................",
];
