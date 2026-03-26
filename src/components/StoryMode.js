import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Unique entrance transition per slide — cycles through 6 styles
const SLIDE_VARIANTS = [
  // 0 — Slide from right
  {
    initial: { x: "100%", opacity: 0 },
    animate: { x: "0%",   opacity: 1 },
    exit:    { x: "-100%",opacity: 0 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  // 1 — Zoom + fade (scale from 1.12 down)
  {
    initial: { scale: 1.14, opacity: 0 },
    animate: { scale: 1,    opacity: 1 },
    exit:    { scale: 0.9,  opacity: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  // 2 — Slide from left
  {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: "0%",    opacity: 1 },
    exit:    { x: "100%",  opacity: 0 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  // 3 — Slide up
  {
    initial: { y: "60px", opacity: 0 },
    animate: { y: "0px",  opacity: 1 },
    exit:    { y: "-40px",opacity: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  // 4 — Blur dissolve
  {
    initial: { opacity: 0, filter: "blur(20px)", scale: 1.04 },
    animate: { opacity: 1, filter: "blur(0px)",  scale: 1    },
    exit:    { opacity: 0, filter: "blur(16px)", scale: 0.97 },
    transition: { duration: 0.65, ease: "easeInOut" },
  },
  // 5 — Diagonal slide (right+up)
  {
    initial: { x: "60px",  y: "40px",  opacity: 0 },
    animate: { x: "0px",   y: "0px",   opacity: 1 },
    exit:    { x: "-60px", y: "-40px", opacity: 0 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
];

// Ken Burns — subtle pan per photo
const KB_PRESETS = [
  { initial: { scale: 1,    x: "0%",  y: "0%"  }, animate: { scale: 1.06, x: "-2%", y: "0%"  } },
  { initial: { scale: 1.05, x: "2%",  y: "0%"  }, animate: { scale: 1,    x: "0%",  y: "0%"  } },
  { initial: { scale: 1,    x: "-2%", y: "0%"  }, animate: { scale: 1.06, x: "2%",  y: "0%"  } },
  { initial: { scale: 1.04, x: "0%",  y: "0%"  }, animate: { scale: 1,    x: "0%",  y: "0%"  } },
  { initial: { scale: 1,    x: "2%",  y: "0%"  }, animate: { scale: 1.07, x: "-2%", y: "0%"  } },
];

const STORY_DURATION = 6000; // ms per photo

function useTypewriter(text, active, speed = 38) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) { setDisplayed(""); return; }
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return displayed;
}

export default function StoryMode({ photos, startIndex = 0, onClose }) {
  const [index,   setIndex]   = useState(startIndex);
  const [paused,  setPaused]  = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const startTime   = useRef(null);
  const elapsed     = useRef(0);

  const photo   = photos[index];
  const preset  = KB_PRESETS[index % KB_PRESETS.length];
  const variant = SLIDE_VARIANTS[index % SLIDE_VARIANTS.length];
  const caption = useTypewriter(photo.caption, true);

  const goNext = useCallback(() => {
    elapsed.current = 0;
    setProgress(0);
    setIndex(i => (i + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    elapsed.current = 0;
    setProgress(0);
    setIndex(i => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Progress timer
  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current);
      return;
    }
    startTime.current = Date.now() - elapsed.current;
    intervalRef.current = setInterval(() => {
      const el = Date.now() - startTime.current;
      elapsed.current = el;
      const pct = Math.min((el / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        elapsed.current = 0;
        setProgress(0);
        setIndex(i => (i + 1) % photos.length);
      }
    }, 30);
    return () => clearInterval(intervalRef.current);
  }, [index, paused, photos.length]);

  // Reset progress when index changes
  useEffect(() => {
    elapsed.current = 0;
    setProgress(0);
  }, [index]);

  // Keyboard nav
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowRight")  goNext();
      if (e.key === "ArrowLeft")   goPrev();
      if (e.key === " ")           setPaused(p => !p);
    };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose, goNext, goPrev]);

  // Touch swipe
  const touchStart = useRef(null);
  const onTouchStart = e => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if (touchStart.current === null) return;
    const delta = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? goNext() : goPrev();
    touchStart.current = null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Progress bars ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3 safe-top">
        {photos.map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-white"
              animate={{ width: i < index ? "100%" : i === index ? `${progress}%` : "0%" }}
              transition={{ duration: 0.05 }}
            />
          </div>
        ))}
      </div>

      {/* ── Top bar ── */}
      <div className="absolute top-6 left-0 right-0 z-30 flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2">
          <span className="font-display italic text-white/90 text-sm font-bold">
            💖 Sneha's Story
          </span>
          <span className="font-body text-white/50 text-xs">
            {index + 1} / {photos.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPaused(p => !p)}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition text-sm"
          >
            {paused ? "▶" : "⏸"}
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition text-base"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Ken Burns photo ── */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={variant.transition}
          >
            {/* Blurred background — fills letterbox gaps */}
            <div className="absolute inset-0 scale-110 overflow-hidden">
              <img
                src={photo.src}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover object-top"
                style={{ filter: "blur(24px)", opacity: 0.65 }}
                draggable={false}
              />
            </div>

            {/* Ken Burns on the main photo — object-contain so full person visible */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={preset.initial}
              animate={preset.animate}
              transition={{ duration: STORY_DURATION / 1000 + 1, ease: "easeInOut" }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </motion.div>

            {/* Gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Caption typewriter ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-16 sm:pb-10 safe-bottom">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="font-display italic text-white text-xl sm:text-2xl leading-snug text-shadow mb-2 min-h-[2rem]">
              {caption}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block w-[2px] h-5 bg-white/80 ml-0.5 align-middle"
              />
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Tap zones — start below top controls (top-20) ── */}
      <button
        onClick={goPrev}
        className="absolute left-0 top-20 bottom-24 w-1/3 z-10"
        aria-label="Previous"
      />
      <button
        onClick={goNext}
        className="absolute right-0 top-20 bottom-24 w-1/3 z-10"
        aria-label="Next"
      />
      {/* Centre tap = pause */}
      <button
        onClick={() => setPaused(p => !p)}
        className="absolute left-1/3 right-1/3 top-20 bottom-24 z-10"
        aria-label="Pause / Resume"
      />

      {/* Pause indicator */}
      <AnimatePresence>
        {paused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          >
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-white text-2xl backdrop-blur-sm">
              ⏸
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
