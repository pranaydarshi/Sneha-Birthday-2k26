import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "./Confetti";

// TEST: unlocks 10 seconds after page load
const UNLOCK_TIME = Date.now() + 10 * 1000; // TEST MODE

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function LockScreen({ onUnlocked }) {
  const [diff,        setDiff]        = useState(null);
  const [unlocked,    setUnlocked]    = useState(false);
  const [bursting,    setBursting]    = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const ms  = UNLOCK_TIME - now;

      if (ms <= 0) {
        setDiff({ d: 0, h: 0, m: 0, s: 0 });
        setBursting(true);
        // Short burst of confetti then reveal the site
        setTimeout(() => {
          setUnlocked(true);
          setTimeout(onUnlocked, 1800); // let exit animation play
        }, 2200);
        return; // stop ticking
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
  }, [onUnlocked]);

  return (
    <AnimatePresence>
      {!unlocked && (
        <motion.div
          key="lock"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #0D1F3C 0%, #122847 35%, #081228 100%)",
          }}
        >
          {/* Confetti on unlock */}
          {bursting && <Confetti />}

          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-[#60A5FA]/15 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#BAD0F0]/10 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

          <div className="relative z-10 text-center px-6 max-w-lg mx-auto flex flex-col items-center gap-8">

            {/* Floating lock / heart icon */}
            <motion.div
              animate={bursting
                ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] }
                : { y: [0, -10, 0] }
              }
              transition={bursting
                ? { duration: 0.6 }
                : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
              className="text-6xl select-none"
              aria-hidden="true"
            >
              {bursting ? "🫂" : "🔒"}
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
                Sneha 🤝
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-3 font-body text-[#BAD0F0]/65 text-sm sm:text-base leading-relaxed"
              >
                This memory lane unlocks at midnight on her birthday.
                <br />Come back in…
              </motion.p>
            </div>

            {/* Countdown */}
            {diff !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
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

            {/* Unlock message shown when countdown hits 0 */}
            <AnimatePresence>
              {bursting && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="font-display italic text-xl sm:text-2xl text-[#E8F0FD] text-center"
                >
                  It's time! Happy Birthday, Sneha! 🎉
                </motion.p>
              )}
            </AnimatePresence>

            {/* Hint */}
            {!bursting && (
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
