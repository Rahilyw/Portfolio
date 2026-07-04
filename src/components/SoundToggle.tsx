"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "ocean-sound";

/**
 * Ambient wave sound, synthesized with the Web Audio API (no audio files):
 * filtered noise with a slow gain swell that mimics waves rolling in.
 * Off by default; opt-in; preference persisted. Audio only ever starts
 * from a user gesture, so a saved "on" preference still waits for a click.
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const start = () => {
    if (!ctxRef.current) {
      const ctx = new AudioContext();

      // 4 seconds of looping white noise
      const seconds = 4;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // shape it into an ocean-ish rumble
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 420;
      lowpass.Q.value = 0.6;

      // slow swell: LFO modulating the master gain
      const master = ctx.createGain();
      master.gain.value = 0.05;
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.09;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.035;
      lfo.connect(lfoGain);
      lfoGain.connect(master.gain);

      noise.connect(lowpass);
      lowpass.connect(master);
      master.connect(ctx.destination);
      noise.start();
      lfo.start();

      ctxRef.current = ctx;
      gainRef.current = master;
    }
    ctxRef.current.resume();
    setOn(true);
    localStorage.setItem(STORAGE_KEY, "on");
  };

  const stop = () => {
    ctxRef.current?.suspend();
    setOn(false);
    localStorage.setItem(STORAGE_KEY, "off");
  };

  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={on ? stop : start}
      aria-pressed={on}
      aria-label={on ? "Turn off wave sounds" : "Turn on wave sounds"}
      title={on ? "Turn off wave sounds" : "Turn on wave sounds"}
      className="flex cursor-pointer items-center gap-2 border-2 border-ink bg-white/95 px-4 py-1.5 font-pixel text-sm font-medium text-ink shadow-[3px_3px_0_rgba(8,51,68,0.45)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <span aria-hidden="true">{on ? "🔊" : "🔇"}</span>
      <span>{on ? "Waves on" : "Waves off"}</span>
    </button>
  );
}
