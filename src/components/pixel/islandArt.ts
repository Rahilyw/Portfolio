/**
 * Procedural painters for the ocean-scene sprites: the section islands
 * (including the pirate ship that fronts the Education section) plus the
 * standalone whale sprite.
 *
 * Same pipeline as the cursor surfer (surferSheet.ts): every sprite is drawn
 * with canvas vector shapes at 4x supersample, downscaled to its art-pixel
 * grid (which bakes in soft anti-aliasing and shading), then displayed at 2x
 * with nearest-neighbor upscaling so it stays chunky and pixelated.
 */

const SS = 4; // supersample factor

export type SpriteVariant =
  | "volcano"
  | "lighthouse"
  | "palm"
  | "mountain"
  | "hut"
  | "bottle"
  | "whale"
  | "ship";

/** Art-pixel canvas size per sprite. */
export const SPRITE_SIZES: Record<SpriteVariant, [number, number]> = {
  volcano: [120, 90],
  lighthouse: [120, 90],
  palm: [120, 90],
  mountain: [120, 90],
  hut: [120, 90],
  bottle: [48, 64],
  whale: [68, 48],
  ship: [152, 124],
};

/**
 * Display scale: art pixels → CSS pixels (nearest-neighbor). The ship uses a
 * denser art grid shown at a smaller multiple, so it keeps its on-screen size
 * but gets a much finer pixel resolution.
 */
export const DISPLAY_SCALE: Record<SpriteVariant, number> = {
  volcano: 2,
  lighthouse: 2,
  palm: 2,
  mountain: 2,
  hut: 2,
  bottle: 2,
  whale: 2,
  ship: 1.5,
};

/**
 * Islands are painted in a 96x72 coordinate space but rasterized onto a
 * 120x90 grid (1.25x) — the same shapes land on a denser pixel grid, which
 * is what gives the fine-grained "super detailed" pixel look.
 */
const DRAW_SCALE: Record<SpriteVariant, number> = {
  volcano: 1.25,
  lighthouse: 1.25,
  palm: 1.25,
  mountain: 1.25,
  hut: 1.25,
  bottle: 1,
  whale: 1,
  ship: 1.8,
};

const TAU = Math.PI * 2;

/** Deterministic hash → [0,1). */
export function rnd(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export type Ctx = CanvasRenderingContext2D;

export function dot(g: Ctx, x: number, y: number, r: number, color: string, alpha = 1) {
  g.globalAlpha = alpha;
  g.fillStyle = color;
  g.beginPath();
  g.arc(x, y, r, 0, TAU);
  g.fill();
  g.globalAlpha = 1;
}

export function poly(g: Ctx, pts: number[][], color: string, alpha = 1) {
  g.globalAlpha = alpha;
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  g.closePath();
  g.fill();
  g.globalAlpha = 1;
}

export function stroke(g: Ctx, pts: number[][], w: number, color: string, alpha = 1) {
  g.globalAlpha = alpha;
  g.strokeStyle = color;
  g.lineWidth = w;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  g.stroke();
  g.globalAlpha = 1;
}

/** Scatter fine texture pixels inside an ellipse — dithered pixel shading. */
export function speckle(
  g: Ctx,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  color: string,
  count: number,
  alpha: number,
  seed: number
) {
  for (let i = 0; i < count; i++) {
    const a = rnd(seed + i * 3.7) * TAU;
    const r = Math.sqrt(rnd(seed + i * 7.1));
    dot(g, cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r, 0.42, color, alpha);
  }
}

/* --------------------------- shared scenery --------------------------- */

/** Turquoise shallows + foam ring + shaded sand mound at the waterline. */
function sandBase(g: Ctx, cx: number, wy: number, rx: number, sandy = true) {
  // shallow-water glow rings
  g.globalAlpha = 0.4;
  g.fillStyle = "#7ce8ec";
  g.beginPath();
  g.ellipse(cx, wy + 1.5, rx + 8, 7.5, 0, 0, TAU);
  g.fill();
  g.globalAlpha = 0.2;
  g.beginPath();
  g.ellipse(cx, wy + 2, rx + 13, 9.5, 0, 0, TAU);
  g.fill();
  g.globalAlpha = 1;

  // sand (or rock) mound
  const grad = g.createLinearGradient(0, wy - 10, 0, wy + 5);
  if (sandy) {
    grad.addColorStop(0, "#f8ecc0");
    grad.addColorStop(0.6, "#eeda9e");
    grad.addColorStop(1, "#d3b26e");
  } else {
    grad.addColorStop(0, "#93806a");
    grad.addColorStop(1, "#6a594a");
  }
  g.fillStyle = grad;
  g.beginPath();
  g.ellipse(cx, wy - 1.5, rx, 7.5, 0, 0, TAU);
  g.fill();
  g.beginPath();
  g.ellipse(cx, wy - 4.5, rx * 0.85, 6, 0, 0, TAU);
  g.fill();

  // wet-sand rim right at the waterline
  g.globalAlpha = 0.5;
  g.strokeStyle = sandy ? "#c7a259" : "#4a3e32";
  g.lineWidth = 1.4;
  g.beginPath();
  g.ellipse(cx, wy + 0.6, rx * 0.99, 6.8, 0, 0.1 * Math.PI, 0.9 * Math.PI);
  g.stroke();
  g.globalAlpha = 1;

  // dithered beach texture — grain speckles, denser toward the edge
  // (surf foam itself is animated separately, see drawSplashSheet)
  speckle(g, cx, wy - 1, rx * 0.9, 5.5, sandy ? "#c19a58" : "#3d332a", 26, 0.55, cx * 3.1);
  speckle(g, cx, wy - 3, rx * 0.65, 3.5, sandy ? "#fdf4d4" : "#8d7a64", 14, 0.7, cx * 7.7);
  // tiny shells / pebbles
  for (let i = 0; i < 5; i++) {
    dot(
      g,
      cx - rx * 0.6 + rnd(i * 5.9 + cx) * rx * 1.2,
      wy - 0.5 + rnd(i * 2.3) * 2.5,
      0.55,
      i % 2 ? (sandy ? "#fff6dc" : "#9a8871") : (sandy ? "#d98f7a" : "#31281f"),
      0.85
    );
  }
}

/** Scalloped grass cap on top of the sand. */
function grassTop(g: Ctx, cx: number, cy: number, rx: number, ry: number) {
  const grad = g.createLinearGradient(0, cy - ry, 0, cy + ry);
  grad.addColorStop(0, "#4ecb63");
  grad.addColorStop(1, "#1f8f43");
  g.fillStyle = grad;
  g.beginPath();
  g.ellipse(cx, cy, rx, ry, 0, 0, TAU);
  g.fill();
  // scalloped edge bumps
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    dot(g, cx + Math.cos(a) * rx * 0.95, cy + Math.sin(a) * ry * 0.95, 1.8, "#3bbc57", 1);
  }
  // shadow under the lip
  g.globalAlpha = 0.35;
  g.strokeStyle = "#12662e";
  g.lineWidth = 1;
  g.beginPath();
  g.ellipse(cx, cy + 0.8, rx * 0.96, ry, 0, 0.15 * Math.PI, 0.85 * Math.PI);
  g.stroke();
  g.globalAlpha = 1;
  // grass blade tufts + dithered texture
  for (let i = 0; i < 9; i++) {
    const tx = cx - rx * 0.7 + rnd(i * 4.3 + cx) * rx * 1.4;
    const ty = cy - ry * 0.3 + rnd(i * 8.9) * ry;
    stroke(g, [[tx, ty], [tx - 0.5, ty - 1.6]], 0.5, "#5fdd74", 0.9);
    stroke(g, [[tx + 0.7, ty], [tx + 1, ty - 1.3]], 0.5, "#2ea856", 0.9);
  }
  speckle(g, cx, cy, rx * 0.85, ry * 0.8, "#187a39", 20, 0.5, cx * 5.3);
  speckle(g, cx, cy - ry * 0.3, rx * 0.7, ry * 0.5, "#66e07e", 12, 0.6, cx * 9.1);
}

