/**
 * Procedural painters for the ocean scene's decorative easter-egg sprites:
 * sea life (shark fin, leaping dolphin, wandering sailboat) and sky life
 * (clouds, gulls, hot air balloon, banner plane, sun, moon).
 *
 * Same pipeline as the islands (islandArt.ts): vector shapes painted at 4x
 * supersample, downscaled onto an art-pixel grid, displayed with
 * nearest-neighbor upscaling for the chunky pixel look.
 *
 * Directional sprites (boat, fin, dolphin, plane, gull) all face RIGHT;
 * flip with scaleX(-1) to travel left.
 */

import { dot, poly, stroke, speckle, rnd, rasterize, type Ctx } from "./islandArt";

export type DecorKind =
  | "sailboat"
  | "sharkFin"
  | "dolphin"
  | "balloon"
  | "plane"
  | "sun"
  | "moon"
  | "gull"
  | "cloud0"
  | "cloud1"
  | "cloud2";

/* ------------------------------ sea life ------------------------------ */

/** Little sloop that wanders the horizon. Bow to the right, waterline y≈54. */
function drawSailboat(g: Ctx) {
  // shallow-water glow under the hull
  g.globalAlpha = 0.3;
  g.fillStyle = "#7ce8ec";
  g.beginPath();
  g.ellipse(36, 55.5, 27, 3.2, 0, 0, Math.PI * 2);
  g.fill();
  g.globalAlpha = 1;

  // forestay + backstay rigging (behind everything)
  stroke(g, [[34, 7], [62, 44.5]], 0.4, "#4c3a26", 0.6);
  stroke(g, [[34, 7], [11, 44.5]], 0.4, "#4c3a26", 0.5);

  // mast + boom
  g.fillStyle = "#6b4226";
  g.fillRect(33.2, 6, 1.6, 40);
  stroke(g, [[34, 42.5], [56, 44]], 1.1, "#5c3a1e");

  // jib (forward sail) — slightly darker cream, behind the main
  g.fillStyle = "#eee2c2";
  g.beginPath();
  g.moveTo(35, 10);
  g.quadraticCurveTo(52, 26, 60, 43.5);
  g.quadraticCurveTo(48, 45, 37, 43.5);
  g.closePath();
  g.fill();
  stroke(g, [[44, 26], [46, 42]], 0.5, "#d2c294", 0.7);

  // mainsail — billowing cream with seams and a patch
  const sail = g.createLinearGradient(35, 0, 58, 0);
  sail.addColorStop(0, "#fbf4e2");
  sail.addColorStop(1, "#e2d4ac");
  g.fillStyle = sail;
  g.beginPath();
  g.moveTo(35, 8.5);
  g.quadraticCurveTo(38, 26, 35.5, 42.5);
  g.quadraticCurveTo(46, 44.6, 55.5, 43.4);
  g.quadraticCurveTo(50, 24, 35, 8.5);
  g.closePath();
  g.fill();
  stroke(g, [[37.5, 17], [40.5, 17.6]], 0.4, "#cdbc8e", 0.7);
  stroke(g, [[37, 25], [45.5, 26.4]], 0.4, "#cdbc8e", 0.7);
  stroke(g, [[36.5, 33.5], [50.5, 35.2]], 0.4, "#cdbc8e", 0.7);
  g.fillStyle = "#dccca0";
  g.fillRect(41, 29, 2.4, 2.4);
  // leech shade
  stroke(g, [[50, 25], [54, 36], [55, 43]], 1, "#cbb884", 0.5);

  // pennant streaming aft from the masthead
  poly(g, [[33.4, 5.2], [26, 6.8], [33.4, 8.4]], "#ff5f35");

  // hull — planked, warm red-brown, bow to the right
  const hull = g.createLinearGradient(0, 45, 0, 56);
  hull.addColorStop(0, "#c65a32");
  hull.addColorStop(0.55, "#964122");
  hull.addColorStop(1, "#5c2814");
  g.fillStyle = hull;
  g.beginPath();
  g.moveTo(9, 45);
  g.lineTo(63, 45);
  g.lineTo(54, 55.5);
  g.quadraticCurveTo(36, 57.5, 19, 55.5);
  g.closePath();
  g.fill();
  // gunwale stripe + plank seams
  stroke(g, [[9.5, 46.3], [62, 46.3]], 1, "#f6ead0", 0.95);
  stroke(g, [[12, 49.8], [59, 49.8]], 0.5, "#5c2814", 0.55);
  stroke(g, [[15, 52.8], [56, 52.8]], 0.5, "#5c2814", 0.5);
  // brass portholes
  [24, 34, 44].forEach((px) => {
    dot(g, px, 50.6, 1.15, "#caa04a");
    dot(g, px, 50.6, 0.6, "#1d3557");
  });
  // tiller + tiny lantern at the stern
  stroke(g, [[10.5, 44.8], [7.5, 42.5]], 0.7, "#5c3a1e");
  dot(g, 7.3, 41.8, 0.8, "#ffd23e");

  // bow spray + stern wake
  dot(g, 60.5, 54.5, 1, "#ffffff", 0.9);
  dot(g, 63.5, 55.5, 0.7, "#e9fbff", 0.8);
  dot(g, 14, 55.8, 0.9, "#e9fbff", 0.8);
  dot(g, 9.5, 56.4, 0.7, "#bfeffa", 0.7);
  stroke(g, [[6, 56.2], [16, 56.8]], 0.6, "#e9fbff", 0.5);
}

