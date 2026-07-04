/**
 * Hand-pixeled sprite maps. Legend per sprite; "." is transparent.
 * (The cursor surfer is painted procedurally in surferSheet.ts.)
 */

/* ---------- islands ---------- */

export const islandPalette: Record<string, string> = {
  // sand
  s: "#f2dfae",
  S: "#dcc084",
  // palm
  k: "#8a5a2a",
  f: "#1f9e4c",
  F: "#27c45e",
  o: "#6b4226",
  // mountain
  r: "#6b7688",
  R: "#525c72",
  n: "#f5f9ff",
  p: "#ff4d6d",
  // lighthouse
  W: "#f8fafc",
  d: "#e0342f",
  y: "#ffd23e",
  D: "#1e293b",
  // volcano
  v: "#7a3b1e",
  V: "#98552b",
  l: "#ff5a2a",
  L: "#ffab2a",
  m: "#cfd8e3",
  // hut
  u: "#a4642a",
  U: "#7c491d",
  a: "#caa04a",
  A: "#a87e2f",
  // bottle
  c: "#a8ecf2",
  C: "#7fd9e4",
  P: "#ffe9b8",
  q: "#d6b26e",
};

const sandBase = [
  "......ssssssssssssss......",
  "...ssssssssssssssssssss...",
  "..sssssssssssssssssssssS..",
  "...SSSSSSSSSSSSSSSSSSSS...",
];

export const islandRows: Record<string, string[]> = {
  palm: [
    ".....FFFF....FFFF.........",
    "...FFffffFFFFffffFF.......",
    "..FfffffFFffFFfffffF......",
    "..Fff..FFffffFF..ffF......",
    "........Fkkf..............",
    ".....o..okk.o.............",
    ".........kk...............",
    ".........kk...............",
    "........kkk...............",
    "........kk................",
    ...sandBase,
  ],
  mountain: [
    "...........pp.............",
    "...........kpp............",
    "...........k..............",
    "..........nnn.............",
    ".........nnnnn............",
    "........rrnnnrr...........",
    ".......rrrrrrrrr..........",
    "......rrrrRRrrrrr.........",
    ".....rrrRRRRRRrrrr........",
    "....rrrrRRRRRRRrrrrr......",
    ...sandBase,
  ],
  lighthouse: [
    "..........ddd.............",
    ".........ddddd............",
    ".........DyyyD............",
    ".........DyyyD............",
    ".........WWWWW............",
    ".........ddddd............",
    ".........WWWWW............",
    ".........ddddd............",
    ".........WWWWW............",
    "........WWWWWWW...........",
    ...sandBase,
  ],
  volcano: [
    "........mm..mmm...........",
    ".......mmmm.mmmm..........",
    "........m.....m...........",
    ".........lLLl.............",
    "........vlLlv.............",
    ".......vvlvvlv............",
    "......vvVlvvVvv...........",
    ".....vvVVlvvVVvvv.........",
    "....vvVVVvvvvVVvvv........",
    "...vvvVVVVvvvVVVvvvv......",
    ...sandBase,
  ],
  hut: [
    "........aaaaaa............",
    ".......aaaaaaaa...........",
    "......aAAAAAAAAa..........",
    ".....aaaaaaaaaaaa.........",
    "......uuuuuuuuuu..........",
    "......uUUuuuuyyu...yy.....",
    "......uUUuuuuyyu...yy.....",
    "......uUUuuuuuuu....y.....",
    "......uuuuuuuuuu...yyy....",
    ...sandBase,
  ],
  bottle: [
    "..........uu..............",
    "..........uu..............",
    ".........cccc.............",
    ".........cccc.............",
    "........cCcccc............",
    ".......cCcccccc...........",
    ".......cCPPPPcc...........",
    ".......cCPqqPcc...........",
    ".......cCPPPPcc...........",
    ".......cCPqqPcc...........",
    ".......cCPPPPcc...........",
    "........cccccc............",
    ".....W..........W.........",
    "....WW..........WW........",
  ],
};

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
