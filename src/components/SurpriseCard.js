import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL = 5;

export default function SurpriseCard({ active, onDone }) {
  const [count,    setCount]    = useState(TOTAL);
  const [visible,  setVisible]  = useState(false);
  const doneCalledRef = useRef(false);

  useEffect(() => {
    if (!active) {
      setCount(TOTAL);
      setVisible(false);
      doneCalledRef.current = false;
      return;
    }

    doneCalledRef.current = false;
    setCount(TOTAL);
    setVisible(true);

    // Use Date-based countdown — immune to JS timer drift from canvas load
    const startTime = Date.now();
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = TOTAL - elapsed;

      if (remaining <= 0) {
        clearInterval(id);
        setCount(0);
        if (!doneCalledRef.current) {
          doneCalledRef.current = true;
          // Exit animation then fire onDone
          setVisible(false);
          setTimeout(() => onDone(), 600);
        }
      } else {
        setCount(remaining);
      }
    }, 200); // check every 200ms — much more responsive than 1000ms

    return () => clearInterval(id);
  }, [active]); // eslint-disable-line

  // SVG ring
  const radius   = 38;
  const circ     = 2 * Math.PI * radius;
  const offset   = circ * (count / TOTAL); // full at TOTAL, empty at 0

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="surprise-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[400] flex items-center justify-center px-4"
          style={{ pointerEvents: "none" }}
        >
          <motion.div
            initial={{ scale: 0.75, y: 50, opacity: 0 }}
            animate={{ scale: 1,    y: 0,  opacity: 1 }}
            exit={{   scale: 0.9,  y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="flex flex-col items-center gap-4 px-10 py-8 rounded-3xl text-center"
            style={{
              background:     "linear-gradient(135deg, rgba(255,240,250,0.96), rgba(248,220,238,0.97))",
              backdropFilter: "blur(20px)",
              border:         "1.5px solid rgba(220,150,175,0.35)",
              boxShadow:      "0 30px 70px rgba(180,80,120,0.2), 0 4px 16px rgba(0,0,0,0.06)",
              maxWidth:       340,
              width:          "100%",
            }}
          >
            {/* Sparkle corners — CSS animation, not Framer Motion */}
            <span className="absolute top-3 left-4 text-base animate-pulse">✨</span>
            <span className="absolute top-3 right-4 text-base animate-pulse" style={{ animationDelay: "0.4s" }}>✨</span>
            <span className="absolute bottom-3 left-4 text-base animate-pulse" style={{ animationDelay: "0.8s" }}>✨</span>
            <span className="absolute bottom-3 right-4 text-base animate-pulse" style={{ animationDelay: "1.2s" }}>✨</span>

            {/* Bouncing gift */}
            <div
              className="text-5xl"
              style={{ animation: "giftBounce 1.8s ease-in-out infinite" }}
            >
              🎁
            </div>

            {/* Text */}
            <div>
              <p className="font-body text-xs uppercase tracking-[0.25em] text-[#C8848C] mb-1">
                Get ready
              </p>
              <h3
                className="font-display italic font-bold text-[#4A2A2A] leading-snug"
                style={{ fontSize: "clamp(1.15rem, 4vw, 1.4rem)" }}
              >
                A surprise is waiting for you
              </h3>
              <p className="font-body text-sm text-[#8B5E5E]/75 mt-1">
                Your story begins in…
              </p>
            </div>

            {/* Circular countdown — CSS transition on strokeDashoffset */}
            <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
              <svg
                width="100" height="100"
                style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}
              >
                {/* Track */}
                <circle cx="50" cy="50" r={radius} fill="none"
                  stroke="rgba(200,150,175,0.18)" strokeWidth="6" />
                {/* Animated ring — pure CSS transition, GPU-accelerated */}
                <circle
                  cx="50" cy="50" r={radius}
                  fill="none"
                  stroke="url(#rg)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                  style={{ transition: "stroke-dashoffset 0.9s ease-in-out" }}
                />
                <defs>
                  <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Number — plain CSS transition, no Framer Motion */}
              <span
                key={count}
                className="font-display font-bold text-[#4A2A2A]"
                style={{
                  fontSize: "2.2rem",
                  lineHeight: 1,
                  transition: "opacity 0.15s ease",
                }}
              >
                {count === 0 ? "🎬" : count}
              </span>
            </div>

            {/* Pulse dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#D4848C]"
                  style={{ animation: `pulse 1s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
