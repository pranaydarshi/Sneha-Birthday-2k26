import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import BowArrow from "./BowArrow";


const LETTER_LINES = [
  "For Sneha, Turning Twenty-Three 🎂",
  "",
  "Twenty-three — I still can't believe it's here,",
  "Two years since you walked in, yet somehow it's clear",
  "You've always been present, or so my heart says,",
  "Like a friendship that stretches back childhood days.",
  "",
  "You know me far better than I know myself,",
  "Like you've quietly read every thought on my shelf —",
  "The times that you laughed at the things that I'd do,",
  "The times you got irritated — I treasured those too.",
  "",
  "But I know there were moments I gave you my worst,",
  "Left sadness in places where joy should come first,",
  "Made you upset when I should have been kind —",
  "Those are the moments I never leave behind.",
  "",
  "And every time tears ever fell from your eyes,",
  "Something inside me would quietly die,",
  "I carry a promise I'll always hold true —",
  "To never be someone who brings tears to you.",
  "",
  "I won't say too much, because you already know",
  "How much you mean to me — more than words show,",
  "More than anyone else in this story called life,",
  "You make it feel lighter through chaos and strife.",
  "",
  "So here's to you, Sneha — my poti tingari,",
  "Happiest birthday, papa — shine without worry,",
  "Stay strong like you always have, bold and so bright —",
  "To me, you have always been worth every fight. 🫂",
];

// Fixed typewriter — uses useRef for lineIdx/charIdx to avoid stale closure bug
function useTypewriterLines(lines, active) {
  const [displayed, setDisplayed] = useState([]);
  const stateRef = useRef({ lineIdx: 0, charIdx: 0 });
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setDisplayed([]);
      clearTimeout(timerRef.current);
      return;
    }

    setDisplayed([]);
    stateRef.current = { lineIdx: 0, charIdx: 0 };

    const tick = () => {
      const { lineIdx, charIdx } = stateRef.current;
      if (lineIdx >= lines.length) return;

      const line = lines[lineIdx];

      if (charIdx <= line.length) {
        const text = line.slice(0, charIdx);
        // Capture index NOW — never read from stateRef inside the updater
        const idx = lineIdx;
        setDisplayed(prev => {
          const next = [...prev];
          next[idx] = text;
          return next;
        });
        stateRef.current.charIdx = charIdx + 1;
        timerRef.current = setTimeout(tick, line.length === 0 ? 80 : 26);
      } else {
        stateRef.current.lineIdx = lineIdx + 1;
        stateRef.current.charIdx = 0;
        timerRef.current = setTimeout(tick, 160);
      }
    };

    timerRef.current = setTimeout(tick, 600);
    return () => clearTimeout(timerRef.current);
  }, [active]); // eslint-disable-line

  return displayed;
}



// ── Pink paper airplane SVG ────────────────────────────────
function PaperPlane({ size = 52 }) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 56 36" fill="none">
      <path d="M1 18 L55 1 L40 18 L55 35 Z"
        fill="#D6E4F7" stroke="#60A5FA" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M40 18 L55 1"  stroke="#2563EB" strokeWidth="1"   opacity="0.55"/>
      <path d="M40 18 L55 35" stroke="#2563EB" strokeWidth="1"   opacity="0.55"/>
      <path d="M1 18 L40 18"  stroke="#93C5FD" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.6"/>
      <path d="M32 18 L38 26" stroke="#2563EB" strokeWidth="1"   opacity="0.4" strokeLinecap="round"/>
    </svg>
  );
}