/** A leaning palm with drooping fronds and coconuts. */
function palmTree(g: Ctx, x: number, baseY: number, h: number, lean: number) {
  const tx = x + lean;
  const ty = baseY - h;
  // trunk
  g.strokeStyle = "#8a5a2a";
  g.lineWidth = 2;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(x, baseY);
  g.quadraticCurveTo(x + lean * 0.25, baseY - h * 0.55, tx, ty);
  g.stroke();
  // ring bands
  for (let i = 1; i <= 3; i++) {
    const u = i / 4;
    const bx = x + lean * 0.25 * (2 * u - u * u) + (tx - x - lean * 0.25) * u * u + (u < 0.5 ? 0 : 0);
    stroke(
      g,
      [
        [x + (tx - x) * u - 1.2, baseY - h * u],
        [x + (tx - x) * u + 1.2, baseY - h * u - 0.5],
      ],
      0.7,
      "#6d4520",
      0.8
    );
    void bx;
  }
  // fronds
  const angles = [-2.6, -2.1, -1.35, -0.6, -0.15, 0.5];
  angles.forEach((a, i) => {
    const len = 8 + rnd(i * 3.7 + x) * 3.5;
    const ex = tx + Math.cos(a) * len;
    const ey = ty + Math.sin(a) * len * 0.7 + 2.5; // droop
    g.strokeStyle = i % 2 ? "#27c45e" : "#1f9e4c";
    g.lineWidth = 2.4;
    g.beginPath();
    g.moveTo(tx, ty);
    g.quadraticCurveTo(tx + Math.cos(a) * len * 0.6, ty + Math.sin(a) * len * 0.4 - 2, ex, ey);
    g.stroke();
    // leaflet notches
    dot(g, ex, ey, 1, "#1f9e4c", 0.9);
  });
  // coconuts
  dot(g, tx - 1.5, ty + 1.5, 1.1, "#6b4226");
  dot(g, tx + 1.2, ty + 1.8, 1, "#59351d");
}

function pineTree(g: Ctx, x: number, baseY: number, h: number) {
  g.fillStyle = "#5c3a1e";
  g.fillRect(x - 0.8, baseY - 2.5, 1.6, 2.5);
  const tiers = 3;
  for (let i = 0; i < tiers; i++) {
    const ty = baseY - 2 - (h - 2) * (i / tiers);
    const tw = (h * 0.55 * (tiers - i)) / tiers + 1.5;
    const th = (h - 2) / tiers + 2;
    poly(
      g,
      [
        [x - tw, ty],
        [x + tw, ty],
        [x, ty - th],
      ],
      i % 2 ? "#1c7f40" : "#166535"
    );
  }
}

/* ------------------------------ variants ------------------------------ */

function drawVolcano(g: Ctx) {
  const wy = 62; // waterline

  // shallow-water tint (foam is animated separately)
  g.globalAlpha = 0.35;
  g.fillStyle = "#7ce8ec";
  g.beginPath();
  g.ellipse(48, wy + 1, 45, 6.5, 0, 0, TAU);
  g.fill();
  g.globalAlpha = 0.16;
  g.beginPath();
  g.ellipse(48, wy + 1.5, 48, 8.5, 0, 0, TAU);
  g.fill();
  g.globalAlpha = 1;

  // --- wide jagged cone with foothill peaks, straight out of the water ---
  const cone = g.createLinearGradient(0, 24, 0, wy);
  cone.addColorStop(0, "#6d5b4b");
  cone.addColorStop(1, "#443831");
  g.fillStyle = cone;
  g.beginPath();
  g.moveTo(4, wy);
  g.lineTo(12, 54);
  g.lineTo(17, 56);
  g.lineTo(22, 46);
  g.lineTo(27, 48.5);
  g.lineTo(34, 35);
  g.lineTo(39, 29.5);
  g.lineTo(41.5, 26.5); // crater left
  g.lineTo(44.5, 27.5);
  g.lineTo(47, 25.8);
  g.lineTo(50, 27.5);
  g.lineTo(53, 26.2); // crater right
  g.lineTo(57, 31);
  g.lineTo(62, 38.5);
  g.lineTo(67, 47);
  g.lineTo(71, 44); // side peak
  g.lineTo(77, 51);
  g.lineTo(84, 55.5);
  g.lineTo(92, wy);
  g.closePath();
  g.fill();

  // sunlit left faces
  poly(
    g,
    [
      [12, 54],
      [22, 46],
      [34, 35],
      [41.5, 26.5],
      [44, 27.3],
      [37, 42],
      [28, 54],
      [18, wy - 2],
      [10, wy],
    ],
    "#8a7666",
    0.5
  );
  // shadowed right faces
  poly(
    g,
    [
      [53, 26.2],
      [57, 31],
      [62, 38.5],
      [67, 47],
      [77, 51],
      [88, wy - 1],
      [66, wy],
      [58, 46],
    ],
    "#332a24",
    0.5
  );
  // foothill facet shading
  poly(g, [[22, 46], [27, 48.5], [24, 56], [18, 56]], "#594a3e", 0.6);
  poly(g, [[67, 47], [71, 44], [77, 51], [72, 54]], "#594a3e", 0.55);

  // crevice ridges running down the flanks
  stroke(g, [[43, 29], [38, 42], [35, 54], [34, wy - 2]], 1, "#2c241f", 0.55);
  stroke(g, [[48, 29], [47, 42], [45, 54]], 0.8, "#2c241f", 0.4);
  stroke(g, [[27, 48.5], [25, 56], [24, wy - 1]], 0.8, "#2c241f", 0.4);
  stroke(g, [[62, 38.5], [64, 48], [68, 56]], 0.9, "#2c241f", 0.45);

  // dithered rock grain over the flanks
  speckle(g, 34, 50, 14, 9, "#2c241f", 26, 0.4, 4.9);
  speckle(g, 66, 52, 15, 8, "#221c18", 24, 0.45, 8.1);
  speckle(g, 30, 44, 10, 6, "#96826f", 14, 0.45, 15.7);
  speckle(g, 48, 38, 8, 7, "#221c18", 12, 0.3, 21.3);

  // --- crater: molten rim with drips ---
  g.fillStyle = "#ff6a1e";
  g.beginPath();
  g.ellipse(47.3, 26.8, 6.6, 2.1, 0, 0, TAU);
  g.fill();
  g.fillStyle = "#ffd23e";
  g.beginPath();
  g.ellipse(47.3, 26.6, 3.8, 1.1, 0, 0, TAU);
  g.fill();
  // dark front lip of the crater
  g.strokeStyle = "#2c241f";
  g.lineWidth = 1.1;
  g.beginPath();
  g.ellipse(47.3, 27.1, 6.8, 2.2, 0, 0.12 * Math.PI, 0.88 * Math.PI);
  g.stroke();
  // heat glow
  dot(g, 47.3, 25.5, 9.5, "#ff7a2a", 0.22);
  // lava drips off the rim
  stroke(g, [[41.5, 27.5], [40.6, 31.5]], 1.2, "#ff6a1e", 0.95);
  stroke(g, [[53, 27.3], [54.2, 32]], 1.2, "#ff6a1e", 0.95);
  stroke(g, [[44.5, 28.2], [44, 32.5]], 1, "#ff8a2e", 0.9);

  // --- main lava river, right flank into the sea ---
  g.lineCap = "round";
  g.strokeStyle = "#b8480e";
  g.lineWidth = 3.8;
  g.beginPath();
  g.moveTo(51.5, 28);
  g.quadraticCurveTo(57, 36, 56, 44);
  g.quadraticCurveTo(55.5, 52, 62, 59);
  g.stroke();
  g.strokeStyle = "#ff6a1e";
  g.lineWidth = 2.6;
  g.beginPath();
  g.moveTo(51.5, 28);
  g.quadraticCurveTo(57, 36, 56, 44);
  g.quadraticCurveTo(55.5, 52, 62, 59);
  g.stroke();
  g.strokeStyle = "#ffd23e";
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(51.8, 29);
  g.quadraticCurveTo(56.4, 36.5, 55.6, 44);
  g.stroke();
  // lava fanning out where it meets the water, with steam
  poly(g, [[58, 58], [66, 58.5], [69, wy + 1], [56, wy + 1]], "#ff6a1e");
  poly(g, [[60, 59.5], [64, 59.8], [66, wy], [59, wy]], "#ffd23e", 0.9);
  dot(g, 62.5, 59, 5, "#ff7a2a", 0.25);
  dot(g, 68, 58.5, 1.1, "#f2f6f8", 0.85); // steam wisps
  dot(g, 70.5, 56.5, 0.9, "#e4eaee", 0.75);
  dot(g, 55.5, 57.5, 0.9, "#f2f6f8", 0.8);

  // secondary thin flow, left flank
  stroke(g, [[42.5, 30], [39.5, 37], [41, 44.5]], 1.6, "#ff6a1e", 0.95);
  stroke(g, [[42.2, 30.5], [40.2, 36.5]], 0.7, "#ffd23e", 0.9);
  dot(g, 40.5, 44, 3, "#ff7a2a", 0.18);
  // third rivulet snaking down between the ridges
  stroke(g, [[46, 29.5], [45.5, 35], [47, 40], [46, 46]], 1, "#ff6a1e", 0.9);
  stroke(g, [[46, 30], [45.7, 34]], 0.5, "#ffd23e", 0.85);
  // cooling lava crust patches along the flows
  dot(g, 55.8, 40, 1, "#b8480e", 0.9);
  dot(g, 40.3, 41, 0.8, "#b8480e", 0.85);
  // embers drifting on the updraft
  dot(g, 42, 20, 0.55, "#ffd23e", 0.9);
  dot(g, 54, 17, 0.5, "#ff7a2a", 0.9);
  dot(g, 38, 25, 0.45, "#ff9a3e", 0.85);
  dot(g, 57, 23, 0.45, "#ffd23e", 0.8);

  // --- billowing smoke column, thinning and fading as it rises so it
  // dissipates inside the canvas instead of clipping at the top edge ---
  const puffs: Array<[number, number, number, number]> = [
    [48.5, 21, 3.4, 1],
    [45.5, 17, 4.2, 0.9],
    [49.5, 13, 4.6, 0.72],
    [45, 9.5, 4.4, 0.52],
    [49, 6.5, 3.8, 0.34],
    [45.5, 4.5, 3, 0.2],
    [50.5, 3.4, 2.4, 0.12],
  ];
  puffs.forEach(([px, py, pr, fade]) => {
    dot(g, px + pr * 0.3, py + pr * 0.2, pr, "#767e88", 0.9 * fade); // shaded side
    dot(g, px, py, pr * 0.92, "#949ca6", 0.95 * fade);
    dot(g, px - pr * 0.32, py - pr * 0.3, pr * 0.55, "#bcc4cc", 0.95 * fade); // lit top
  });
  dot(g, 57, 6.5, 1.8, "#949ca6", 0.25); // stray detached puff, drifting apart
  dot(g, 56.5, 5.9, 1, "#bcc4cc", 0.28);

  // --- rocks scattered in the surf ---
  poly(g, [[8, wy + 2], [12, 57.5], [17, wy + 2]], "#5c5045");
  poly(g, [[9.5, wy + 1], [12, 58.5], [14, wy + 1]], "#7a6a5c", 0.8);
  poly(g, [[70, wy + 2.5], [75, 58], [81, wy + 2.5]], "#5c5045");
  poly(g, [[72, wy + 1.5], [75, 59], [78, wy + 1.5]], "#716254", 0.8);
  stroke(g, [[73, wy], [77.5, wy - 0.5]], 0.8, "#ff6a1e", 0.9); // lava-cracked rock
  poly(g, [[28, wy + 3], [30.5, wy], [33, wy + 3]], "#5c5045");
  poly(g, [[85, wy + 2], [87, wy - 0.5], [89.5, wy + 2]], "#4e433a");
}