/** Dorsal fin cutting the water, moving right. Waterline y≈26. */
function drawSharkFin(g: Ctx) {
  // tail-fin tip trailing behind, just breaking the surface
  poly(g, [[1, 20.5], [6.5, 26.5], [0, 26.5]], "#2c4458", 0.95);
  stroke(g, [[1.4, 21.5], [2.6, 24.5]], 0.5, "#4a6a84", 0.7);

  // dorsal fin: long convex leading edge (right), raked tip pointing back
  const fin = g.createLinearGradient(0, 3, 0, 27);
  fin.addColorStop(0, "#5a7a94");
  fin.addColorStop(0.65, "#3a566e");
  fin.addColorStop(1, "#26404f");
  g.fillStyle = fin;
  g.beginPath();
  g.moveTo(10, 27.5);
  g.lineTo(33, 27.5);
  g.quadraticCurveTo(29, 14, 19.5, 4);
  g.quadraticCurveTo(15.5, 9.5, 13.5, 16);
  g.quadraticCurveTo(11.8, 21.5, 10, 27.5);
  g.closePath();
  g.fill();
  // wet sheen down the leading edge + shaded trailing edge
  stroke(g, [[31.5, 25], [26.5, 14.5], [20.5, 6]], 0.9, "#8fb2c8", 0.75);
  stroke(g, [[18.5, 6.5], [14.5, 15.5], [11.5, 24.5]], 0.8, "#1a2c3c", 0.6);
  // battle scar nicks
  stroke(g, [[22, 12], [24.5, 12.6]], 0.5, "#20323e", 0.8);
  stroke(g, [[19, 18], [22, 18.8]], 0.5, "#20323e", 0.7);
  speckle(g, 20, 20, 8, 5, "#6d8ca4", 10, 0.4, 3.3);

  // waterline churn + V-wake trailing off behind
  stroke(g, [[9, 27], [34, 27]], 1.1, "#ffffff", 0.9);
  stroke(g, [[6, 28.4], [36, 28.2]], 0.7, "#bfeffa", 0.7);
  stroke(g, [[10, 26.2], [0.5, 23.8]], 0.7, "#e9fbff", 0.75);
  stroke(g, [[10, 28.8], [0.5, 31]], 0.7, "#e9fbff", 0.7);
  dot(g, 34.5, 26, 0.8, "#ffffff", 0.9); // bow ripple at the leading base
  dot(g, 37, 27.4, 0.6, "#bfeffa", 0.8);
  dot(g, 3, 22.6, 0.5, "#bfeffa", 0.7);
  dot(g, 2, 32, 0.5, "#bfeffa", 0.65);
}

