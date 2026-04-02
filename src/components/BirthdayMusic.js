import { useEffect, useRef } from "react";

// ── Happy Birthday melody via Web Audio API ───────────────────
// Plays automatically when `play` goes true.
// To use your own MP3: drop it at /public/audio/birthday.mp3
// The component tries the MP3 first; falls back to the synth melody.

const NOTES = {
  G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25,
  F5: 698.46, G5: 783.99,
};

// [note, beats]  — classic Happy Birthday to You
const SEQUENCE = [
  ["G4", 0.75], ["G4", 0.25], ["A4", 1],   ["G4", 1],   ["C5", 1],   ["B4", 2],
  ["G4", 0.75], ["G4", 0.25], ["A4", 1],   ["G4", 1],   ["D5", 1],   ["C5", 2],
  ["G4", 0.75], ["G4", 0.25], ["G5", 1],   ["E5", 1],   ["C5", 1],   ["B4", 1],   ["A4", 2],
  ["F5", 0.75], ["F5", 0.25], ["E5", 1],   ["C5", 1],   ["D5", 1],   ["C5", 2.5],
];

const BPM  = 108;
const BEAT = 60 / BPM;

function playNote(ctx, freq, startTime, duration, gainNode) {
  // Two oscillators an octave apart for a richer piano-like tone
  [1, 2].forEach((mult, i) => {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type      = i === 0 ? "triangle" : "sine";
    osc.frequency.value = freq * mult;

    // Pluck envelope: fast attack, exponential decay
    env.gain.setValueAtTime(0, startTime);
    env.gain.linearRampToValueAtTime(i === 0 ? 0.45 : 0.18, startTime + 0.02);
    env.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.92);

    osc.connect(env);
    env.connect(gainNode);
    osc.start(startTime);
    osc.stop(startTime + duration);
  });
}

function playSynthMelody(ctx) {
  const master = ctx.createGain();
  master.gain.value = 0.7;

  // Soft reverb via delay feedback loop
  const delay    = ctx.createDelay(0.4);
  const feedback = ctx.createGain();
  const wet      = ctx.createGain();
  delay.delayTime.value  = 0.22;
  feedback.gain.value    = 0.28;
  wet.gain.value         = 0.35;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(ctx.destination);
  master.connect(ctx.destination);
  master.connect(delay);

  let t = ctx.currentTime + 0.15;
  SEQUENCE.forEach(([name, beats]) => {
    const dur = beats * BEAT;
    playNote(ctx, NOTES[name], t, dur, master);
    t += dur;
  });
}

export default function BirthdayMusic({ play }) {
  const ctxRef   = useRef(null);
  const audioRef = useRef(null);
  const playedRef = useRef(false);

  useEffect(() => {
    if (!play || playedRef.current) return;
    playedRef.current = true;

    // Try MP3 first (if user dropped one in /public/audio/birthday.mp3)
    const audio = new Audio("/audio/birthday.mp3");
    audio.volume = 0.65;
    audio.play()
      .then(() => { audioRef.current = audio; })
      .catch(() => {
        // MP3 not found or blocked — fall back to synth melody
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          ctxRef.current = ctx;
          playSynthMelody(ctx);
        } catch (_) { /* audio not supported */ }
      });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (ctxRef.current) ctxRef.current.close();
    };
  }, [play]);

  return null; // no visible UI
}