function drawLighthouse(g: Ctx) {
  sandBase(g, 48, 60, 32);
  grassTop(g, 48, 52.5, 24, 5);

  // rocky footing
  poly(g, [[40, 51], [56, 51], [54, 47.5], [42, 47.5]], "#828b98");
  stroke(g, [[43, 49.5], [53, 49.5]], 0.7, "#5d6675", 0.6);

  // tower: five tapering stripe bands, red/white
  const bandTops = [16.5, 22.8, 29.1, 35.4, 41.7, 48];
  const wAt = (y: number) => 4.4 + ((y - 16.5) / 31.5) * 2.8; // half-width
  for (let i = 0; i < 5; i++) {
    const y0 = bandTops[i];
    const y1 = bandTops[i + 1];
    poly(
      g,
      [
        [48 - wAt(y0), y0],
        [48 + wAt(y0), y0],
        [48 + wAt(y1), y1],
        [48 - wAt(y1), y1],
      ],
      i % 2 ? "#f8fafc" : "#e8402f"
    );
  }
  // cylinder shading over the stripes
  const cyl = g.createLinearGradient(40, 0, 56, 0);
  cyl.addColorStop(0, "rgba(20,30,60,0.30)");
  cyl.addColorStop(0.3, "rgba(20,30,60,0)");
  cyl.addColorStop(0.72, "rgba(20,30,60,0)");
  cyl.addColorStop(1, "rgba(20,30,60,0.34)");
  g.fillStyle = cyl;
  poly(
    g,
    [
      [48 - wAt(16.5), 16.5],
      [48 + wAt(16.5), 16.5],
      [48 + wAt(48), 48],
      [48 - wAt(48), 48],
    ],
    "rgba(0,0,0,0)"
  );
  g.beginPath();
  g.moveTo(48 - wAt(16.5), 16.5);
  g.lineTo(48 + wAt(16.5), 16.5);
  g.lineTo(48 + wAt(48), 48);
  g.lineTo(48 - wAt(48), 48);
  g.closePath();
  g.fill();

  // gallery walkway + railing
  g.fillStyle = "#2f3b4a";
  g.fillRect(41.8, 14.6, 12.4, 2.2);
  for (let i = 0; i < 5; i++) {
    g.fillRect(43 + i * 2.5, 12.6, 0.7, 2);
  }
  // lantern room
  g.fillStyle = "#2f3b4a";
  g.fillRect(43.8, 9.2, 8.4, 4.6);
  g.fillStyle = "#ffd23e";
  g.fillRect(45, 9.8, 6, 3.4);
  dot(g, 48, 11.5, 6.5, "#ffd23e", 0.28); // glow halo
  stroke(g, [[48, 9.8], [48, 13.2]], 0.6, "#2f3b4a", 0.8);
  // dome cap + finial
  g.fillStyle = "#d8362a";
  g.beginPath();
  g.arc(48, 9.2, 4.6, Math.PI, 0);
  g.closePath();
  g.fill();
  dot(g, 48, 4, 0.9, "#d8362a");

  // door + windows
  g.fillStyle = "#3a2410";
  g.beginPath();
  g.arc(48, 45.2, 2, Math.PI, 0);
  g.fillRect(46, 45.2, 4, 2.8);
  g.fill();
  g.fillStyle = "#2f3b4a";
  g.fillRect(47, 37.4, 2, 3);
  g.fillRect(47.2, 26.4, 1.8, 2.8);
  dot(g, 47.6, 27, 0.4, "#cfe4f2", 0.9);

  // stepping-stone path winding to the door
  dot(g, 48, 50, 1.1, "#c9b78e");
  dot(g, 46.4, 51.6, 0.9, "#b9a67c");
  dot(g, 48.2, 53.2, 0.9, "#c9b78e");
  dot(g, 46.8, 55, 0.8, "#b9a67c");

  // bushes with berry + flower accents
  dot(g, 38, 51, 2.2, "#2ea856");
  dot(g, 36.2, 51.8, 1.6, "#1f8f43");
  dot(g, 37.2, 50.2, 0.5, "#ff6b8f", 0.95);
  dot(g, 59, 50.8, 2, "#2ea856");
  dot(g, 60.6, 51.4, 1.4, "#1f8f43");
  dot(g, 59.6, 49.9, 0.5, "#ffd23e", 0.95);
  dot(g, 42.5, 49.6, 0.45, "#f5f9ff", 0.95);
  dot(g, 54, 49.8, 0.45, "#ff8fb3", 0.95);

  // weathered rock outcrops on the shore
  poly(g, [[26, 58.5], [29.5, 54.5], [34, 58.5]], "#7e8794");
  poly(g, [[27.5, 58], [29.5, 55.5], [31.5, 58]], "#98a2ae", 0.85);
  stroke(g, [[28.5, 57], [31, 57.2]], 0.5, "#5d6675", 0.7);
  poly(g, [[63, 58.5], [66.5, 55], [70.5, 58.5]], "#6d7684");
  poly(g, [[64.5, 58], [66.5, 56], [68.5, 58]], "#8b95a6", 0.8);

  // brick courses on the red bands (fine masonry texture)
  g.globalAlpha = 0.28;
  g.strokeStyle = "#8d1f14";
  g.lineWidth = 0.4;
  [19.6, 32.2, 44.8].forEach((y) => {
    g.beginPath();
    g.moveTo(44.5, y);
    g.lineTo(51.5, y);
    g.stroke();
  });
  g.globalAlpha = 1;

  // mooring post with rope by the water
  g.fillStyle = "#5c3a1e";
  g.fillRect(31, 55.5, 1.4, 4);
  stroke(g, [[31.7, 56.2], [34.5, 57.6]], 0.5, "#c9b78e", 0.9);
}

