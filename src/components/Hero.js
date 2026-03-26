import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Confetti from "./Confetti";

// ✏️  Change these two values to personalise the page
const FRIEND_NAME   = "Sneha";         // Your friend's name
const BIRTHDAY_DATE = "2026-04-04";   // ISO format YYYY-MM-DD

const HERO_IMAGE = "/photos/20241229_174910.jpg"; // dramatic sunset silhouette

function useCountdown(targetDate) {
  const [diff, setDiff] = useState(null);

  useEffect(() => {
    const calc = () => {
      const now    = new Date();
      const target = new Date(targetDate);
      target.setFullYear(now.getFullYear());
      if (target < now) target.setFullYear(now.getFullYear() + 1);
      const ms = target - now;
      const d  = Math.floor(ms / 86400000);
      const h  = Math.floor((ms % 86400000) / 3600000);
      const m  = Math.floor((ms % 3600000)  / 60000);
      const s  = Math.floor((ms % 60000)    / 1000);
      setDiff({ d, h, m, s });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return diff;
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center min-w-[52px]">
      <motion.span
        key={value}
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        className="font-display font-bold text-xl sm:text-3xl text-white text-shadow leading-none tabular-nums"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span className="font-body text-[0.65rem] uppercase tracking-widest text-blush-200 mt-1">
        {label}
      </span>
    </div>
  );
}

export default function Hero({ showConfetti, onEnterGallery }) {
  const sectionRef = useRef(null);
  const { scrollY } = useScroll();
  const bgY        = useTransform(scrollY, [0, 600], [0, 120]);
  const textY      = useTransform(scrollY, [0, 600], [0, -60]);
  const opacity    = useTransform(scrollY, [0, 400], [1, 0]);
  const countdown  = useCountdown(BIRTHDAY_DATE);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Confetti overlay */}
      {showConfetti && <Confetti />}

      {/* Parallax background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 scale-110"
      >
        <img
          src={HERO_IMAGE}
          alt="Hero background"
          className="w-full h-full object-cover"
          fetchpriority="high"
        />
        {/* Layered gradient overlay */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />
      </motion.div>

      {/* Floating sparkle dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/70"
          style={{
            left:   `${10 + i * 11}%`,
            top:    `${15 + (i % 3) * 20}%`,
          }}
          animate={{
            y:       [0, -18, 0],
            opacity: [0.4, 1, 0.4],
            scale:   [1, 1.4, 1],
          }}
          transition={{
            duration: 2.5 + i * 0.4,
            repeat:   Infinity,
            delay:    i * 0.3,
            ease:     "easeInOut",
          }}
        />
      ))}

      {/* Main hero content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-body text-xs sm:text-sm uppercase tracking-[0.3em] text-blush-200 mb-6"
        >
          A Memory Lane Just For You
        </motion.p>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-3"
        >
          <p
            className="font-display italic font-bold leading-[1.1] text-shadow text-white"
            style={{ fontSize: "clamp(2rem, 9vw, 5.5rem)" }}
          >
            Happy Birthday,
          </p>
          <p
            className="font-display italic font-bold leading-[1.05] text-shadow"
            style={{
              fontSize: "clamp(2.4rem, 11vw, 6.5rem)",
              background: "linear-gradient(135deg, #FFD6E0 0%, #FFAEC9 40%, #E8D5D5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {FRIEND_NAME}! 💖
          </p>
        </motion.div>

        {/* Heart & subtitle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col items-center gap-2 mb-6"
        >
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl sm:text-4xl"
            aria-hidden="true"
          >
            💖
          </motion.span>
          <p className="font-body text-sm sm:text-base text-white/85 text-shadow-sm max-w-xs sm:max-w-md leading-relaxed px-2">
            Every photo here holds a piece of our story — a little memory lane
            crafted just for you.
          </p>
        </motion.div>

        {/* Countdown */}
        {countdown !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="inline-flex flex-col items-center gap-2 mb-7"
          >
            <span className="font-body text-[0.65rem] uppercase tracking-widest text-blush-200">
              Countdown to the big day
            </span>
            <div className="flex items-start gap-2 sm:gap-4">
              <CountdownUnit value={countdown.d} label="Days"  />
              <span className="text-white/60 text-xl sm:text-2xl font-light mt-1">:</span>
              <CountdownUnit value={countdown.h} label="Hours" />
              <span className="text-white/60 text-xl sm:text-2xl font-light mt-1">:</span>
              <CountdownUnit value={countdown.m} label="Mins"  />
              <span className="text-white/60 text-xl sm:text-2xl font-light mt-1">:</span>
              <CountdownUnit value={countdown.s} label="Secs"  />
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={onEnterGallery}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-body font-semibold text-[0.9rem] tracking-wide
                     bg-white/15 text-white border border-white/30 backdrop-blur-sm
                     hover:bg-white/25 transition-all duration-300 shadow-lg"
        >
          View Memories
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Bottom fade — blends Hero into the cake section's pink */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, transparent, #FFF0F8)" }}
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="font-body text-[0.65rem] uppercase tracking-widest text-white/50">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-white/70 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