// ── Flying plane — floats around, drag to dock zone, docks as BowArrow ──
function FlyingPlane({ onClick }) {
  const [phase,    setPhase]    = useState("flying");
  const [overDock, setOverDock] = useState(false);

  const x = useMotionValue(typeof window !== "undefined" ? window.innerWidth  * 0.05 : 0);
  const y = useMotionValue(typeof window !== "undefined" ? window.innerHeight * 0.70 : 0);
  const animRefs   = useRef([]);
  const dockRef    = useRef(null);
  const hasDragged = useRef(false);

  const stopAnim = () => animRefs.current.forEach(a => a.stop());

  const startFlying = useCallback(() => {
    stopAnim();
    const W = window.innerWidth, H = window.innerHeight;
    const xs = [W*.05, W*.22, W*.52, W*.80, W*.88, W*.60, W*.28, W*.10, W*.05];
    const ys = [H*.70, H*.28, H*.56, H*.12, H*.60, H*.82, H*.40, H*.18, H*.70];
    animRefs.current = [
      animate(x, xs, { duration: 26, ease: "easeInOut", repeat: Infinity }),
      animate(y, ys, { duration: 26, ease: "easeInOut", repeat: Infinity }),
    ];
  }, [x, y]); // eslint-disable-line

  useEffect(() => {
    if (phase === "flying") startFlying();
    else stopAnim();
    return stopAnim;
  }, [phase]); // eslint-disable-line

  const handleDragStart = () => {
    hasDragged.current = true;
    stopAnim();
    setPhase("dragging");
    setOverDock(false);
  };

  const handleDrag = () => {
    if (!dockRef.current) return;
    const dock = dockRef.current.getBoundingClientRect();
    const cx = x.get() + 28, cy = y.get() + 18;
    setOverDock(cx >= dock.left && cx <= dock.right && cy >= dock.top && cy <= dock.bottom);
  };

  const handleDragEnd = () => {
    setTimeout(() => { hasDragged.current = false; }, 80);
    if (overDock) { setPhase("docked"); return; }
    setPhase("flying");
    setOverDock(false);
  };

  // Tap (no drag) → open letter directly
  const handleClick = () => {
    if (hasDragged.current) return;
    onClick();
  };

  // ── Docked: show BowArrow game in corner ──────────────────
  if (phase === "docked") {
    return <BowArrow corner onLaunch={onClick} />;
  }

  // ── Flying / dragging ─────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes trailFade {
          0%,100% { opacity: 0; transform: scale(0.4); }
          50%     { opacity: 0.7; transform: scale(1); }
        }
        @keyframes labelFloat {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%     { transform: translateX(-50%) translateY(-4px); }
        }
        @keyframes dockPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(96,165,250,0.4); }
          50%     { box-shadow: 0 0 0 12px rgba(96,165,250,0); }
        }
      `}</style>

      <motion.div
        drag
        dragMomentum={false}
        style={{ x, y, position: "fixed", top: 0, left: 0, zIndex: 150,
          cursor: phase === "dragging" ? "grabbing" : "grab",
          touchAction: "none",
        }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        whileHover={{ scale: phase === "dragging" ? 1 : 1.25 }}
      >
        {["✨","⭐","💫"].map((s, i) => (
          <span key={i} style={{
            position: "absolute", top: 8 + i * 7, left: -(16 + i * 13),
            fontSize: "0.65rem", pointerEvents: "none",
            animation: `trailFade 1.2s ease-in-out ${i * 0.3}s infinite`,
          }}>{s}</span>
        ))}

        <PaperPlane size={56} />

        {phase === "flying" && (
          <div style={{
            position: "absolute", top: "100%", left: "50%",
            marginTop: 5, whiteSpace: "nowrap", pointerEvents: "none",
            animation: "labelFloat 2s ease-in-out infinite",
          }}>
            <span style={{
              fontSize: "0.58rem", color: "#3D6EA8",
              letterSpacing: "0.15em", textTransform: "uppercase",
              background: "rgba(232,240,253,0.88)",
              padding: "2px 8px", borderRadius: 99, backdropFilter: "blur(4px)",
            }}>dock me 🏹</span>
          </div>
        )}
      </motion.div>

      {/* Dock landing pad — appears while dragging */}
      <AnimatePresence>
        {phase === "dragging" && (
          <motion.div
            ref={dockRef}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{
              position: "fixed", bottom: 32, right: 28,
              zIndex: 155, width: 72, height: 72, borderRadius: "50%",
              background: overDock ? "rgba(96,165,250,0.2)" : "rgba(232,240,253,0.95)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 2,
              border: `2px dashed ${overDock ? "#60A5FA" : "#93C5FD"}`,
              animation: "dockPulse 1.4s ease-in-out infinite",
              transition: "background 0.2s, border-color 0.2s",
              pointerEvents: "none",
            }}
          >
            <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>🏹</span>
            <span style={{ fontSize: "0.44rem", color: "#3D6EA8",
              letterSpacing: "0.1em", textTransform: "uppercase" }}>
              drop here
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function LetterModal({ showPlane = false, autoOpen = false }) {
  const [open,        setOpen]        = useState(false);
  const [envelopeOut, setEnvelopeOut] = useState(false);
  const [showLetter,  setShowLetter]  = useState(false);
  const lines    = useTypewriterLines(LETTER_LINES, showLetter);
  const letterRef = useRef(null);

  const openModal = () => {
    setOpen(true);
    setTimeout(() => setEnvelopeOut(true), 500);
    setTimeout(() => setShowLetter(true), 1200);
  };

  // Auto-open when story ends
  useEffect(() => {
    if (autoOpen) {
      const t = setTimeout(openModal, 600); // small delay so story exit animates first
      return () => clearTimeout(t);
    }
  }, [autoOpen]); // eslint-disable-line

  const closeModal = () => {
    setOpen(false);
    setEnvelopeOut(false);
    setShowLetter(false);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const fn = e => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []); // eslint-disable-line

  return (
    <>
      {showPlane && !open && <FlyingPlane onClick={openModal} />}

      <AnimatePresence>
        {open && (
          <motion.div
            key="letter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-4"
            style={{ background: "rgba(10,20,45,0.88)", backdropFilter: "blur(10px)" }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 60 }}
              animate={{ scale: 1,   opacity: 1, y: 0  }}
              exit={{ scale: 0.85,  opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="relative w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              {/* Navy envelope */}
              <div
                className="relative w-full rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #D6E4F7, #BAD0F0)",
                  border: "1.5px solid rgba(96,165,250,0.6)",
                  minHeight: 320,
                }}
              >
                {/* Envelope flap */}
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: envelopeOut ? -160 : 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "top center", transformPerspective: 800 }}
                  className="absolute top-0 left-0 right-0 z-20"
                >
                  <div style={{
                    height: 0,
                    borderLeft: "50vw solid transparent",
                    borderRight: "50vw solid transparent",
                    borderTop: "90px solid #93BAE8",
                    maxWidth: "100%",
                  }} />
                </motion.div>

                {/* V-crease */}
                <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 90 }}>
                  <svg width="100%" height="90" viewBox="0 0 460 90" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="230" y2="90" stroke="#60A5FA" strokeWidth="1" opacity="0.5"/>
                    <line x1="460" y1="0" x2="230" y2="90" stroke="#60A5FA" strokeWidth="1" opacity="0.5"/>
                  </svg>
                </div>

                {/* Letter paper */}
                <AnimatePresence>
                  {showLetter && (
                    <motion.div
                      initial={{ y: 80, opacity: 0 }}
                      animate={{ y: 0,  opacity: 1 }}
                      exit={{ y: 40,   opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      ref={letterRef}
                      className="relative z-30 m-4 mt-10 rounded-xl p-5 sm:p-7 overflow-y-auto"
                      style={{
                        background: "linear-gradient(160deg, #FFFDF9, #F8F6F2)",
                        border: "1px solid rgba(96,165,250,0.3)",
                        boxShadow: "0 4px 24px rgba(37,99,235,0.15)",
                        maxHeight: "65vh",
                        scrollbarWidth: "thin",
                      }}
                    >
                      {/* Notebook lines */}
                      {[...Array(30)].map((_, i) => (
                        <div key={i}
                          className="absolute left-0 right-0 border-b"
                          style={{ top: 40 + i * 28, borderColor: "rgba(186,208,240,0.5)" }}
                        />
                      ))}

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#60A5FA" }}>
                            A letter from the heart
                          </span>
                          <span className="text-lg">✉️</span>
                        </div>

                        {/* Letter text */}
                        <div className="font-display text-[#0D1F3C] leading-[1.95]"
                             style={{ fontSize: "clamp(0.85rem, 2.5vw, 1rem)" }}>
                          {LETTER_LINES.map((line, i) => (
                            <div key={i} className={line === "" ? "h-3" : ""}>
                              {lines[i] !== undefined ? (
                                <span>
                                  {lines[i]}
                                  {i === lines.length - 1 && lines[i] !== LETTER_LINES[i] && (
                                    <motion.span
                                      animate={{ opacity: [1, 0] }}
                                      transition={{ duration: 0.5, repeat: Infinity }}
                                      className="inline-block w-[2px] h-4 ml-0.5 align-middle"
                                      style={{ background: "#60A5FA" }}
                                    />
                                  )}
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Waiting pulse */}
                <AnimatePresence>
                  {!showLetter && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 pb-8"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-4xl"
                      >
                        ✉️
                      </motion.span>
                      <p className="font-display italic text-[#2563EB] text-sm">
                        Opening your letter…
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Close */}
              <motion.button
                onClick={closeModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -top-4 -right-4 w-9 h-9 rounded-full shadow-lg
                           flex items-center justify-center text-sm font-bold transition z-40"
                style={{ background: "rgba(255,255,255,0.9)", color: "#2563EB", border: "1px solid #93C5FD" }}
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