function drawJungle(g: Ctx) {
  sandBase(g, 48, 60, 37);

  // underbrush behind the ruin
  for (let i = 0; i < 10; i++) {
    const x = 18 + i * 6.6;
    dot(g, x, 48 + rnd(i * 3.1) * 3, 4.5 + rnd(i * 7.7) * 2, "#157a36", 1);
  }
  for (let i = 0; i < 9; i++) {
    const x = 21 + i * 6.6;
    dot(g, x, 45.5 + rnd(i * 5.3) * 2.5, 3 + rnd(i * 2.3) * 1.5, "#27a04c", 1);
  }

  // stone ruin — two-tier temple with dark doorway
  poly(g, [[36, 50], [60, 50], [58, 38], [38, 38]], "#98a2ae"); // tier 1
  poly(g, [[58, 50], [60, 50], [58, 38], [56, 38]], "#79828f"); // side shade
  poly(g, [[41, 38], [55, 38], [54, 30], [42, 30]], "#a3adb9"); // tier 2
  g.fillStyle = "#b3bcc7";
  g.fillRect(40, 28.6, 16, 2.4); // top slab
  // doorway + steps
  g.fillStyle = "#1e2833";
  g.beginPath();
  g.arc(48, 44.5, 3, Math.PI, 0);
  g.fillRect(45, 44.5, 6, 5.5);
  g.fill();
  g.fillStyle = "#c2cbd5";
  g.fillRect(44, 50, 8, 1.6);
  g.fillRect(42.5, 51.6, 11, 1.6);
  g.fillRect(41, 53.2, 14, 1.6);
  // block seams + cracks
  stroke(g, [[38, 44], [45, 44]], 0.5, "#6a7480", 0.7);
  stroke(g, [[51, 44], [58, 44]], 0.5, "#6a7480", 0.7);
  stroke(g, [[42, 34], [54, 34]], 0.5, "#6a7480", 0.7);
  stroke(g, [[55, 40], [53, 46]], 0.5, "#5d6672", 0.6);
  // moss + hanging vines
  dot(g, 40, 38.5, 1.4, "#2ea856", 0.9);
  dot(g, 55.5, 30.5, 1.2, "#27a04c", 0.9);
  dot(g, 57, 47, 1.3, "#2ea856", 0.8);
  stroke(g, [[43, 28.6], [42.5, 33.5]], 0.7, "#27a04c", 0.85);
  stroke(g, [[52, 28.6], [52.6, 35]], 0.7, "#1f9e4c", 0.85);

  // dense palm canopy framing the ruin — back row first, then foreground
  palmTree(g, 33, 52, 30, 5); // tall back-left, canopy over the ruin
  palmTree(g, 63, 52, 28, -5); // tall back-right
  palmTree(g, 26, 57, 26, -6);
  palmTree(g, 19, 58.5, 19, 5);
  palmTree(g, 71, 57, 24, 6);
  palmTree(g, 78, 58.5, 17, -4);

  // fern clumps in the undergrowth
  const fern = (fx: number, fy: number, flip: number) => {
    for (let i = 0; i < 4; i++) {
      const a = -0.4 - i * 0.5;
      stroke(
        g,
        [
          [fx, fy],
          [fx + Math.cos(a) * 3.4 * flip, fy + Math.sin(a) * 2.8],
        ],
        0.7,
        i % 2 ? "#2ea856" : "#1c8f45",
        0.95
      );
    }
  };
  fern(31, 55.5, 1);
  fern(66, 55, -1);
  fern(58, 56.5, 1);

  // canopy shadow dappling the ruin's top slab
  speckle(g, 48, 30, 8, 2, "#5d6672", 10, 0.5, 11.3);

  // fallen blocks + a toppled column on the sand
  g.fillStyle = "#98a2ae";
  g.fillRect(33, 55, 3.4, 2.6);
  g.fillStyle = "#79828f";
  g.fillRect(62.5, 55.5, 2.8, 2.2);
  g.save();
  g.translate(40, 57.2);
  g.rotate(0.18);
  g.fillStyle = "#a3adb9";
  g.fillRect(-3.2, -1.1, 6.4, 2.2);
  g.restore();
  stroke(g, [[37.5, 56.6], [42.5, 58]], 0.4, "#6a7480", 0.7); // column ribs
  dot(g, 43.5, 57, 0.8, "#2ea856", 0.85); // moss on the rubble
}

function drawMountain(g: Ctx) {
  sandBase(g, 48, 61, 37);
  grassTop(g, 48, 54, 31, 6);

  // rear peak
  poly(g, [[28, 53], [44, 22], [56, 34], [52, 53]], "#6d7686");
  poly(g, [[44, 22], [56, 34], [52, 53], [48, 53]], "#59626f", 0.85);
  poly(g, [[41, 28], [44, 22], [49, 27], [46, 30], [43, 29]], "#f5f9ff"); // snow

  // front peak with snowcap + shadow face
  poly(g, [[36, 53], [60, 13], [80, 53]], "#8b95a6");
  poly(g, [[60, 13], [80, 53], [66, 53]], "#5d6675", 0.9);
  poly(
    g,
    [
      [60, 13],
      [65.5, 24],
      [62, 26],
      [59, 23],
      [56, 25.5],
      [54.5, 24],
    ],
    "#f5f9ff"
  );
  stroke(g, [[58, 30], [56, 40], [57, 50]], 0.8, "#6d7686", 0.5); // scree lines
  stroke(g, [[63, 28], [66, 38], [70, 48]], 0.8, "#49525f", 0.5);

  // rock strata bands across the sunlit face
  g.globalAlpha = 0.3;
  g.strokeStyle = "#707a8c";
  g.lineWidth = 0.6;
  [
    [[44, 36], [58, 33]],
    [[41, 42], [60, 39]],
    [[39, 48], [63, 45]],
  ].forEach((seg) => {
    g.beginPath();
    g.moveTo(seg[0][0], seg[0][1]);
    g.lineTo(seg[1][0], seg[1][1]);
    g.stroke();
  });
  g.globalAlpha = 1;
  // dithered rock grain + snow dust below the caps
  speckle(g, 58, 38, 12, 9, "#49525f", 22, 0.4, 3.7);
  speckle(g, 59, 27, 6, 3, "#f5f9ff", 12, 0.7, 8.3);
  speckle(g, 45, 30, 4, 2.5, "#f5f9ff", 7, 0.65, 12.9);

  // switchback trail from the beach up toward the col
  g.strokeStyle = "#d9c08a";
  g.lineWidth = 2;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(46, 58.5);
  g.quadraticCurveTo(56, 54, 52, 48);
  g.quadraticCurveTo(48, 43, 54, 38);
  g.quadraticCurveTo(58, 34.5, 55, 31);
  g.stroke();
  g.strokeStyle = "#b89a63";
  g.lineWidth = 0.6;
  g.beginPath();
  g.moveTo(46, 59);
  g.quadraticCurveTo(56, 54.5, 52.2, 48.4);
  g.quadraticCurveTo(48.4, 43.2, 54.2, 38.2);
  g.stroke();
  // trail-side rocks
  dot(g, 53.5, 45, 0.7, "#8b95a6", 0.95);
  dot(g, 50.5, 51.5, 0.6, "#6d7686", 0.9);

  // pine forest at the foot — staggered depth, shaded rows
  pineTree(g, 22, 55, 7.5);
  pineTree(g, 26, 55.5, 8.5);
  pineTree(g, 32, 55, 10);
  pineTree(g, 38, 56, 8);
  pineTree(g, 35, 57, 6.5);
  pineTree(g, 58, 57, 6.5);
  pineTree(g, 62, 56.5, 7.5);
  pineTree(g, 68, 56, 9);
  pineTree(g, 74, 55, 10.5);
  pineTree(g, 78, 56, 7.5);
  // canopy highlight flecks
  speckle(g, 30, 51, 8, 3, "#3bbc57", 10, 0.6, 6.1);
  speckle(g, 70, 52, 8, 3, "#3bbc57", 10, 0.6, 9.7);

  // meadow flowers
  dot(g, 42, 55.5, 0.6, "#ff8fb3");
  dot(g, 57, 56.5, 0.6, "#f5f9ff");
  dot(g, 49, 56, 0.5, "#ffd23e");
  dot(g, 45, 57.2, 0.5, "#ff8fb3");
  dot(g, 53, 57.5, 0.45, "#f5f9ff");
}

