import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/content";
import BottleReveal from "@/components/BottleReveal";

export const metadata: Metadata = {
  title: "About Me — Rahil Wijeyesekera",
  description:
    "Third-year CS student at UVic, Technical Co-founder, Surf Club Executive, and builder of things that ship.",
};

function Polaroid({
  src,
  alt,
  caption,
  rotate,
  width = "w-44",
  height = "h-48",
}: {
  src: string;
  alt: string;
  caption: string;
  rotate: string;
  width?: string;
  height?: string;
}) {
  return (
    <div
      className="shrink-0 bg-white p-2 pb-8 shadow-[4px_6px_18px_rgba(0,0,0,0.22)]"
      style={{ transform: rotate }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={`${width} ${height} object-cover`} />
      <p className="mt-1 text-center font-sans text-xs text-gray-400">{caption}</p>
    </div>
  );
}

export default function AboutMePage() {
  return (
    <div className="min-h-screen bg-parchment">

      {/* ── Issue strip ── */}
      <div className="flex items-center justify-between bg-navy-dark px-6 py-2">
        <span className="font-bebas text-sm tracking-[3px] text-neon-yellow">
          SURF &amp; CODE QUARTERLY
        </span>
        <span className="font-bebas text-sm tracking-[2px] text-white/40">
          FEATURE INTERVIEW — SUMMER 2026
        </span>
        <span className="font-bebas text-sm tracking-[3px] text-neon-yellow">ABOUT</span>
      </div>

      {/* ── Nav ── */}
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="sticker px-4 py-2 font-display text-sm text-navy transition hover:-translate-y-0.5"
        >
          🌊 Back to the ocean
        </Link>
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className="sticker px-4 py-2 font-display text-sm text-navy transition hover:-translate-y-0.5"
        >
          GitHub ↗
        </a>
      </nav>

      {/* ── Hero spread ── */}
      <section className="mx-auto max-w-5xl border-b-[3px] border-navy/15 px-6 pb-12 pt-2">
        <div className="flex flex-col items-start gap-10 md:flex-row">

          {/* Left: headline block */}
          <div className="flex-1">
            <p className="font-bebas text-sm tracking-[4px] text-coral-hot">
              FEATURE INTERVIEW — 2026
            </p>
            <h1
              className="font-bebas mt-2 text-[80px] leading-[0.88] text-navy-dark md:text-[108px]"
              style={{ textShadow: "3px 3px 0 #FFE000, 7px 7px 0 #0A2D4E" }}
            >
              YASITH RAHIL<br />WIJEYESEKERA
            </h1>
            <p className="font-editorial mt-3 text-3xl italic text-coral-hot">
              The Builder Who Ships
            </p>
            <div className="my-5 h-px bg-navy/20" />
            <p className="font-editorial text-lg leading-[1.8] text-navy/80">
              Third-year Computer Science student at the University of Victoria. Technical Co-founder.
              Surf Club Executive. Rugby veteran. Rahil does not study products — he builds them and
              ships them into the wild.
            </p>
          </div>

          {/* Right: hero polaroid */}
          <div className="flex shrink-0 justify-center md:justify-end">
            <div
              className="bg-white p-3 pb-12 shadow-[4px_6px_24px_rgba(0,0,0,0.20)]"
              style={{ transform: "rotate(2.5deg)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/rahil-portrait.jpeg"
                alt="Rahil Wijeyesekera"
                className="h-80 w-52 object-cover object-top"
              />
              <p className="mt-2 text-center font-sans text-xs text-gray-400">Sri Lanka, 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Q&A + VITALS ── */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          {/* Q&A (2 cols) */}
          <div className="md:col-span-2">
            <h2 className="font-bebas mb-8 border-b-2 border-neon-yellow pb-2 text-5xl text-navy-dark">
              Q &amp; A
            </h2>

            {/* Q1 */}
            <div className="mb-4 border-l-4 border-neon-yellow pl-5">
              <p className="font-editorial font-semibold italic text-navy">
                You are a CS student — but you spend more time building than studying.
                What is the philosophy?
              </p>
            </div>
            <p className="font-editorial mb-10 leading-[1.8] text-navy/80">
              You can read a hundred papers on surfing and still wipe out on your first wave. Same deal
              with software. I built Serendira, I shipped FlockIn, I wrote a TCP analyzer from scratch
              in C — that is where the real learning happens. Ship first, polish later.
            </p>

            {/* Pull quote */}
            <div
              className="my-8 bg-coral-hot px-8 py-7"
              style={{ transform: "rotate(-0.7deg)" }}
            >
              <p className="font-bebas text-3xl leading-tight text-white">
                &ldquo;Ship first, polish later. You can not learn to surf by reading about it.&rdquo;
              </p>
            </div>

            {/* Q2 */}
            <div className="mb-4 border-l-4 border-neon-yellow pl-5">
              <p className="font-editorial font-semibold italic text-navy">
                Serendira, FlockIn, low-level C tools — what drives you across such different domains?
              </p>
            </div>
            <p className="font-editorial leading-[1.8] text-navy/80">
              I want to understand the full stack — from the TCP packets at the bottom to the React
              components on top. As Technical Co-founder at Serendira I had to think about product,
              infrastructure, and growth all at once. FlockIn solved a real problem I saw at UVic.
              The C tools were pure curiosity.
            </p>
          </div>

          {/* VITALS sidebar (1 col) */}
          <div className="md:col-span-1">
            <div className="bg-navy-dark p-6 text-white">
              <h3 className="font-bebas text-4xl tracking-[4px] text-neon-yellow">VITALS</h3>
              <div className="mb-5 mt-2 h-0.5 bg-neon-yellow" />

              <div className="space-y-5">
                {[
                  { label: "SPORT", value: "High-Level Rugby (High School)" },
                  { label: "CLUB ROLE", value: "UVic Surf Club Executive" },
                  { label: "SURF TRIPS", value: "Tofino, BC · Sri Lanka · Singapore" },
                  { label: "EDUCATION", value: "3rd Year Computer Science,\nUniversity of Victoria" },
                ].map((v) => (
                  <div key={v.label}>
                    <p className="font-bebas text-xs tracking-[2px] text-white/40">{v.label}</p>
                    <p className="font-editorial mt-0.5 text-sm italic text-white/90">
                      {v.value.split("\n").map((line, i) => (
                        <span key={i}>{line}{i < v.value.split("\n").length - 1 && <br />}</span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mini polaroid */}
              <div
                className="mt-7 bg-white p-2 pb-7 shadow-md"
                style={{ transform: "rotate(-1.5deg)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/rahil-surf-beach.jpeg"
                  alt="Surf session"
                  className="h-32 w-full object-cover object-center"
                />
                <p className="mt-1 text-center font-sans text-xs text-gray-400">Surf Sessions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="overflow-hidden border-y-4 border-navy-dark bg-navy-dark py-1.5" aria-hidden="true">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              className="font-bebas whitespace-nowrap text-sm tracking-[0.2em] text-parchment"
            >
              {Array.from({ length: 8 })
                .map(() => "RAHIL WIJEYESEKERA · SURF · BUILD · SHIP · REPEAT · ")
                .join("")}
            </span>
          ))}
        </div>
      </div>

      {/* ── Photo strip ── */}
      <section className="bg-[#1A1008] px-6 py-14">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 md:flex-row md:items-end">

          {/* Polaroids */}
          <div className="flex flex-1 flex-wrap items-end justify-center gap-6 md:flex-nowrap">
            <Polaroid
              src="/images/rahil-tofino.jpeg"
              alt="Tofino surf"
              caption="Tofino, BC"
              rotate="rotate(-2.5deg)"
            />
            <Polaroid
              src="/images/rahil-surf-shop.jpeg"
              alt="Surf shop"
              caption="On the Boards"
              rotate="rotate(1.5deg)"
            />
            <Polaroid
              src="/images/rahil-ocean.jpeg"
              alt="On the water"
              caption="On the Water"
              rotate="rotate(-1deg)"
              height="h-48"
            />
          </div>

          {/* Text */}
          <div className="shrink-0 text-center md:max-w-xs md:text-left">
            <h2 className="font-bebas text-5xl leading-tight text-neon-yellow">
              LIFE IN THE<br />SWELL LANE
            </h2>
            <p className="font-editorial mt-2 text-sm italic text-white/55">
              When the semester ends, Rahil paddles out.
            </p>
          </div>
        </div>
      </section>

      {/* ── Bottle reveal ── */}
      <section className="bg-parchment px-6 py-20 text-center">
        <div className="mx-auto mb-14 h-px max-w-sm bg-navy/15" />
        <p className="font-marker text-sm tracking-wide text-navy/50">☼ a mysterious message ☼</p>
        <p className="font-bebas mt-1 text-2xl tracking-[4px] text-navy/30">
          SOMETHING WASHED ASHORE...
        </p>
        <div className="mt-6">
          <BottleReveal />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-parchment px-6 pb-10 text-center text-sm text-navy/50">
        <p>
          {site.name} ·{" "}
          <a href={`mailto:${site.email}`} className="underline hover:text-navy">
            {site.email}
          </a>{" "}
          ·{" "}
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
            GitHub
          </a>{" "}
          ·{" "}
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
            LinkedIn
          </a>
        </p>
      </footer>
    </div>
  );
}