/** Dolphin mid-leap, arcing to the right, trailing droplets. */
function drawDolphin(g: Ctx) {
  // body — smooth arc, rostrum right, tail joint left
  const body = g.createLinearGradient(0, 4, 0, 34);
  body.addColorStop(0, "#6c9cc4");
  body.addColorStop(1, "#3f6a94");
  g.fillStyle = body;
  g.beginPath();
  g.moveTo(57, 25); // nose tip
  g.bezierCurveTo(52, 10, 34, 4, 22, 11);
  g.bezierCurveTo(15, 15, 10, 22, 7, 28);
  g.lineTo(11, 30.5);
  g.bezierCurveTo(20, 26.5, 30, 28, 40, 31);
  g.quadraticCurveTo(51, 32.5, 57, 25);
  g.closePath();
  g.fill();

  // pale belly along the underside
  g.fillStyle = "#dceaf4";
  g.beginPath();
  g.moveTo(54, 27.5);
  g.quadraticCurveTo(44, 31.5, 32, 29.2);
  g.quadraticCurveTo(22, 27.5, 13, 29.8);
  g.quadraticCurveTo(24, 30.5, 36, 31.6);
  g.quadraticCurveTo(48, 32, 54, 27.5);
  g.closePath();
  g.fill();

  // dorsal fin curving back
  g.fillStyle = "#35597c";
  g.beginPath();
  g.moveTo(30, 7.5);
  g.quadraticCurveTo(33, 0.5, 38.5, 1.5);
  g.quadraticCurveTo(37, 4.5, 37.5, 7.2);
  g.closePath();
  g.fill();

  // pectoral fin
  g.fillStyle = "#2f5174";
  g.beginPath();
  g.moveTo(40, 28.5);
  g.quadraticCurveTo(45, 33.5, 43.5, 37.5);
  g.quadraticCurveTo(37.5, 33.5, 36, 29.6);
  g.closePath();
  g.fill();

  // tail flukes
  g.fillStyle = "#3f6a94";
  g.beginPath();
  g.moveTo(9, 27);
  g.quadraticCurveTo(3, 21.5, 1, 23);
  g.quadraticCurveTo(4.5, 27, 4, 30);
  g.quadraticCurveTo(1.5, 34.5, 3.5, 36);
  g.quadraticCurveTo(8, 33.5, 12, 30.5);
  g.closePath();
  g.fill();
  stroke(g, [[4.5, 24.5], [6.5, 28.5]], 0.5, "#2f5174", 0.7);

  // rostrum crease + smile
  stroke(g, [[57, 25.2], [50, 27.6]], 0.6, "#243c56", 0.65);
  // eye with glint
  dot(g, 48.5, 21.5, 1.2, "#15243c");
  dot(g, 49, 21, 0.4, "#ffffff", 0.95);
  // blowhole + back sheen
  stroke(g, [[36.5, 6.2], [38, 6.4]], 0.6, "#243c56", 0.7);
  stroke(g, [[26, 10], [40, 6.5], [50, 12]], 1, "#a8cce8", 0.65);
  speckle(g, 34, 16, 14, 6, "#5a88b4", 12, 0.35, 7.7);

  // droplets flung off the arc
  dot(g, 5, 17, 0.7, "#ffffff", 0.85);
  dot(g, 2.5, 27, 0.6, "#bfeffa", 0.8);
  dot(g, 7, 38, 0.7, "#e9fbff", 0.8);
  dot(g, 14, 39.5, 0.55, "#bfeffa", 0.7);
  dot(g, 12, 8, 0.55, "#e9fbff", 0.7);
  dot(g, 52, 33, 0.6, "#e9fbff", 0.75);
}