function drawVillage(g: Ctx) {
  sandBase(g, 48, 60, 38);

  // --- stilt hut A (left, bigger) ---
  g.fillStyle = "#5c3a1e";
  g.fillRect(33.5, 46, 1.8, 7);
  g.fillRect(45.5, 46, 1.8, 7);
  g.fillStyle = "#7a4c22";
  g.fillRect(31.5, 45, 18, 2); // floor slab
  // walls with plank lines
  g.fillStyle = "#a4642a";
  g.fillRect(33, 36.5, 15, 8.5);
  stroke(g, [[33, 39.5], [48, 39.5]], 0.5, "#7c491d", 0.8);
  stroke(g, [[33, 42.5], [48, 42.5]], 0.5, "#7c491d", 0.8);
  g.fillStyle = "#3c2410";
  g.fillRect(38.5, 39, 4, 6); // doorway
  // thatch roof with overhang
  poly(g, [[29.5, 36.8], [51.5, 36.8], [46.5, 29.5], [34.5, 29.5]], "#d2a852");
  poly(g, [[29.5, 36.8], [51.5, 36.8], [50, 34.8], [31, 34.8]], "#b08a3e");
  stroke(g, [[34.5, 29.5], [46.5, 29.5]], 1, "#8a6a2a", 0.9);
  stroke(g, [[33, 33], [48, 33]], 0.5, "#a87e2f", 0.7);

  // --- stilt hut B (right, smaller, lit window) ---
  g.fillStyle = "#5c3a1e";
  g.fillRect(57.5, 48, 1.6, 5.5);
  g.fillRect(67.5, 48, 1.6, 5.5);
  g.fillStyle = "#7a4c22";
  g.fillRect(55.5, 47, 15, 1.8);
  g.fillStyle = "#96591f";
  g.fillRect(56.5, 40, 13, 7);
  stroke(g, [[56.5, 43], [69.5, 43]], 0.5, "#6d4520", 0.8);
  g.fillStyle = "#ffd23e";
  g.fillRect(59, 42, 3, 3); // warm lit window
  dot(g, 60.5, 43.5, 3.4, "#ffd23e", 0.25);
  poly(g, [[53.5, 40.2], [72.5, 40.2], [68, 34], [58, 34]], "#caa04a");
  stroke(g, [[58, 34], [68, 34]], 0.9, "#8a6a2a", 0.9);

  // --- dock running into the water + moored boat ---
  poly(g, [[47, 57], [70, 62.5], [70, 65], [47, 59.5]], "#8a5a2e");
  stroke(g, [[52, 58.2], [52, 60.6]], 0.6, "#5c3a1e", 0.8);
  stroke(g, [[58, 59.6], [58, 62]], 0.6, "#5c3a1e", 0.8);
  stroke(g, [[64, 61], [64, 63.4]], 0.6, "#5c3a1e", 0.8);
  g.fillStyle = "#5c3a1e";
  g.fillRect(51.5, 60.5, 1.2, 4);
  g.fillRect(63.5, 63, 1.2, 3.5);
  // boat
  g.fillStyle = "#6b4226";
  g.beginPath();
  g.moveTo(72, 64.5);
  g.quadraticCurveTo(76.5, 67.5, 81, 64.5);
  g.quadraticCurveTo(76.5, 63, 72, 64.5);
  g.closePath();
  g.fill();
  stroke(g, [[76.5, 63.8], [76.5, 57.5]], 0.8, "#5c3a1e");
  poly(g, [[76.9, 57.8], [81.5, 62.5], [76.9, 62.5]], "#f6f0dc");

  // --- small storage hut behind the others ---
  g.fillStyle = "#7c491d";
  g.fillRect(74, 47, 8, 5.5);
  poly(g, [[72.5, 47.2], [83.5, 47.2], [81, 43.5], [75, 43.5]], "#b08a3e");
  stroke(g, [[75, 43.5], [81, 43.5]], 0.7, "#8a6a2a", 0.9);
  g.fillStyle = "#3c2410";
  g.fillRect(77, 48.5, 2.2, 4);

  // thatch texture strokes on the two main roofs
  g.globalAlpha = 0.5;
  g.strokeStyle = "#8a6a2a";
  g.lineWidth = 0.4;
  [[33, 31.5], [37, 30.5], [42, 30.2], [46, 31]].forEach(([tx, ty]) => {
    g.beginPath();
    g.moveTo(tx, ty);
    g.lineTo(tx - 1, ty + 4.5);
    g.stroke();
  });
  [[57, 35.5], [61, 34.8], [65, 35.2]].forEach(([tx, ty]) => {
    g.beginPath();
    g.moveTo(tx, ty);
    g.lineTo(tx - 0.8, ty + 4);
    g.stroke();
  });
  g.globalAlpha = 1;

  // tiki torches with flames lighting the path between huts
  const torch = (tx: number, ty: number) => {
    g.fillStyle = "#5c3a1e";
    g.fillRect(tx - 0.6, ty - 5, 1.2, 5);
    stroke(g, [[tx - 1, ty - 3.6], [tx + 1, ty - 4]], 0.5, "#c9b78e", 0.9);
    dot(g, tx, ty - 6, 1.3, "#ff7a2a", 0.95);
    dot(g, tx, ty - 6.6, 0.7, "#ffd23e", 0.95);
    dot(g, tx, ty - 6, 2.6, "#ffd23e", 0.2);
  };
  torch(51.5, 58);
  torch(29, 57.5);

  // palm + cargo pile
  palmTree(g, 23, 58, 22, -5);
  g.fillStyle = "#b98c4e";
  g.fillRect(51, 53.5, 3.2, 3.2);
  stroke(g, [[51, 55.1], [54.2, 55.1]], 0.4, "#8a6432", 0.9);
  g.fillStyle = "#a87e3e";
  g.fillRect(54.4, 54.5, 2.6, 2.2); // second crate
  dot(g, 58, 55.8, 1.7, "#8a5a2e"); // barrel
  stroke(g, [[56.5, 55.6], [59.5, 55.6]], 0.4, "#5c3a1e", 0.9);
  dot(g, 47.5, 56.5, 1.1, "#caa04a"); // cooking pot
  dot(g, 47.5, 56.1, 0.5, "#3c2410");

  // rope coiled on the dock + gull perched on a post
  dot(g, 55.5, 60.2, 1, "#c9b78e", 0.9);
  dot(g, 55.5, 60.2, 0.45, "#8a6432", 0.9);
  dot(g, 52.1, 59.6, 0.8, "#f5f9ff");
  dot(g, 52.5, 59, 0.5, "#f5f9ff");
  stroke(g, [[52.9, 59], [53.5, 58.9]], 0.4, "#ffd23e", 0.95); // beak
}

function drawBottle(g: Ctx) {
  // floating at a jaunty angle
  g.save();
  g.translate(24, 34);
  g.rotate(-0.3);
  g.translate(-24, -34);

  // cork
  g.fillStyle = "#c98a4a";
  g.fillRect(20.5, 6, 7, 7);
  stroke(g, [[20.5, 9.5], [27.5, 9.5]], 0.5, "#a06a32", 0.9);
  // lip + neck + body glass
  g.fillStyle = "#9fdde8";
  g.fillRect(19.2, 12.4, 9.6, 2.6);
  g.fillStyle = "rgba(168, 236, 242, 0.88)";
  g.fillRect(20, 14.6, 8, 9);
  g.beginPath();
  g.moveTo(20, 23.6);
  g.quadraticCurveTo(13.5, 26.5, 13.5, 33);
  g.lineTo(13.5, 47);
  g.quadraticCurveTo(13.5, 52.5, 19, 52.5);
  g.lineTo(29, 52.5);
  g.quadraticCurveTo(34.5, 52.5, 34.5, 47);
  g.lineTo(34.5, 33);
  g.quadraticCurveTo(34.5, 26.5, 28, 23.6);
  g.closePath();
  g.fill();

  // rolled note inside, with a wax seal
  g.save();
  g.translate(24, 40);
  g.rotate(0.12);
  g.fillStyle = "#ffe9b8";
  g.fillRect(-5.5, -7.5, 11, 15);
  g.fillStyle = "#f3d795";
  g.fillRect(-5.5, -7.5, 2, 15); // roll curl
  g.strokeStyle = "#d6b26e";
  g.lineWidth = 0.6;
  [-3.5, -0.5, 2.5].forEach((ly) => {
    g.beginPath();
    g.moveTo(-2.5, ly);
    g.lineTo(4.5, ly);
    g.stroke();
  });
  dot(g, 2, 5, 1.4, "#e8402f");
  g.restore();

  // glass shine + rim shade
  stroke(g, [[17, 27], [16, 45]], 1.6, "#ffffff", 0.75);
  stroke(g, [[18.5, 24.5], [17.5, 26.5]], 1.2, "#ffffff", 0.6);
  g.strokeStyle = "#7fd9e4";
  g.lineWidth = 1.2;
  g.beginPath();
  g.moveTo(32.5, 27);
  g.quadraticCurveTo(33.5, 36, 32.8, 49);
  g.stroke();
  // sparkle
  stroke(g, [[31, 18], [31, 21]], 0.7, "#ffffff", 0.9);
  stroke(g, [[29.5, 19.5], [32.5, 19.5]], 0.7, "#ffffff", 0.9);

  g.restore();

  // displaced-water shading under the glass (surf is animated separately)
  g.globalAlpha = 0.24;
  g.fillStyle = "#0b3550";
  g.beginPath();
  g.ellipse(24, 57, 13, 2.4, 0, 0, TAU);
  g.fill();
  g.globalAlpha = 1;
  // rising bubbles
  dot(g, 12, 50, 0.8, "#ffffff", 0.5);
  dot(g, 37, 46, 0.7, "#ffffff", 0.45);
  dot(g, 35, 52, 0.9, "#ffffff", 0.5);
}

