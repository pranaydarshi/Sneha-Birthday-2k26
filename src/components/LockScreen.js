import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import Confetti from "./Confetti";

const UNLOCK_TIME = 1775241000000; // Apr 4, 2026 12:00 AM IST

function pad(n) {
  return String(n).padStart(2, "0");
}

// ── iPhone-style swipe-to-unlock slider ──────────────────────
function SwipeUnlock({ onSwiped }) {
  const x            = useMotionValue(0);
  const trackRef     = useRef(null);
  const [maxDrag, setMaxDrag]       = useState(0);
  const [progress, setProgress]     = useState(0);
  const [completed, setCompleted]   = useState(false);
  const THUMB = 56;
  const PAD   = 4;

  // Measure track once mounted
  useEffect(() => {
    if (trackRef.current) {
      setMaxDrag(trackRef.current.offsetWidth - THUMB - PAD * 2);
    }
  }, []);

  // Keep progress in sync with x
  useEffect(() => {
    const unsub = x.on("change", v => {
      setProgress(maxDrag > 0 ? Math.min(1, Math.max(0, v / maxDrag)) : 0);
    });
    return unsub;
  }, [x, maxDrag]);

  const handleDragEnd = () => {
    if (completed) return;
    if (x.get() >= maxDrag * 0.80) {
      animate(x, maxDrag, { duration: 0.15 });
      setCompleted(true);
      setTimeout(onSwiped, 350);
    } else {
      animate(x, 0, { type: "spring", stiffness: 500, damping: 38 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-4 w-full"
    >
      {/* Label above */}
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="font-body text-[0.65rem] uppercase tracking-[0.25em] text-[#BAD0F0]/50"
      >
        Your surprise is ready
      </motion.p>

      {/* Track */}
      <div
        ref={trackRef}
        style={{
          position: "relative",
          width: "100%", maxWidth: 320,
          height: 64,
          borderRadius: 32,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.10)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 0 40px rgba(96,165,250,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        {/* Shimmer keyframe */}
        <style>{`
          @keyframes shimmerText {
            0%   { background-position: -300% center; }
            100% { background-position:  300% center; }
          }
        `}</style>

        {/* Fill bar */}
        <div
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, rgba(37,99,235,0.35) 0%, rgba(96,165,250,0.25) 100%)",
            borderRadius: 32,
            pointerEvents: "none",
            transition: "width 0.02s linear",
          }}
        />

        {/* Hint text — fades as thumb moves */}
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            paddingLeft: THUMB + PAD * 2 + 8,
            opacity: Math.max(0, 1 - progress * 2),
            pointerEvents: "none",
            transition: "opacity 0.05s linear",
          }}
        >
          <span style={{
            fontSize: "0.72rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            background: "linear-gradient(90deg, rgba(186,208,240,0.3) 0%, rgba(186,208,240,0.9) 40%, rgba(255,255,255,0.95) 50%, rgba(186,208,240,0.9) 60%, rgba(186,208,240,0.3) 100%)",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmerText 2.8s linear infinite",
          }}>
            Happy Birthday Sneha — swipe to begin ✨
          </span>
        </div>

        {/* Draggable thumb */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0}
          dragMomentum={false}
          style={{
            x,
            position: "absolute",
            left: PAD,
            top: PAD,
            width: THUMB,
            height: THUMB,
            borderRadius: "50%",
            background: completed
              ? "linear-gradient(135deg, #22C55E, #86EFAC)"
              : "linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #60A5FA 100%)",
            boxShadow: completed
              ? "0 0 24px rgba(34,197,94,0.7), 0 2px 12px rgba(0,0,0,0.3)"
              : "0 0 24px rgba(37,99,235,0.65), 0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: completed ? "default" : "grab",
            fontSize: "1.3rem",
            touchAction: "none",
            zIndex: 10,
          }}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.06, cursor: "grabbing" }}
          whileHover={!completed ? { scale: 1.04 } : {}}
        >
          <motion.span
            animate={!completed ? { x: [0, 4, 0] } : { scale: [1, 1.3, 1] }}
            transition={!completed
              ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.4 }
            }
          >
            {completed ? "✨" : "›"}
          </motion.span>
        </motion.div>
      </div>

      {/* Arrow hint below */}
      {!completed && (
        <motion.div
          animate={{ x: [0, 6, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex gap-1 text-[#60A5FA]/40 text-xs tracking-widest"
        >
          {"› › ›"}
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Main Lock Screen ──────────────────────────────────────────
export default function LockScreen({ onUnlocked, forceSwipe = false }) {
  const [diff,      setDiff]      = useState(null);
  const [showSwipe, setShowSwipe] = useState(forceSwipe);
  const [unlocked,  setUnlocked]  = useState(false);
  const [bursting,  setBursting]  = useState(false);

  useEffect(() => {
    // After reset — skip countdown, go straight to swipe
    if (forceSwipe) {
      setDiff({ d: 0, h: 0, m: 0, s: 0 });
      setShowSwipe(true);
      return;
    }

    const tick = () => {
      const now = Date.now();
      const ms  = UNLOCK_TIME - now;

      if (ms <= 0) {
        setDiff({ d: 0, h: 0, m: 0, s: 0 });
        setShowSwipe(true);
        return; // stop ticking — wait for swipe
      }

      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000)  / 60000);
      const s = Math.floor((ms % 60000)    / 1000);
      setDiff({ d, h, m, s });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [forceSwipe]);

  const handleSwiped = () => {
    setBursting(true);
    setTimeout(() => {
      setUnlocked(true);
      setTimeout(onUnlocked, 1800);
    }, 2200);
  };

  return (
    <AnimatePresence>
      {!unlocked && (
        <motion.div
          key="lock"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #0D1F3C 0%, #122847 35%, #081228 100%)",
          }}
        >
          {bursting && <Confetti />}

          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-[#60A5FA]/15 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#BAD0F0]/10 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

          {/* Floating stars */}
          <style>{`
            @keyframes twinkle { 0%,100%{opacity:.25;transform:scale(.85)} 50%{opacity:1;transform:scale(1.15)} }
          `}</style>
          {[
            { pos:"top-[7%] left-[11%]",    em:"✨", sz:"1.5rem", dur:"2.8s", d:"0s",   amp:12 },
            { pos:"top-[18%] right-[9%]",   em:"⭐", sz:"1rem",   dur:"3.5s", d:"0.6s", amp:9  },
            { pos:"top-[38%] left-[4%]",    em:"💫", sz:"1.3rem", dur:"4.2s", d:"1s",   amp:14 },
            { pos:"top-[22%] right-[7%]",   em:"✨", sz:"1.8rem", dur:"3.1s", d:"0.3s", amp:10 },
            { pos:"bottom-[28%] left-[7%]", em:"🌟", sz:"1.4rem", dur:"3.8s", d:"0.8s", amp:12 },
            { pos:"bottom-[18%] right-[5%]",em:"✨", sz:"1.1rem", dur:"2.5s", d:"1.3s", amp:9  },
            { pos:"top-[52%] left-[2%]",    em:"⭐", sz:".85rem", dur:"4.5s", d:"0.5s", amp:15 },
            { pos:"top-[58%] right-[3%]",   em:"💫", sz:"1.5rem", dur:"3.2s", d:"1.6s", amp:11 },
            { pos:"bottom-[8%] left-[22%]", em:"🌟", sz:"1rem",   dur:"2.9s", d:"0.4s", amp:8  },
            { pos:"bottom-[12%] right-[20%]",em:"✨",sz:".9rem",  dur:"3.6s", d:"1.1s", amp:10 },
            { pos:"top-[45%] right-[12%]",  em:"⭐", sz:"1.2rem", dur:"3.3s", d:"0.2s", amp:13 },
            { pos:"top-[10%] left-[38%]",   em:"✨", sz:".8rem",  dur:"2.6s", d:"1.4s", amp:7  },
          ].map((s, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -s.amp, 0] }}
              transition={{ duration: parseFloat(s.dur), repeat: Infinity, ease: "easeInOut", delay: parseFloat(s.d) }}
              className={`absolute ${s.pos} pointer-events-none select-none`}
              style={{ fontSize: s.sz, animation: `twinkle ${s.dur} ease-in-out ${s.d} infinite`, willChange:"transform,opacity" }}
            >
              {s.em}
            </motion.div>
          ))}

          <div className="relative z-10 text-center px-6 max-w-lg mx-auto flex flex-col items-center gap-8">

            {/* Profile photo */}
            <motion.div
              animate={bursting
                ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] }
                : { y: [0, -8, 0] }
              }
              transition={bursting
                ? { duration: 0.7 }
                : { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }
              className="relative"
            >
              {/* Outer glow ring */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.04, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute", inset: -5,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(96,165,250,0.55) 0%, rgba(186,208,240,0.3) 40%, rgba(253,218,160,0.5) 100%)",
                  filter: "blur(6px)",
                  zIndex: 0,
                }}
              />
              {/* Border ring */}
              <div style={{
                position: "absolute", inset: -3,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #60A5FA 0%, #BAD0F0 40%, #FDDA9F 100%)",
                zIndex: 1,
              }} />
              {/* Photo */}
              <img
                src="/photos/profile.jpg"
                alt="Sneha"
                style={{
                  position: "relative",
                  width: 110, height: 110,
                  borderRadius: "50%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                  zIndex: 2,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
                }}
              />
              {/* Status dot — lock/gift/sparkle */}
              <motion.div
                animate={bursting ? {} : { scale: [1, 1.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute", bottom: 4, right: 4,
                  width: 26, height: 26,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1E3A8A, #2563EB)",
                  border: "2px solid #0D1F3C",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.8rem",
                  zIndex: 3,
                  boxShadow: "0 0 12px rgba(37,99,235,0.6)",
                }}
              >
                {bursting ? "✨" : showSwipe ? "🎁" : "🔒"}
              </motion.div>
            </motion.div>

            {/* Headline */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-body text-xs uppercase tracking-[0.3em] text-[#BAD0F0]/50 mb-3"
              >
                A surprise is waiting for
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="font-display italic font-bold text-[#E8F0FD] leading-tight"
                style={{ fontSize: "clamp(2.2rem, 7vw, 4rem)" }}
              >
                Sneha ✨
              </motion.h1>
              <AnimatePresence mode="wait">
                {!showSwipe ? (
                  <motion.p
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-3 font-body text-[#BAD0F0]/65 text-sm sm:text-base leading-relaxed"
                  >
                    This memory lane unlocks at midnight on her birthday.
                    <br />Come back in…
                  </motion.p>
                ) : !bursting ? (
                  <motion.p
                    key="ready"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 font-body text-[#BAD0F0]/65 text-sm sm:text-base leading-relaxed"
                  >
                    It's your birthday! Something special awaits you…
                  </motion.p>
                ) : (
                  <motion.p
                    key="burst"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 font-display italic text-xl sm:text-2xl text-[#E8F0FD] text-center"
                  >
                    Happy Birthday, Sneha! 🎉
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Countdown */}
            <AnimatePresence mode="wait">
              {!showSwipe && diff !== null && (
                <motion.div
                  key="countdown"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ delay: 0.75 }}
                  className="flex items-start gap-2 sm:gap-5"
                >
                  {[
                    { v: diff.d, l: "Days"  },
                    { v: diff.h, l: "Hours" },
                    { v: diff.m, l: "Mins"  },
                    { v: diff.s, l: "Secs"  },
                  ].map(({ v, l }, i) => (
                    <div key={l} className="flex items-start gap-2 sm:gap-5">
                      {i > 0 && (
                        <span className="font-display font-bold text-2xl sm:text-4xl text-[#60A5FA]/60 mt-1 select-none">
                          :
                        </span>
                      )}
                      <div className="flex flex-col items-center">
                        <motion.span
                          key={v}
                          initial={{ y: -8, opacity: 0 }}
                          animate={{ y: 0,  opacity: 1 }}
                          className="font-display font-bold text-2xl sm:text-5xl text-[#E8F0FD] leading-none tabular-nums"
                          style={{
                            background: "linear-gradient(135deg, #fff 0%, #BAD0F0 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          {pad(v)}
                        </motion.span>
                        <span className="font-body text-[0.6rem] uppercase tracking-widest text-[#BAD0F0]/40 mt-1.5">
                          {l}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Swipe slider */}
              {showSwipe && !bursting && (
                <motion.div
                  key="swipe"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full flex justify-center px-2"
                >
                  <SwipeUnlock onSwiped={handleSwiped} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom hint */}
            {!showSwipe && !bursting && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="font-body text-[0.7rem] text-[#BAD0F0]/30 tracking-widest uppercase"
              >
                Page auto-unlocks at midnight · No refresh needed
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