/* ------------------------------ sky life ------------------------------ */

/** Hot air balloon with striped gores, wicker basket and burner flame. */
function drawBalloon(g: Ctx) {
  // envelope silhouette
  g.save();
  g.beginPath();
  g.moveTo(20, 1.5);
  g.bezierCurveTo(31, 1.5, 37, 9, 37, 17.5);
  g.bezierCurveTo(37, 26, 30, 32, 25.5, 36.5);
  g.lineTo(14.5, 36.5);
  g.bezierCurveTo(10, 32, 3, 26, 3, 17.5);
  g.bezierCurveTo(3, 9, 9, 1.5, 20, 1.5);
  g.closePath();
  g.fillStyle = "#f6ead0";
  g.fill();
  g.clip();

  // curved gore stripes, fanning from crown to skirt
  const gores: Array<[number, string]> = [
    [6, "#ff5f35"],
    [12.5, "#f2b134"],
    [20, "#e8402f"],
    [27.5, "#2a9d8f"],
    [34, "#ff5f35"],
  ];
  gores.forEach(([bx, color], i) => {
    g.strokeStyle = color;
    g.lineWidth = 6.4;
    g.beginPath();
    g.moveTo(20, 1.5);
    g.quadraticCurveTo(bx, 16 + rnd(i * 3.1) * 2, 14.5 + ((bx - 6) / 28) * 11, 37);
    g.stroke();
  });
  // seam lines between gores
  g.strokeStyle = "#7a3420";
  g.lineWidth = 0.35;
  g.globalAlpha = 0.4;
  [9.2, 16.2, 23.8, 30.8].forEach((bx, i) => {
    g.beginPath();
    g.moveTo(20, 1.5);
    g.quadraticCurveTo(bx, 16, 15.5 + i * 3, 37);
    g.stroke();
  });
  g.globalAlpha = 1;

  // shading: dark right limb, bright top-left highlight
  const shade = g.createLinearGradient(3, 0, 37, 0);
  shade.addColorStop(0, "rgba(255,255,255,0.22)");
  shade.addColorStop(0.35, "rgba(255,255,255,0)");
  shade.addColorStop(0.75, "rgba(40,20,40,0)");
  shade.addColorStop(1, "rgba(40,20,40,0.32)");
  g.fillStyle = shade;
  g.fillRect(0, 0, 40, 40);
  dot(g, 13, 8, 5, "#ffffff", 0.22);
  g.restore();

  // skirt + burner flame
  poly(g, [[14.5, 36.5], [25.5, 36.5], [23.5, 40], [16.5, 40]], "#7a3420");
  dot(g, 20, 42.2, 1.5, "#ff9a3e", 0.95);
  dot(g, 20, 41.6, 0.8, "#ffd23e");
  dot(g, 20, 42, 3, "#ffd23e", 0.22);

  // rigging ropes down to the basket
  stroke(g, [[15.5, 39.5], [16.5, 45.2]], 0.45, "#e8ddc2", 0.9);
  stroke(g, [[24.5, 39.5], [23.5, 45.2]], 0.45, "#e8ddc2", 0.9);
  stroke(g, [[18.5, 40], [18.8, 45.2]], 0.4, "#c9b78e", 0.85);
  stroke(g, [[21.5, 40], [21.2, 45.2]], 0.4, "#c9b78e", 0.85);

  // wicker basket with woven texture
  g.fillStyle = "#a4703c";
  g.fillRect(15, 45.2, 10, 7.5);
  g.fillStyle = "#6b4226";
  g.fillRect(14.4, 44.4, 11.2, 1.6);
  stroke(g, [[15, 47.6], [25, 47.6]], 0.4, "#7c5226", 0.8);
  stroke(g, [[15, 49.8], [25, 49.8]], 0.4, "#7c5226", 0.8);
  for (let i = 0; i < 5; i++) {
    stroke(g, [[16.2 + i * 1.9, 45.4], [16.2 + i * 1.9, 52.5]], 0.3, "#8a5a2e", 0.7);
  }
  stroke(g, [[15, 52.7], [25, 52.7]], 0.6, "#5c3a1e", 0.95);

  // sandbags on the rim
  dot(g, 14.2, 46.8, 1.2, "#d8c496");
  stroke(g, [[14.2, 45.6], [14.6, 44.9]], 0.35, "#8a6432", 0.9);
  dot(g, 25.8, 46.8, 1.2, "#d8c496");
  stroke(g, [[25.8, 45.6], [25.4, 44.9]], 0.35, "#8a6432", 0.9);

  // tiny passenger peeking out
  dot(g, 18.5, 43.9, 0.9, "#e8ddc2");
  dot(g, 18.5, 43.6, 0.5, "#5c3a1e"); // hair
}