function drawWhale(g: Ctx) {
  // body — big friendly arc, head to the left
  const body = g.createLinearGradient(0, 8, 0, 36);
  body.addColorStop(0, "#6d9fe0");
  body.addColorStop(1, "#4a77c4");
  g.fillStyle = body;
  g.beginPath();
  g.moveTo(56, 27);
  g.bezierCurveTo(54, 12, 36, 6, 22, 9);
  g.bezierCurveTo(12, 11.5, 7, 17, 7, 23);
  g.quadraticCurveTo(7, 29, 12, 32.5);
  g.bezierCurveTo(20, 37.5, 40, 37.5, 50, 32);
  g.quadraticCurveTo(55, 29.5, 56, 27);
  g.closePath();
  g.fill();

  // pale ridged belly
  g.fillStyle = "#d8ebf6";
  g.beginPath();
  g.moveTo(9, 25);
  g.quadraticCurveTo(9, 31, 14, 33.5);
  g.bezierCurveTo(22, 37, 38, 37, 47, 33);
  g.quadraticCurveTo(38, 36, 24, 34.5);
  g.quadraticCurveTo(12, 32.5, 9, 25);
  g.closePath();
  g.fill();
  g.strokeStyle = "#b8d4e8";
  g.lineWidth = 0.8;
  [27.5, 30, 32.3].forEach((ly, i) => {
    g.beginPath();
    g.moveTo(10 + i * 2, ly);
    g.quadraticCurveTo(28, ly + 3.5, 46 - i * 2, ly + 0.5);
    g.stroke();
  });

  // tail flukes, raised
  g.fillStyle = "#5a8ad2";
  g.beginPath();
  g.moveTo(54, 26);
  g.quadraticCurveTo(58, 22, 58.5, 14);
  g.quadraticCurveTo(61.5, 18, 61.5, 21.5);
  g.quadraticCurveTo(65.5, 19, 66.5, 15.5);
  g.quadraticCurveTo(67.5, 22, 63, 26.5);
  g.quadraticCurveTo(59, 30, 54, 28.5);
  g.closePath();
  g.fill();
  stroke(g, [[58.5, 16], [60, 22]], 0.7, "#4a77c4", 0.6);

  // pectoral fin
  g.fillStyle = "#3f68b4";
  g.beginPath();
  g.moveTo(28, 30);
  g.quadraticCurveTo(34, 31, 36.5, 35);
  g.quadraticCurveTo(30, 35.5, 26.5, 32.5);
  g.closePath();
  g.fill();

  // face — eye, glint, smile, blush
  dot(g, 17, 19.5, 1.6, "#15243c");
  dot(g, 17.6, 18.9, 0.55, "#ffffff", 0.95);
  g.strokeStyle = "#15243c";
  g.lineWidth = 0.9;
  g.beginPath();
  g.arc(13.5, 22.5, 3.6, 0.25 * Math.PI, 0.62 * Math.PI);
  g.stroke();
  dot(g, 20, 24, 1.6, "#ff9bb5", 0.4);

  // back glint
  g.strokeStyle = "#a8c8ee";
  g.globalAlpha = 0.7;
  g.lineWidth = 1.1;
  g.beginPath();
  g.moveTo(24, 9.5);
  g.quadraticCurveTo(38, 7.5, 49, 14);
  g.stroke();
  g.globalAlpha = 1;

  // spout
  dot(g, 26, 5.5, 0.9, "#bfe6ff", 0.95);
  dot(g, 24.2, 3, 0.8, "#bfe6ff", 0.9);
  dot(g, 28, 2.6, 0.75, "#bfe6ff", 0.9);
  dot(g, 26.2, 0.9, 0.6, "#e9fbff", 0.85);
  stroke(g, [[25.4, 7.5], [25, 5.8]], 0.7, "#bfe6ff", 0.8);
  stroke(g, [[26.8, 7.5], [27.6, 5.4]], 0.7, "#bfe6ff", 0.8);

  // displaced-water shading under the body (surf is animated separately)
  g.globalAlpha = 0.24;
  g.fillStyle = "#0b3550";
  g.beginPath();
  g.ellipse(33, 40.5, 25, 3.2, 0, 0, TAU);
  g.fill();
  g.globalAlpha = 1;
}

