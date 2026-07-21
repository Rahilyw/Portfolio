/**
 * Procedural sprite-sheet painter for the cursor surfer.
 *
 * Each of the 12 frames is drawn with canvas vector shapes (gradients,
 * capsule limbs, particle systems) at 4x supersample resolution, then
 * downscaled to the 64x64 sprite grid. The downscale bakes in soft
 * anti-aliasing and volumetric shading — the late-GBA / early-PS2 look —
 * while nearest-neighbor upscaling at display time keeps pixels crisp.
 *
 * The rider is drawn alone — no trailing swell. A small bow spray and
 * rooster tail hint at speed; the interactive wake beneath the cursor
 * (see Surfer.tsx) handles the water animation.
 *
 * Every animation channel is a function of frame phase (t in [0,1)), so the
 * 12-frame loop is seamless: the surfer pumps through a crouch-extend cycle
 * and the spray particles cycle per loop.
 */

export const FRAME_COUNT = 12;
export const FRAME_SIZE = 64;
const SS = 4; // supersample factor

const TAU = Math.PI * 2;

/** Deterministic hash → [0,1). Same seed, same value, every build. */
function rnd(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

const C = {
  foamSoft: "#e9fbff",
  foam: "#ffffff",
  sun: "#fff4d6",
  light: "#55ddff",
  // rider — bright retro palette (Sims Castaway / pixel-surf refs)
  skinL: "#ffc88a",
  skin: "#e8a060",
  skinD: "#c87840",
  hair: "#ffcc00",
  hairL: "#ff9900",
  shorts: "#ccff00",
  shortsD: "#99dd00",
  shortsPat: "#ff8800",
  boardNose: "#ffff00",
  boardMid: "#ff9900",
  boardTail: "#ff4499",
  boardStripe: "#ffff66",
  fin: "#00ccff",
};

type Ctx = CanvasRenderingContext2D;

/** Two-segment limb (hip→knee→foot / shoulder→elbow→hand) with round caps. */
function limb(g: Ctx, pts: number[], w: number, color: string) {
  g.strokeStyle = color;
  g.lineWidth = w;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(pts[0], pts[1]);
  g.quadraticCurveTo(pts[2], pts[3], pts[4], pts[5]);
  g.stroke();
}

function dot(g: Ctx, x: number, y: number, r: number, color: string, alpha = 1) {
  g.globalAlpha = alpha;
  g.fillStyle = color;
  g.beginPath();
  g.arc(x, y, r, 0, TAU);
  g.fill();
  g.globalAlpha = 1;
}

/* ----------------------------- the surfer ----------------------------- */

function drawSurfer(g: Ctx, t: number, phase: number) {
  // animation channels
  const bob = Math.sin(phase) * 1.1; // crouch (+) / extend (-)
  const sway = Math.sin(phase + 1.3) * 0.7; // weight shifting fore/aft
  const pitch = (Math.sin(phase + 0.6) * 3 * Math.PI) / 180;

  g.save();
  // whole rider+board group tilts as one — nose lifted, planing across the
  // water the way a real board rides (tail sits low, nose rides up)
  g.translate(20, 41.5);
  g.rotate(0.08 + pitch);
  g.translate(-20, -41.5);

  // contact shadow grounding the board on the water — sea-dark, not black
  g.fillStyle = "rgba(23, 79, 158, 0.45)";
  g.beginPath();
  g.ellipse(20.5, 45.7, 14.8, 1.5, 0, 0, TAU);
  g.fill();

  /* board — slightly longer + thicker; yellow-orange nose fading into hot-pink tail */
  const deck = g.createLinearGradient(4, 42, 37, 44);
  deck.addColorStop(0, C.boardNose);
  deck.addColorStop(0.38, C.boardMid);
  deck.addColorStop(0.62, C.boardTail);
  deck.addColorStop(1, "#ff66bb");
  g.fillStyle = deck;
  g.beginPath();
  g.moveTo(5.0, 42.3); // nose tip — extended ~15%
  g.quadraticCurveTo(11.5, 41.0, 21, 41.4);
  g.quadraticCurveTo(30.5, 41.7, 36.2, 42.6);
  g.quadraticCurveTo(37.2, 43.4, 35.8, 44.6);
  g.quadraticCurveTo(25, 46.1, 12.5, 45.3);
  g.quadraticCurveTo(7.2, 44.5, 5.0, 42.3);
  g.closePath();
  g.fill();
  // skeg under the tail
  g.fillStyle = C.fin;
  g.beginPath();
  g.moveTo(31.8, 44.8);
  g.lineTo(34.8, 44.5);
  g.quadraticCurveTo(36.2, 46.6, 36.8, 48.4);
  g.quadraticCurveTo(34.6, 47.8, 33.2, 46.6);
  g.quadraticCurveTo(32.2, 45.7, 31.8, 44.8);
  g.closePath();
  g.fill();
  // lit edge on the fin
  g.strokeStyle = C.foamSoft;
  g.globalAlpha = 0.85;
  g.lineWidth = 0.55;
  g.beginPath();
  g.moveTo(34.8, 44.7);
  g.quadraticCurveTo(36.0, 46.6, 36.5, 48.0);
  g.stroke();
  g.globalAlpha = 1;
  // bright center stripe down the deck
  g.strokeStyle = C.boardStripe;
  g.globalAlpha = 0.95;
  g.lineWidth = 1.0;
  g.beginPath();
  g.moveTo(8, 42.8);
  g.quadraticCurveTo(20, 42.2, 34, 43.0);
  g.stroke();
  // nose glint
  g.globalAlpha = 0.9;
  g.strokeStyle = C.foam;
  g.lineWidth = 0.7;
  g.beginPath();
  g.moveTo(6.2, 42.0);
  g.quadraticCurveTo(11, 41.2, 16, 41.3);
  g.stroke();
  g.globalAlpha = 1;

  /* pose skeleton (group space) — real surf stance: low center of gravity,
     knees driven over the board, torso arched forward, arms out at balance
     height (leading arm reaching down the line, trailing arm countering) */
  const hipX = 20.2 + sway * 0.4;
  const hipY = 35 + bob;
  const shX = 16.9 + sway * 0.2; // shoulders, leaning into the wave
  const shY = 27.8 + bob * 0.55;

  // back (trailing) leg first, in shadow tone — deep bend, driving the tail
  limb(g, [hipX + 1, hipY + 0.4, 26.8, 37.8 + bob * 0.6, 27, 42.1], 2.3, C.skinD);
  // calf bulge
  dot(g, 26.9, 39.7 + bob * 0.4, 1.05, C.skinD);

  // trailing arm — out and slightly raised behind, countering the turn
  const armSwing = Math.sin(phase + 0.9);
  limb(
    g,
    [shX + 1.4, shY + 0.5, 23, 26 + armSwing * 0.7, 26.6, 24.6 + armSwing * 1.3],
    1.6,
    C.skinD
  );
  dot(g, 26.7, 24.7 + armSwing * 1.3, 0.85, C.skinD);

  /* torso — arched forward, volumetric skin ramp */
  const body = g.createLinearGradient(shX + 3, shY - 2, hipX - 3, hipY + 2);
  body.addColorStop(0, C.skinL);
  body.addColorStop(0.55, C.skin);
  body.addColorStop(1, C.skinD);
  g.fillStyle = body;
  g.beginPath();
  g.moveTo(shX - 1.8, shY - 0.4);
  g.quadraticCurveTo(shX + 0.4, shY - 2, shX + 2.3, shY - 0.6); // shoulder line
  g.quadraticCurveTo(hipX + 2.6, hipY - 3.4, hipX + 2, hipY + 0.8); // lat sweep
  g.quadraticCurveTo(hipX, hipY + 1.8, hipX - 2, hipY + 0.6);
  g.quadraticCurveTo(shX - 2.6, hipY - 4.4, shX - 1.8, shY - 0.4); // chest arch
  g.closePath();
  g.fill();
  // muscle definition: ab line + pec crease (soft, reads as tone after downscale)
  g.strokeStyle = C.skinD;
  g.globalAlpha = 0.55;
  g.lineWidth = 0.55;
  g.beginPath();
  g.moveTo(shX + 0.9, shY + 2.4);
  g.quadraticCurveTo(hipX - 0.2, hipY - 3.2, hipX - 0.1, hipY - 0.6);
  g.stroke();
  g.beginPath();
  g.moveTo(shX - 1, shY + 1.5);
  g.quadraticCurveTo(shX + 0.6, shY + 2.2, shX + 2, shY + 1.7);
  g.stroke();
  g.globalAlpha = 1;

  /* boardshorts over hips + upper thighs — lime with orange accent patches */
  g.fillStyle = C.shorts;
  g.beginPath();
  g.ellipse(hipX, hipY + 0.4, 2.9, 2, -0.15, 0, TAU);
  g.fill();
  dot(g, hipX - 1.2, hipY + 0.8, 0.75, C.shortsPat, 0.9);
  dot(g, hipX + 1.4, hipY + 0.5, 0.65, C.shortsPat, 0.85);
  limb(g, [hipX - 0.4, hipY + 0.6, 16.4, 36.6 + bob * 0.5, 14.8, 37.8 + bob * 0.5], 2.7, C.shorts);
  limb(g, [hipX + 1, hipY + 0.6, 24.2, 36.2 + bob * 0.5, 25.2, 37.2 + bob * 0.5], 2.7, C.shortsD);

  // front (leading) leg — knee driven forward over the nose-side rail
  limb(g, [15.8, 37.4 + bob * 0.5, 12.6, 38.8 + bob * 0.7, 13.6, 42.3], 2.1, C.skin);
  dot(g, 13.2, 40.2 + bob * 0.5, 0.95, C.skin);

  /* leading arm — extended forward down the line, near-horizontal, the way
     a surfer reads the wave ahead (not raised overhead) */
  limb(g, [shX - 0.6, shY + 0.3, 12.3, 27 + sway * 0.4, 8.8, 25.8 + sway * 0.7], 1.7, C.skin);
  dot(g, 8.7, 25.7 + sway * 0.7, 0.9, C.skinL);
  // deltoids
  dot(g, shX - 0.4, shY, 1.35, C.skin);
  dot(g, shX + 1.5, shY + 0.5, 1.3, C.skinD);

  /* head + hair — eyes down the line, chin tucked toward the lead shoulder */
  g.strokeStyle = C.skin;
  g.lineWidth = 1.5;
  g.beginPath();
  g.moveTo(shX + 0.2, shY - 0.4);
  g.lineTo(15.5, shY - 2.4);
  g.stroke();
  const hx = 15.2;
  const hy = shY - 3.9;
  dot(g, hx, hy, 2.5, C.skin);
  dot(g, hx - 0.9, hy + 0.3, 1.1, C.skinL, 0.7); // lit cheek, facing travel
  // swept-back hair
  g.fillStyle = C.hair;
  g.beginPath();
  g.arc(hx, hy, 2.6, Math.PI * 0.85, Math.PI * 1.95);
  g.quadraticCurveTo(hx + 3.4, hy + 0.4, hx + 2.2, hy + 1.6);
  g.quadraticCurveTo(hx + 1.6, hy - 0.4, hx - 0.4, hy - 0.2);
  g.closePath();
  g.fill();
  g.strokeStyle = C.hairL;
  g.globalAlpha = 0.8;
  g.lineWidth = 0.5;
  g.beginPath();
  g.arc(hx, hy, 2, Math.PI * 1.1, Math.PI * 1.7);
  g.stroke();
  g.globalAlpha = 1;

  /* sun rim-light along the up-wave contour */
  g.strokeStyle = C.sun;
  g.globalAlpha = 0.5;
  g.lineWidth = 0.55;
  g.beginPath();
  g.arc(hx, hy, 2.5, -Math.PI * 0.45, Math.PI * 0.05);
  g.stroke();
  g.beginPath();
  g.moveTo(shX + 2.2, shY + 0.2);
  g.quadraticCurveTo(hipX + 2.7, hipY - 3.2, hipX + 2, hipY + 0.6);
  g.stroke();
  g.globalAlpha = 1;

  /* bow spray where the nose slices the face */
  for (let i = 0; i < 4; i++) {
    dot(
      g,
      8 + rnd(i * 5.3) * 4,
      44.2 + rnd(i * 2.7) * 1.2 - Math.sin(phase + i) * 0.4,
      0.7 + rnd(i) * 0.5,
      C.foam,
      0.9
    );
  }

  g.restore();
}

/* rooster tail — spray fan kicked off the tail, particles cycle per loop */
function drawRoosterTail(g: Ctx, t: number) {
  const ox = 34.5;
  const oy = 42.0;
  for (let i = 0; i < 16; i++) {
    const life = (t + rnd(i * 7.7)) % 1;
    const h = 6.5 + rnd(i * 3.1) * 5.5;
    const x = ox + life * (10 + rnd(i * 13.7) * 4);
    const y = oy - h * 4 * life * (1 - life) + life * 2.5;
    const col = life < 0.35 ? C.foam : life < 0.7 ? C.foamSoft : C.light;
    dot(g, x, y, (1 - life) * 1.5 + 0.5, col, 0.95 * (1 - life * 0.75));
  }
  // dense white core right at the tail
  for (let i = 0; i < 4; i++) {
    dot(g, ox + rnd(i * 4.9) * 2.5, oy - rnd(i * 8.3) * 2, 1 + rnd(i) * 0.7, C.foam, 0.95);
  }
}

/* ------------------------------ the sheet ------------------------------ */

function drawFrame(g: Ctx, frame: number) {
  const t = frame / FRAME_COUNT;
  const phase = t * TAU;
  // center the rider in the frame — no trailing swell
  g.save();
  g.translate(8, 4);
  g.scale(0.92, 0.92);
  drawSurfer(g, t, phase);
  drawRoosterTail(g, t);
  g.restore();
}

/**
 * Renders the full horizontal sprite sheet (FRAME_COUNT frames of
 * FRAME_SIZE x FRAME_SIZE) and returns it as a canvas. Client-side only.
 */
export function drawSurferSheet(): HTMLCanvasElement {
  const sheet = document.createElement("canvas");
  sheet.width = FRAME_COUNT * FRAME_SIZE;
  sheet.height = FRAME_SIZE;
  const sctx = sheet.getContext("2d")!;
  sctx.imageSmoothingEnabled = true;
  sctx.imageSmoothingQuality = "high";

  const big = document.createElement("canvas");
  big.width = FRAME_SIZE * SS;
  big.height = FRAME_SIZE * SS;
  const bctx = big.getContext("2d")!;

  for (let f = 0; f < FRAME_COUNT; f++) {
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.clearRect(0, 0, big.width, big.height);
    bctx.scale(SS, SS);
    drawFrame(bctx, f);
    // supersample → sprite grid: this downscale is what bakes in the AA
    sctx.drawImage(big, f * FRAME_SIZE, 0, FRAME_SIZE, FRAME_SIZE);
  }
  return sheet;
}