/** Cheery red prop plane towing a striped banner. Nose to the right. */
function drawPlane(g: Ctx) {
  // banner, fluttering behind on a tow rope
  g.fillStyle = "#fbf4e2";
  g.beginPath();
  g.moveTo(2, 8.5);
  g.quadraticCurveTo(8, 7.2, 14, 8.5);
  g.quadraticCurveTo(20, 9.6, 25, 8.5);
  g.lineTo(25, 19.5);
  g.quadraticCurveTo(19, 20.8, 13, 19.5);
  g.quadraticCurveTo(7, 18.4, 2, 19.5);
  g.closePath();
  g.fill();
  g.strokeStyle = "#ff5f35";
  g.lineWidth = 0.8;
  g.stroke();
  // heart on the banner
  dot(g, 12, 12.6, 1.5, "#ff5f35");
  dot(g, 15, 12.6, 1.5, "#ff5f35");
  poly(g, [[10.6, 13.4], [16.4, 13.4], [13.5, 17.2]], "#ff5f35");
  // flutter creases
  stroke(g, [[8, 9], [8.4, 19]], 0.35, "#e0d2ac", 0.7);
  stroke(g, [[19, 9.4], [19.4, 19.6]], 0.35, "#e0d2ac", 0.7);
  // tow rope
  stroke(g, [[25, 14], [35, 15.2]], 0.45, "#8a7a5c", 0.85);

  // tail fin + horizontal stabilizer
  poly(g, [[35, 15.5], [37.5, 5.5], [44, 15.5]], "#e8402f");
  poly(g, [[37.2, 7.5], [38.5, 7.8], [36.8, 13.5], [36, 13]], "#fbf4e2", 0.9);
  poly(g, [[33.5, 14.2], [42, 14.2], [42, 16.4], [33.5, 16.4]], "#c22e1c");

  // fuselage — friendly rounded capsule
  const fus = g.createLinearGradient(0, 9, 0, 24);
  fus.addColorStop(0, "#f25438");
  fus.addColorStop(0.7, "#e8402f");
  fus.addColorStop(1, "#c22e1c");
  g.fillStyle = fus;
  g.beginPath();
  g.moveTo(38, 11.5);
  g.quadraticCurveTo(62, 7.5, 78, 10.5);
  g.quadraticCurveTo(86, 12, 86.5, 16.5);
  g.quadraticCurveTo(86, 21, 78, 22.5);
  g.quadraticCurveTo(58, 25.5, 41, 22);
  g.quadraticCurveTo(37, 19.5, 38, 11.5);
  g.closePath();
  g.fill();
  // cream belly band
  g.fillStyle = "#fbf4e2";
  g.beginPath();
  g.moveTo(41, 21.8);
  g.quadraticCurveTo(58, 25.2, 78, 22.4);
  g.quadraticCurveTo(83, 21.4, 85.5, 18.5);
  g.quadraticCurveTo(80, 22.6, 62, 22.8);
  g.quadraticCurveTo(50, 22.8, 41, 21.8);
  g.closePath();
  g.fill();

  // canopy with glint + pilot's white scarf trailing
  poly(g, [[64, 10.2], [72, 10.2], [70.2, 5.8], [66, 5.8]], "#9fdde8");
  stroke(g, [[66.5, 6.8], [68, 6.8]], 0.6, "#ffffff", 0.9);
  dot(g, 67.8, 8.6, 1, "#5c3a1e"); // pilot's head
  stroke(g, [[65.5, 9.5], [60, 7.5], [56, 8.5]], 0.8, "#ffffff", 0.9);

  // round windows
  [50, 56.5].forEach((wx) => {
    dot(g, wx, 14.5, 1.3, "#fbf4e2");
    dot(g, wx, 14.5, 0.85, "#9fdde8");
  });

  // low wing swooping toward the viewer
  const wing = g.createLinearGradient(0, 15, 0, 24);
  wing.addColorStop(0, "#c22e1c");
  wing.addColorStop(1, "#9c2214");
  g.fillStyle = wing;
  g.beginPath();
  g.moveTo(56, 15.5);
  g.lineTo(70, 15.5);
  g.quadraticCurveTo(66, 22.5, 57, 23.5);
  g.quadraticCurveTo(50, 23.5, 47, 21);
  g.closePath();
  g.fill();
  stroke(g, [[49, 21.4], [57, 22.6]], 0.6, "#fbf4e2", 0.85);

  // metal cowl + spinning prop
  poly(g, [[84, 11.5], [88, 13], [88, 20], [84, 21.5]], "#b8c4cc");
  stroke(g, [[85, 12.5], [85, 20.5]], 0.5, "#7a8894", 0.7);
  g.globalAlpha = 0.4;
  g.fillStyle = "#dfe9f4";
  g.beginPath();
  g.ellipse(90, 16.3, 1.6, 9.5, 0, 0, Math.PI * 2);
  g.fill();
  g.globalAlpha = 1;
  dot(g, 89, 16.3, 1.3, "#7a8894");
  dot(g, 89, 16.3, 0.6, "#ffd23e");

  // exhaust puffs
  dot(g, 80, 23.8, 0.8, "#dfe9f4", 0.6);
  dot(g, 76.5, 25, 0.6, "#dfe9f4", 0.45);
}