function drawShip(g: Ctx) {
  // rigging first (behind sails/hull)
  stroke(g, [[27, 12.5], [9, 43]], 0.5, "#3a2c22", 0.6);
  stroke(g, [[49, 12.5], [74, 40]], 0.5, "#3a2c22", 0.6);
  stroke(g, [[59, 17.5], [74, 40]], 0.5, "#3a2c22", 0.55);

  // masts + yards + bowsprit
  g.fillStyle = "#5c3a1e";
  g.fillRect(37, 7, 2, 38);
  g.fillRect(57.4, 13, 1.8, 32);
  stroke(g, [[9.5, 43.5], [1.5, 36.5]], 1.4, "#5c3a1e");
  stroke(g, [[26, 12.5], [50, 12.5]], 1.1, "#4c2f16");
  stroke(g, [[27.5, 27], [48.5, 27]], 1, "#4c2f16");
  stroke(g, [[50, 18], [66.5, 18]], 1, "#4c2f16");

  // pirate flag — black pennant with a skull
  poly(g, [[38.8, 4.2], [50, 6.4], [38.8, 9]], "#1d232e");
  dot(g, 43, 6.5, 1.2, "#f5f9ff", 0.95);

  // mainsail, billowing toward the bow, with skull emblem
  const sail = g.createLinearGradient(26, 0, 50, 0);
  sail.addColorStop(0, "#f2e4c0");
  sail.addColorStop(1, "#d8c496");
  g.fillStyle = sail;
  g.beginPath();
  g.moveTo(26.5, 13.2);
  g.quadraticCurveTo(38, 17.5, 49.5, 13.2);
  g.quadraticCurveTo(51.5, 20, 48.5, 26.3);
  g.quadraticCurveTo(38, 30.5, 28, 26.3);
  g.quadraticCurveTo(24.8, 20, 26.5, 13.2);
  g.closePath();
  g.fill();
  // skull emblem
  dot(g, 38, 20.2, 3.4, "#2b2b33", 0.95);
  dot(g, 38, 19.5, 1.8, "#f5f9ff");
  dot(g, 37.3, 19.3, 0.45, "#2b2b33");
  dot(g, 38.7, 19.3, 0.45, "#2b2b33");
  stroke(g, [[36.2, 21.8], [39.8, 22.6]], 0.6, "#f5f9ff", 0.95);
  stroke(g, [[36.2, 22.6], [39.8, 21.8]], 0.6, "#f5f9ff", 0.95);

  // foresail
  g.fillStyle = "#ecdcb4";
  g.beginPath();
  g.moveTo(50.5, 18.8);
  g.quadraticCurveTo(58, 21.5, 66, 18.8);
  g.quadraticCurveTo(67, 25, 64.5, 30.5);
  g.quadraticCurveTo(58, 33.5, 52.5, 30.5);
  g.quadraticCurveTo(49.8, 24.5, 50.5, 18.8);
  g.closePath();
  g.fill();
  stroke(g, [[63, 20.5], [62, 29.5]], 0.6, "#d0bc8e", 0.8);

  // jib sail on the bowsprit
  poly(g, [[26, 14], [8, 40], [26, 36]], "#e4d4ac");
  stroke(g, [[24, 18], [12, 38]], 0.5, "#cdb98a", 0.7);

  // hull — curved profile, raised stern castle
  const hull = g.createLinearGradient(0, 40, 0, 60);
  hull.addColorStop(0, "#8a5a2e");
  hull.addColorStop(0.55, "#6b4226");
  hull.addColorStop(1, "#4c2f16");
  g.fillStyle = hull;
  g.beginPath();
  g.moveTo(6.5, 42);
  g.quadraticCurveTo(10, 52, 20, 56.5);
  g.quadraticCurveTo(40, 61.5, 58, 58);
  g.quadraticCurveTo(70, 55.5, 75.5, 48);
  g.lineTo(78, 38.5);
  g.quadraticCurveTo(70, 43.5, 58, 44.5);
  g.quadraticCurveTo(30, 46.5, 6.5, 42);
  g.closePath();
  g.fill();
  // plank seams
  stroke(g, [[10, 47.5], [40, 52.5], [70, 49]], 0.6, "#4c2f16", 0.6);
  stroke(g, [[14, 52], [40, 56.5], [66, 53.5]], 0.6, "#4c2f16", 0.5);
  // deck rail
  stroke(g, [[7, 42.5], [30, 46.2], [58, 45], [77, 39.5]], 1.1, "#a4703c", 0.95);
  // gunports with gilt rims
  [[24, 50.2], [37, 52], [50, 51.4]].forEach(([px, py]) => {
    dot(g, px, py, 1.7, "#caa04a", 0.9);
    dot(g, px, py, 1.15, "#241608");
  });

  // stern castle + gallery lantern
  g.fillStyle = "#8a5a2e";
  g.fillRect(63, 32.5, 13, 9.5);
  stroke(g, [[63, 36], [76, 36]], 0.6, "#5c3a1e", 0.8);
  for (let i = 0; i < 4; i++) g.fillRect(63.8 + i * 3.3, 30.5, 0.8, 2);
  g.fillStyle = "#ffd23e";
  g.fillRect(66.5, 37.2, 2.6, 2.6);
  dot(g, 67.8, 38.5, 3, "#ffd23e", 0.25);
  dot(g, 77.5, 36.5, 1.1, "#ffd23e");
  stroke(g, [[77.5, 35.4], [77.5, 33.8]], 0.6, "#5c3a1e");

  // figurehead curl at the bow
  g.strokeStyle = "#caa04a";
  g.lineWidth = 1;
  g.beginPath();
  g.arc(7.5, 40.5, 2, -0.5 * Math.PI, 0.75 * Math.PI);
  g.stroke();

  // crow's-nest lookout barrel near the mainmast top
  poly(g, [[34.4, 11], [41.6, 11], [40.4, 7.6], [35.6, 7.6]], "#6b4226");
  poly(g, [[40.4, 7.6], [41.6, 11], [40.2, 11], [39.4, 7.6]], "#4c2f16", 0.8); // shaded side
  stroke(g, [[34.7, 9.2], [41.3, 9.2]], 0.5, "#4c2f16", 0.8); // hoop band
  for (let i = 0; i < 3; i++) stroke(g, [[36 + i * 1.9, 7.6], [36 + i * 1.9, 11]], 0.35, "#3a2c22", 0.55); // staves
  dot(g, 38, 6.4, 0.9, "#e8ddc2", 0.9); // lookout's head peeking over the rim

  // shrouds with ratline crosshatch, mast tops down to the rails
  const shroud = (tx: number, ty: number, bxs: number[], by: number) => {
    bxs.forEach((bx) => stroke(g, [[tx, ty], [bx, by]], 0.35, "#3a2c22", 0.5));
    for (let i = 1; i <= 4; i++) {
      const u = 0.3 + (i / 5) * 0.7; // rungs only on the lower stretch
      stroke(
        g,
        [
          [tx + (bxs[0] - tx) * u, ty + (by - ty) * u],
          [tx + (bxs[bxs.length - 1] - tx) * u, ty + (by - ty) * u],
        ],
        0.25,
        "#3a2c22",
        0.4
      );
    }
  };
  shroud(38, 13, [28, 32.5], 44.8);
  shroud(58.2, 18.5, [51, 54.5], 44.2);

  // stern gallery: extra lit windows behind gilt trim rails
  g.fillStyle = "#ffd23e";
  g.fillRect(70.4, 37.2, 2.2, 2.6);
  g.fillRect(73.6, 37.4, 1.9, 2.4);
  dot(g, 72.5, 38.5, 3.2, "#ffd23e", 0.16);
  stroke(g, [[63.4, 36.4], [76.2, 36.4]], 0.4, "#caa04a", 0.7);
  stroke(g, [[63.4, 40.8], [76.2, 40.8]], 0.5, "#caa04a", 0.85);

  // anchor catted at the bow
  stroke(g, [[11.5, 44], [11.5, 48.8]], 0.7, "#2b2f36");
  g.strokeStyle = "#2b2f36";
  g.lineWidth = 0.7;
  g.beginPath();
  g.arc(11.5, 47.6, 2, 0.12 * Math.PI, 0.88 * Math.PI);
  g.stroke();
  stroke(g, [[10.3, 44.8], [12.7, 44.8]], 0.5, "#2b2f36");
  dot(g, 11.5, 43.6, 0.55, "#caa04a");

  // canvas patches + reef seams across the sails
  g.fillStyle = "#d0bc8e";
  g.fillRect(42.5, 16.2, 2.6, 2.6);
  stroke(g, [[42.5, 16.2], [45.1, 18.8]], 0.3, "#a8946a", 0.9);
  stroke(g, [[28, 17.2], [48.6, 17.2]], 0.35, "#cdb98a", 0.55);
  stroke(g, [[27.8, 22.2], [48.9, 22.2]], 0.35, "#cdb98a", 0.55);
  stroke(g, [[52, 23.6], [64.8, 23.6]], 0.3, "#cdb98a", 0.55);
  g.fillStyle = "#d8c8a0";
  g.fillRect(59.5, 25.5, 2.2, 2.2);
  // billow shading down the mainsail leech
  stroke(g, [[48.6, 14.6], [50.2, 20], [48.2, 25.6]], 1.1, "#c8b488", 0.45);

  // deck clutter: rope coil + spare barrel
  dot(g, 31, 45.3, 1.1, "#c9b78e", 0.95);
  dot(g, 31, 45.3, 0.5, "#8a6432", 0.95);
  dot(g, 22.5, 45.9, 1.5, "#8a5a2e");
  stroke(g, [[21.2, 45.7], [23.8, 45.7]], 0.4, "#5c3a1e", 0.9);

  // hull waterline shadow + churned foam at bow and stern
  stroke(g, [[13, 55], [40, 59.4], [65, 56.2]], 0.8, "#33200e", 0.5);
  dot(g, 8.5, 57.5, 1, "#f2f6f8", 0.85);
  dot(g, 12, 59, 0.8, "#e9fbff", 0.8);
  dot(g, 70, 55.5, 0.9, "#f2f6f8", 0.85);
  dot(g, 74.5, 53.5, 0.7, "#e9fbff", 0.75);

  // gull perched on the stern lantern
  dot(g, 77.5, 32.6, 0.75, "#f5f9ff");
  dot(g, 78.2, 31.9, 0.5, "#f5f9ff");
  stroke(g, [[78.6, 32], [79.3, 32.1]], 0.35, "#f2b134", 0.95);

  // displaced-water shading tight under the hull — the ship sits IN the sea
  // (draft shadow) instead of on a bright shallow pad; surf is animated
  // separately (drawSplashSheet)
  g.globalAlpha = 0.28;
  g.fillStyle = "#0b3550";
  g.beginPath();
  g.ellipse(41, 59.5, 33, 2.8, 0, 0, TAU);
  g.fill();
  g.globalAlpha = 0.13;
  g.beginPath();
  g.ellipse(41, 60, 36.5, 4.2, 0, 0, TAU);
  g.fill();
  g.globalAlpha = 1;
}

/* --------------------------- animated surf ---------------------------- */

/** Frames in each splash loop. */
export const SPLASH_FRAMES = 12;

/** Waterline ellipse per sprite (cx, cy, rx, ry) in PAINTER coordinates. */
const SPLASH_GEOM: Record<SpriteVariant, [number, number, number, number]> = {
  volcano: [48, 62, 42, 5.5],
  lighthouse: [48, 60, 34, 5.5],
  palm: [48, 60, 39, 5.5],
  mountain: [48, 61, 39, 5.5],
  hut: [48, 60, 40, 5.5],
  bottle: [24, 57, 15, 3.2],
  whale: [33, 40.5, 27, 4],
  ship: [41, 60, 36, 4.6],
};

/**
 * Floating sprites ride the water instead of rising from the seabed, so
 * their surf behaves differently from island shores (see drawSplashSheet).
 */
const FLOATERS = new Set<SpriteVariant>(["ship", "bottle", "whale"]);

/**
 * Paints a looping sheet of surf around each sprite. Drawn with raw 1px
 * rects at art resolution — no supersampling — so the water has the same
 * hard, chunky pixels as the background ocean.
 *
 * All layers are phase-driven so the 12-frame loop is seamless, and the mix
 * depends on what the sprite is:
 *
 * Islands (land rising out of the sea):
 * 1. wavelets — three arcs per loop roll IN toward the shore, turning from
 *    aqua to white as they steepen, then burst on contact
 * 2. foam collar — a continuous churning band hugging the waterline
 * 3. spray + backwash — droplets kicked up where wavelets land, and streaks
 *    sliding back out as the water drains
 *
 * Floaters (ship, bottle, whale — objects riding the swell):
 * 1. bob ripples — rings pushed OUTWARD by the hull, dissolving as they
 *    spread (the reverse of the islands' incoming wavelets)
 * 2. the same foam collar, as water sloshing against the hull
 * 3. lighter spray — an occasional slap of chop, not a breaking wave
 *
 * Everyone gets a few blinking glints on the surrounding water.
 * Only the front-facing arc is painted (the sprite hides the back shore).
 */
