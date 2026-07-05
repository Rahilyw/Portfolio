/**
 * Hand-pixeled sprite maps. Legend per sprite; "." is transparent.
 * (The cursor surfer lives in surferSheet.ts and the islands / whale /
 * pirate ship in islandArt.ts — those are painted procedurally.)
 */

/* ---------- clouds, birds, shark fin ---------- */

export const cloudPalette: Record<string, string> = {
  W: "#ffffff",
  P: "#ffd9df",
};

export const cloudRows = [
  "......WWWW..........",
  "...WWWWWWWWW..WW....",
  ".WWWWWWWWWWWWWWWWW..",
  "WWWWWWWWWWWWWWWWWWW.",
  ".PPWWWWWWWWWWWWWPP..",
  "...PPPPPPPPPPPPP....",
];

export const birdPalette: Record<string, string> = {
  k: "#f8fafc",
};

export const birdRows = [
  "k...k",
  ".k.k.",
];

export const finPalette: Record<string, string> = {
  f: "#2d5a73",
  F: "#1d4257",
  W: "#ffffff",
};

export const finRows = [
  ".....f....",
  "....ff....",
  "...fff....",
  "..ffFf....",
  ".fffFf....",
  "ffffFff...",
  "W.......W.",
];