/** Warm pixel sun with chunky rays. */
function drawSun(g: Ctx) {
  // rays — alternating long / short around the disc
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const len = i % 2 ? 16 : 19;
    stroke(
      g,
      [
        [20 + Math.cos(a) * 13.5, 20 + Math.sin(a) * 13.5],
        [20 + Math.cos(a) * len, 20 + Math.sin(a) * len],
      ],
      i % 2 ? 1.4 : 2,
      i % 3 ? "#ffd23e" : "#ff9a3e",
      0.95
    );
  }
  // outer glow + core disc
  dot(g, 20, 20, 15, "#ffd23e", 0.18);
  const core = g.createRadialGradient(16.5, 16.5, 2, 20, 20, 12);
  core.addColorStop(0, "#fff3b0");
  core.addColorStop(0.55, "#ffd23e");
  core.addColorStop(1, "#ff9a3e");
  g.fillStyle = core;
  g.beginPath();
  g.arc(20, 20, 11.5, 0, Math.PI * 2);
  g.fill();
  // rim shade + sparkle
  g.strokeStyle = "#f27d2e";
  g.lineWidth = 1;
  g.globalAlpha = 0.6;
  g.beginPath();
  g.arc(20, 20, 11.2, 0.15 * Math.PI, 0.85 * Math.PI);
  g.stroke();
  g.globalAlpha = 1;
  speckle(g, 20, 20, 8, 8, "#ffb84e", 14, 0.4, 5.1);
  dot(g, 15.5, 14.5, 1.6, "#fff8d0", 0.9);
}