export function drawSplashSheet(variant: SpriteVariant): HTMLCanvasElement {
  const [w, h] = SPRITE_SIZES[variant];
  const k = DRAW_SCALE[variant]; // geometry → canvas pixels
  const [cx, cy, rx, ry] = SPLASH_GEOM[variant].map((v) => v * k) as [
    number,
    number,
    number,
    number,
  ];

  const sheet = document.createElement("canvas");
  sheet.width = w * SPLASH_FRAMES;
  sheet.height = h;
  const g = sheet.getContext("2d")!;

  const FOAM = "#ffffff";
  const SOFT = "#e9fbff";
  const PALE = "#bfeffa";
  const AQUA = "#7ce8ec";

  for (let f = 0; f < SPLASH_FRAMES; f++) {
    const t = f / SPLASH_FRAMES;
    const ox = f * w;
    const px = (x: number, y: number, c: string) => {
      if (y < 0 || y > h - 1 || x < 0 || x > w - 1) return;
      g.fillStyle = c;
      g.fillRect(ox + Math.round(x), Math.round(y), 1, 1);
    };

    const N = Math.round(rx * 2.6); // fine angular sampling → connected runs
    const floater = FLOATERS.has(variant);

    if (floater) {
      // --- 1f. bob ripples: rings pushed outward, dissolving as they go ---
      for (let rp = 0; rp < 3; rp++) {
        const u = (t + rp / 3) % 1; // 0 at the hull → 1 far out
        const spread = u * 7 + 0.8;
        const aOff = rnd(rp * 21.7) * TAU;
        for (let i = 0; i < N; i++) {
          const a = (i / N) * TAU;
          if (Math.sin(a) < -0.2) continue;
          // broken dashes so rings read as pixel ripples, not drawn ovals
          if (Math.sin(a * 3.1 + aOff + u * 2.2) < 0.05) continue;
          // rings thin out and break apart as they dissolve
          if (rnd(i * 6.3 + rp * 13) < u * 0.65) continue;
          const jig = (rnd(i * 4.7 + rp * 19) - 0.5) * 0.9;
          const x = cx + Math.cos(a) * (rx + spread + jig);
          const y = cy + Math.sin(a) * (ry + spread * 0.42 + jig * 0.4);
          px(x, y, u < 0.3 ? SOFT : u < 0.62 ? PALE : AQUA);
        }
      }
    } else {
      // --- 1. incoming wavelets: three staggered arcs rolling toward shore ---
      for (let wv = 0; wv < 3; wv++) {
        const u = (t + wv / 3) % 1; // 0 far out → 1 hits the shore
        const dist = (1 - u) * 6.5 + 1.2; // approach distance
        const aOff = rnd(wv * 17.3) * TAU;
        for (let i = 0; i < N; i++) {
          const a = (i / N) * TAU;
          if (Math.sin(a) < -0.2) continue;
          // wavelets are broken arcs, not full rings
          const seg = Math.sin(a * 2.2 + aOff + u * 1.5);
          if (seg < -0.15) continue;
          const jig = (rnd(i * 3.9 + wv * 31) - 0.5) * 0.9;
          const x = cx + Math.cos(a) * (rx + dist + jig);
          const y = cy + Math.sin(a) * (ry + dist * 0.45 + jig * 0.4);
          // steepening: aqua far out, pale mid, white sheet just before impact
          if (u > 0.78) {
            px(x, y, FOAM);
            if (seg > 0.5) px(x + Math.sign(Math.cos(a)), y, SOFT);
          } else if (u > 0.5) {
            px(x, y, PALE);
          } else if (rnd(i * 5.1 + wv) > 0.35) {
            px(x, y, AQUA);
          }
        }
      }
    }

    // --- 2. churning foam collar hugging the shore ---
    for (let i = 0; i < N; i++) {
      const a = (i / N) * TAU;
      if (Math.sin(a) < -0.3) continue;
      // two traveling churn waves, like the background ocean's sine fields
      const churn =
        Math.sin(t * TAU + i * 1.7 + rnd(i * 3.3) * 1.4) * 0.6 +
        Math.sin(-t * TAU * 2 + i * 0.7) * 0.4;
      const x = cx + Math.cos(a) * (rx + 0.5 + churn);
      const y = cy + Math.sin(a) * (ry + 0.3 + churn * 0.5);
      if (churn > 0.45) {
        px(x, y, FOAM);
        px(x + 1, y, SOFT); // 2px runs read as a froth band, not lone dots
        if (churn > 0.8) px(x, y - 1, SOFT);
      } else if (churn > -0.15) {
        px(x, y, SOFT);
      } else if (churn > -0.55) {
        px(x, y, PALE);
      } else if (rnd(i * 7.7 + f) > 0.55) {
        px(x, y, AQUA);
      }
    }

    // --- 3a. spray bursts with gravity where the water strikes ---
    // floaters take an occasional slap of chop; shores take breaking waves
    const sprayCount = floater ? 5 : 9;
    for (let j = 0; j < sprayCount; j++) {
      const a = (0.06 + rnd(j * 13.7) * 0.88) * Math.PI; // front arc
      const bx = cx + Math.cos(a) * (rx + 0.5);
      const by = cy + Math.sin(a) * (ry + 0.3);
      const life = (t + rnd(j * 5.1)) % 1;
      if (life > 0.9) continue;
      const power = (floater ? 0.45 : 0.6) + rnd(j * 8.3) * (floater ? 0.55 : 0.8);
      const drift = Math.cos(a) * 2.2 * life; // spray thrown outward
      const rise = 6 * power * life - 7 * power * life * life; // parabola
      // main droplet + trailing droplets behind it on the same arc
      px(bx + drift, by - rise * 1.6, FOAM);
      px(bx + drift * 0.75, by - rise * 1.25, SOFT);
      px(bx + drift * 0.5, by - rise * 0.85, PALE);
      if (power > 1 && life > 0.2 && life < 0.75) {
        px(bx + drift + Math.sign(drift || 1), by - rise * 1.6 + 1, SOFT);
      }
      // impact burst as the spray lands back on the water
      if (life > 0.7) {
        px(bx - 1.5, by + 0.5, SOFT);
        px(bx + 1.5, by + 0.5, SOFT);
        px(bx, by + 1, PALE);
        px(bx + 3, by + 0.8, AQUA);
        px(bx - 3, by + 0.8, AQUA);
      }
    }

    // --- 3b. backwash: streaks draining outward and dissolving ---
    // shore-only: floaters' outbound water is already the ripple rings
    if (!floater) {
      for (let i = 0; i < N; i += 2) {
        const a = (i / N) * TAU + 0.35;
        if (Math.sin(a) < -0.1) continue;
        const u = (t + rnd(i * 9.7)) % 1;
        if (u > 0.85 || rnd(i * 2.9) < 0.4) continue;
        const x = cx + Math.cos(a) * (rx + 1.2 + u * 4.5);
        const y = cy + Math.sin(a) * (ry + 0.7 + u * 2);
        px(x, y, u < 0.3 ? SOFT : u < 0.6 ? PALE : AQUA);
        // short trail pointing back toward the shore
        if (u < 0.5) px(x - Math.sign(Math.cos(a)), y - (Math.sin(a) > 0 ? 1 : 0), PALE);
      }
    }

    // --- 4. glints: stray pixels of light blinking on the nearby water ---
    for (let s = 0; s < 5; s++) {
      const a = rnd(s * 23.1 + 3) * TAU;
      if (Math.sin(a) < -0.1) continue;
      const life = (t * 2 + rnd(s * 11.7)) % 1; // two blinks per loop
      if (life > 0.3) continue;
      const x = cx + Math.cos(a) * (rx + 3.5 + rnd(s * 7.9) * 5.5);
      const y = cy + Math.sin(a) * (ry + 2 + rnd(s * 5.3) * 3);
      px(x, y, life < 0.15 ? FOAM : SOFT);
    }
  }
  return sheet;
}

/* ------------------------------- render ------------------------------- */

const PAINTERS: Record<SpriteVariant, (g: Ctx) => void> = {
  volcano: drawVolcano,
  lighthouse: drawLighthouse,
  palm: drawJungle,
  mountain: drawMountain,
  hut: drawVillage,
  bottle: drawBottle,
  whale: drawWhale,
  ship: drawShip,
};

/**
 * Generic pipeline: paints at supersample resolution and downscales to the
 * art-pixel grid, baking in soft anti-aliased shading. Client-side only.
 */
export function rasterize(
  painter: (g: Ctx) => void,
  w: number,
  h: number,
  scale = 1
): HTMLCanvasElement {
  const big = document.createElement("canvas");
  big.width = w * SS;
  big.height = h * SS;
  const bg = big.getContext("2d")!;
  bg.scale(SS * scale, SS * scale);
  painter(bg);

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const og = out.getContext("2d")!;
  og.imageSmoothingEnabled = true;
  og.imageSmoothingQuality = "high";
  og.drawImage(big, 0, 0, w, h);
  return out;
}

/** Paints one of the island-scene sprites onto its art-pixel grid. */
export function drawSpriteCanvas(variant: SpriteVariant): HTMLCanvasElement {
  const [w, h] = SPRITE_SIZES[variant];
  return rasterize(PAINTERS[variant], w, h, DRAW_SCALE[variant]);
}
