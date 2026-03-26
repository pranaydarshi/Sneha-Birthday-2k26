import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BURST_EMOJIS = ["🎂","💖","✨","🎉","🌸","💜","⭐","🎊","🩷","🎈"];

// CSS-based burst — GPU-composited, zero canvas overhead
function CakeBurst({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) { setParticles([]); return; }
    setParticles(
      Array.from({ length: 32 }, (_, i) => ({
        id:      i,
        symbol:  BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)],
        angle:   (i / 32) * 360 + Math.random() * 11,   // spread 360°
        dist:    80 + Math.random() * 140,               // px outward
        size:    1.3 + Math.random() * 0.9,              // rem
        delay:   Math.random() * 0.15,                   // slight stagger
        dur:     0.7 + Math.random() * 0.5,              // animation duration
      }))
    );
    // Clean up after animations finish
    const t = setTimeout(() => setParticles([]), 1800);
    return () => clearTimeout(t);
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes cakeBurst {
          0%   { opacity: 1; transform: translate(0, 0) scale(0.4); }
          60%  { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(1); }
        }
      `}</style>
      {particles.map(p => {
        const rad = (p.angle * Math.PI) / 180;
        const tx  = Math.cos(rad) * p.dist;
        const ty  = Math.sin(rad) * p.dist - 40; // bias upward
        return (
          <span
            key={p.id}
            style={{
              position:   "absolute",
              top:        "38%",
              left:       "50%",
              fontSize:   `${p.size}rem`,
              lineHeight: 1,
              pointerEvents: "none",
              willChange: "transform, opacity",
              "--tx":     `${tx}px`,
              "--ty":     `${ty}px`,
              animation:  `cakeBurst ${p.dur}s ease-out ${p.delay}s both`,
            }}
          >
            {p.symbol}
          </span>
        );
      })}
    </>
  );
}

// Animated flame on top of candle
function Flame({ lit }) {
  return (
    <AnimatePresence>
      {lit && (
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          exit={{ scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute -top-5 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, -4, 0], scaleX: [1, 1.25, 0.9, 1] }}
            transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
            className="w-3 h-5 rounded-full origin-bottom"
            style={{
              background: "linear-gradient(to top, #FCD34D, #F97316, #EF4444)",
              filter: "blur(0.5px)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Smoke() {
  return (
    <motion.div
      initial={{ opacity: 0.8, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -28, scale: 2 }}
      transition={{ duration: 1.3, ease: "easeOut" }}
      className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-300/60"
      style={{ filter: "blur(4px)" }}
    />
  );
}

export default function BirthdayCake({ onCelebrate }) {
  const [state,     setState]     = useState("idle"); // idle | blowing | cut
  const [showSmoke, setShowSmoke] = useState(false);

  const blowCandles = () => {
    if (state !== "idle") return;
    setState("blowing");
    setShowSmoke(true);
    setTimeout(() => setShowSmoke(false), 1400);
    setTimeout(() => {
      setState("cut");
      if (onCelebrate) onCelebrate();
    }, 1600);
  };

  const isLit = state === "idle";

  return (
    <section
      className="relative py-16 flex flex-col items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFF0F8 0%, #FDE8F0 50%, #FFF0F8 100%)" }}
    >
      {/* CSS burst — GPU-composited, smooth on all hardware */}
      <CakeBurst active={state === "cut"} />

      {/* ── Side decorations ── */}
      {/* Left side */}
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[3%] top-[22%] text-5xl hidden sm:block pointer-events-none select-none">🎈</motion.div>
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute left-[6%] top-[55%] text-3xl hidden sm:block pointer-events-none select-none">🎀</motion.div>
      <motion.div animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute left-[2%] top-[72%] text-4xl hidden sm:block pointer-events-none select-none">🌸</motion.div>
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute left-[11%] top-[38%] text-2xl hidden lg:block pointer-events-none select-none">✨</motion.div>

      {/* Right side */}
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute right-[3%] top-[20%] text-5xl hidden sm:block pointer-events-none select-none">🎊</motion.div>
      <motion.div animate={{ y: [0, -9, 0], rotate: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute right-[6%] top-[52%] text-3xl hidden sm:block pointer-events-none select-none">🌟</motion.div>
      <motion.div animate={{ y: [0, -11, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute right-[2%] top-[70%] text-4xl hidden sm:block pointer-events-none select-none">💖</motion.div>
      <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute right-[11%] top-[36%] text-2xl hidden lg:block pointer-events-none select-none">🎁</motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 text-center mb-6"
      >
        <p className="font-body text-xs uppercase tracking-[0.3em] text-[#C8848C] mb-2">
          Make a Wish
        </p>
        <h2
          className="font-display italic font-bold text-[#4A2A2A] drop-shadow-sm"
          style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
        >
          {state === "cut" ? "Happy Birthday, Sneha! 🎉" : "Blow out the candles 🕯️"}
        </h2>
      </motion.div>

      {/* ── Cake image with candle overlay ── */}
      <motion.div
        className="relative z-10 cursor-pointer select-none"
        onClick={blowCandles}
        whileHover={state === "idle" ? { scale: 1.02 } : {}}
        title="Tap to blow out the candles!"
        style={{ width: "min(420px, 90vw)" }}
      >
        {/* The AI birthday cake image */}
        <motion.img
          src="/photos/birthday-cake.jpg"
          alt="Birthday cake"
          fetchpriority="high"
          decoding="async"
          className="w-full rounded-3xl"
          style={{
            boxShadow: "0 20px 60px rgba(200,100,130,0.25), 0 8px 20px rgba(0,0,0,0.1)",
          }}
          animate={state === "cut" ? { scale: [1, 1.04, 1], filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"] } : {}}
          transition={{ duration: 0.6 }}
        />

        {/* Candle flames overlaid on the "23" candles in the image */}
        {/* Positioned at top-center of the cake image where candles are */}
        <div
          className="absolute flex gap-6 justify-center"
          style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }}
        >
          {[0, 1].map(i => (
            <div key={i} className="relative w-4 h-6">
              <Flame lit={isLit} />
              {showSmoke && <Smoke />}
            </div>
          ))}
        </div>

        {/* Glow pulse on hover when idle */}
        {state === "idle" && (
          <motion.div
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 18%, #FCD34D88, transparent 60%)" }}
          />
        )}

        {/* Shimmer overlay on cut */}
        <AnimatePresence>
          {state === "cut" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: "linear-gradient(135deg, #ffffff44, transparent)" }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* CTA / state messages */}
      <div className="relative z-10 w-full flex flex-col items-center mt-6">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.p
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="font-body text-sm text-[#B08080] tracking-wide"
            >
              👆 Tap the cake to blow out the candles
            </motion.p>
          )}
          {state === "blowing" && (
            <motion.p
              key="blowing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="font-display italic text-2xl text-[#8B5E5E]"
            >
              Whoooosh! 💨
            </motion.p>
          )}
          {state === "cut" && (
            <motion.div
              key="cut"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <p className="font-display italic text-xl sm:text-2xl text-[#8B5E5E]">
                Wishing you the most beautiful year yet! 🌸
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.stopPropagation(); setState("idle"); }}
                className="mt-4 px-5 py-2 rounded-full border border-[#C8A4A4] text-[#8B5E5E]
                           font-body text-sm hover:bg-[#F9E4E4] transition"
              >
                🕯️ Relight candles
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