/** Gibbous moon with craters and a soft halo. */
function drawMoon(g: Ctx) {
  dot(g, 20, 20, 15.5, "#e8ecf8", 0.14); // halo
  const disc = g.createRadialGradient(15.5, 15.5, 2, 20, 20, 13);
  disc.addColorStop(0, "#fcfaf0");
  disc.addColorStop(0.6, "#eceadc");
  disc.addColorStop(1, "#c8c4ac");
  g.fillStyle = disc;
  g.beginPath();
  g.arc(20, 20, 12.5, 0, Math.PI * 2);
  g.fill();
  // terminator shading on the lower-right limb
  g.fillStyle = "#a8a48c";
  g.globalAlpha = 0.55;
  g.beginPath();
  g.arc(20, 20, 12.5, -0.25 * Math.PI, 0.75 * Math.PI);
  g.quadraticCurveTo(24, 24, 28.8, 11.2);
  g.fill();
  g.globalAlpha = 1;
  // craters — rimmed dishes of varied size
  const craters: Array<[number, number, number]> = [
    [14.5, 15, 2.4],
    [23, 12.5, 1.6],
    [18, 24.5, 2],
    [25.5, 21.5, 1.3],
    [12.5, 22, 1.1],
    [21, 18, 0.8],
  ];
  craters.forEach(([cx, cy, r]) => {
    dot(g, cx, cy, r, "#c2bea4", 0.9);
    dot(g, cx + r * 0.2, cy + r * 0.25, r * 0.6, "#a8a48c", 0.8);
    stroke(g, [[cx - r * 0.7, cy - r * 0.55], [cx + r * 0.3, cy - r * 0.8]], 0.4, "#fcfaf0", 0.7);
  });
  speckle(g, 19, 19, 9, 9, "#b8b49c", 16, 0.35, 9.3);
  // twinkle companions
  stroke(g, [[35, 8], [35, 11]], 0.7, "#f5f9ff", 0.9);
  stroke(g, [[33.5, 9.5], [36.5, 9.5]], 0.7, "#f5f9ff", 0.9);
  dot(g, 5, 30, 0.7, "#dfe9f4", 0.85);
}

/** Gliding gull, beak to the right. */
function drawGull(g: Ctx) {
  // far wing raised behind
  g.fillStyle = "#d4dde4";
  g.beginPath();
  g.moveTo(13, 9.5);
  g.quadraticCurveTo(8, 3.5, 2.5, 3);
  g.quadraticCurveTo(7, 7, 11.5, 11);
  g.closePath();
  g.fill();
  poly(g, [[4.5, 3.6], [2.5, 3], [4, 5.2]], "#2b3a44"); // dark tip

  // body
  const body = g.createLinearGradient(0, 8, 0, 15);
  body.addColorStop(0, "#ffffff");
  body.addColorStop(1, "#dbe6ec");
  g.fillStyle = body;
  g.beginPath();
  g.ellipse(15, 11.5, 5.5, 2.8, -0.12, 0, Math.PI * 2);
  g.fill();
  // tail feathers
  poly(g, [[10.5, 11], [6.5, 12.8], [10.8, 13.2]], "#e8eef2");
  stroke(g, [[7.2, 12.6], [9.5, 12.2]], 0.4, "#8fa2ae", 0.8);

  // near wing sweeping down-forward
  g.fillStyle = "#f2f6f8";
  g.beginPath();
  g.moveTo(13.5, 11);
  g.quadraticCurveTo(19, 13.5, 26, 10.5);
  g.quadraticCurveTo(20.5, 16.5, 14, 14);
  g.closePath();
  g.fill();
  poly(g, [[24.4, 10.8], [26, 10.5], [24.2, 12.4]], "#2b3a44");
  stroke(g, [[15.5, 12.6], [21, 12.8]], 0.4, "#b8c8d2", 0.8);

  // head + beak + eye
  dot(g, 19.8, 9.2, 2.1, "#ffffff");
  poly(g, [[21.6, 8.8], [24.4, 9.6], [21.6, 10.2]], "#f2b134");
  dot(g, 20.4, 8.7, 0.45, "#1d232e");
}

/** Fluffy cumulus cloud; seed varies the puff layout per variant. */
function cloudPainter(seed: number, w: number, h: number) {
  return (g: Ctx) => {
    const baseY = h * 0.68;
    const puffs: Array<[number, number, number]> = [];
    const count = 5 + Math.floor(rnd(seed) * 2);
    for (let i = 0; i < count; i++) {
      const u = (i + 0.5) / count;
      puffs.push([
        w * (0.12 + u * 0.76) + (rnd(seed + i * 3.7) - 0.5) * 6,
        baseY - 2 - rnd(seed + i * 1.3) * 2,
        h * 0.22 + rnd(seed + i * 7.1) * h * 0.1,
      ]);
    }
    // top crowns
    puffs.push([w * 0.38 + rnd(seed * 2.3) * 8, h * 0.34, h * 0.26]);
    puffs.push([w * 0.58 + rnd(seed * 5.9) * 8, h * 0.3, h * 0.3]);
    puffs.push([w * 0.24, h * 0.46, h * 0.2]);
    puffs.push([w * 0.76, h * 0.48, h * 0.18]);

    // shaded underside first, then white tops, then highlights
    puffs.forEach(([x, y, r]) => dot(g, x + r * 0.18, y + r * 0.3, r, "#c4d8ec", 1));
    puffs.forEach(([x, y, r]) => dot(g, x, y - r * 0.08, r * 0.95, "#e8f2fa", 1));
    puffs.forEach(([x, y, r]) => dot(g, x - r * 0.2, y - r * 0.28, r * 0.68, "#ffffff", 1));
    // flat-ish base with a warm pink kiss
    g.fillStyle = "#c4d8ec";
    g.beginPath();
    g.ellipse(w * 0.5, baseY + h * 0.06, w * 0.36, h * 0.12, 0, 0, Math.PI * 2);
    g.fill();
    stroke(
      g,
      [
        [w * 0.28, baseY + h * 0.14],
        [w * 0.72, baseY + h * 0.14],
      ],
      1.2,
      "#ffd9df",
      0.55
    );
    // dithered texture along the shade boundary
    speckle(g, w * 0.5, baseY - h * 0.08, w * 0.34, h * 0.14, "#d4e4f2", 22, 0.7, seed * 13.1);
    speckle(g, w * 0.45, h * 0.36, w * 0.26, h * 0.12, "#ffffff", 14, 0.8, seed * 17.7);
  };
}

/* ------------------------------- render ------------------------------- */

type Spec = { size: [number, number]; painter: (g: Ctx) => void };

const SPECS: Record<DecorKind, Spec> = {
  sailboat: { size: [72, 60], painter: drawSailboat },
  sharkFin: { size: [40, 34], painter: drawSharkFin },
  dolphin: { size: [60, 42], painter: drawDolphin },
  balloon: { size: [40, 54], painter: drawBalloon },
  plane: { size: [94, 28], painter: drawPlane },
  sun: { size: [40, 40], painter: drawSun },
  moon: { size: [40, 40], painter: drawMoon },
  gull: { size: [27, 16], painter: drawGull },
  cloud0: { size: [88, 34], painter: cloudPainter(1.7, 88, 34) },
  cloud1: { size: [72, 28], painter: cloudPainter(6.2, 72, 28) },
  cloud2: { size: [56, 24], painter: cloudPainter(11.9, 56, 24) },
};

export const DECOR_SIZES: Record<DecorKind, [number, number]> = Object.fromEntries(
  Object.entries(SPECS).map(([k, s]) => [k, s.size])
) as Record<DecorKind, [number, number]>;

/** Paints a decor sprite onto its art-pixel grid. Client-side only. */
export function drawDecorCanvas(kind: DecorKind): HTMLCanvasElement {
  const { size, painter } = SPECS[kind];
  return rasterize(painter, size[0], size[1], 1);
}
