import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BURST_EMOJIS = ["🎂","🫂","✨","🎉","🌸","🌟","⭐","🎊","🤝","🎈"];

function CakeBurst({ active }) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (!active) { setParticles([]); return; }
    setParticles(
      Array.from({ length: 38 }, (_, i) => ({
        id:    i,
        symbol: BURST_EMOJIS[i % BURST_EMOJIS.length],
        angle:  (i / 38) * 360 + Math.random() * 9,
        dist:   100 + Math.random() * 160,
        size:   1.1 + Math.random() * 1,
        delay:  Math.random() * 0.2,
        dur:    0.7 + Math.random() * 0.5,
      }))
    );
    const t = setTimeout(() => setParticles([]), 2200);
    return () => clearTimeout(t);
  }, [active]);
  if (!particles.length) return null;
  return (
    <>
      <style>{`@keyframes burst{0%{opacity:1;transform:translate(0,0) scale(0.3)}60%{opacity:1}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(1.1)}}`}</style>
      {particles.map(p => {
        const rad = (p.angle * Math.PI) / 180;
        return (
          <span key={p.id} style={{
            position:"absolute", top:"40%", left:"50%",
            fontSize:`${p.size}rem`, lineHeight:1,
            pointerEvents:"none", willChange:"transform,opacity",
            "--tx":`${Math.cos(rad)*p.dist}px`,
            "--ty":`${Math.sin(rad)*p.dist - 60}px`,
            animation:`burst ${p.dur}s ease-out ${p.delay}s both`,
          }}>{p.symbol}</span>
        );
      })}
    </>
  );
}

// ── Vertical kitchen knife (blade points DOWN) ────────────────
function KnifeSvg({ active, scale = 1 }) {
  const blade  = active ? "#BFDBFE" : "#D1D5DB";
  const handle = active ? "#1E3A8A" : "#1F2937";
  const guard  = active ? "#2563EB" : "#374151";
  const w = 28 * scale, h = 108 * scale;
  return (
    <svg width={w} height={h} viewBox="0 0 56 216" fill="none">
      {/* Handle */}
      <rect x={10} y={2} width={36} height={78} rx={8} fill={handle} />
      <rect x={13} y={6} width={12} height={70} rx={5} fill="rgba(255,255,255,0.07)" />
      {[16,32,50,66].map(y => (
        <rect key={y} x={12} y={y} width={32} height={3} rx={1.5} fill="rgba(255,255,255,0.12)" />
      ))}
      {[26, 58].map(y => (
        <circle key={y} cx={28} cy={y} r={4.5} fill="rgba(255,255,255,0.2)" />
      ))}
      {/* Guard */}
      <rect x={4} y={78} width={48} height={10} rx={3} fill={guard} />
      {/* Blade — widens at bolster, tapers to tip */}
      <path d="M 10 88 L 46 88 L 32 216 L 24 216 Z" fill={blade} />
      {/* Bevel */}
      <path d="M 10 88 L 28 88 L 28 216 Z" fill="white" opacity={0.45} />
      {/* Spine */}
      <line x1="26" y1="92" x2="28" y2="208"
        stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity={0.75} />
      {/* Active tip glow */}
      {active && (
        <ellipse cx={28} cy={210} rx={7} ry={5} fill="rgba(96,165,250,0.5)" />
      )}
    </svg>
  );
}

export default function BirthdayCake({ onCelebrate }) {
  // idle → ready → cutting → cut
  const [phase,     setPhase]     = useState("idle");
  const [knifePos,  setKnifePos]  = useState({ x: 0, y: 0 }); // px in cake coords
  const [cutLineH,  setCutLineH]  = useState(0);               // height of vertical cut line (px)
  const [cutXPct,   setCutXPct]   = useState(72);              // % from left where cut lands
  const [cutStartY, setCutStartY] = useState(0);

  const cakeRef    = useRef(null);
  const startYRef  = useRef(0);
  const cutXRef    = useRef(0);
  const onCelebRef = useRef(onCelebrate);
  onCelebRef.current = onCelebrate;

  // ── Document listeners while cutting (follow finger anywhere) ─
  useEffect(() => {
    if (phase !== "cutting") return;

    const rect   = cakeRef.current.getBoundingClientRect();
    const cakeH  = rect.height;
    const top    = rect.top;

    const onMove = (e) => {
      e.preventDefault();
      const src = e.touches ? e.touches[0] : e;
      const y   = Math.max(0, Math.min(src.clientY - top, cakeH));
      // Knife tip tracks the pointer; knife body extends UP from tip
      setKnifePos(prev => ({ ...prev, y: y - 108 }));
      setCutLineH(Math.max(0, y - startYRef.current));

      if ((y - startYRef.current) / cakeH > 0.68) {
        setPhase("cut");
        if (onCelebRef.current) onCelebRef.current();
      }
    };

    const onUp = () => {
      // Didn't finish cut → back to ready
      setPhase(prev => prev === "cutting" ? "ready" : prev);
      setCutLineH(0);
    };

    document.addEventListener("pointermove", onMove, { passive: false });
    document.addEventListener("pointerup",   onUp);
    document.addEventListener("touchmove",   onMove, { passive: false });
    document.addEventListener("touchend",    onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup",   onUp);
      document.removeEventListener("touchmove",   onMove);
      document.removeEventListener("touchend",    onUp);
    };
  }, [phase]);

  const handleKnifeGrab = (e) => {
    if (phase !== "ready") return;
    e.preventDefault();
    e.stopPropagation();

    const rect = cakeRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    const x    = src.clientX - rect.left;
    const y    = src.clientY - rect.top;

    startYRef.current = y;
    cutXRef.current   = x;
    setCutXPct((x / rect.width) * 100);
    setCutStartY(y);
    setKnifePos({ x: x - 14, y: y - 108 }); // blade tip at pointer
    setCutLineH(0);
    setPhase("cutting");
  };

  const isIdle    = phase === "idle";
  const isReady   = phase === "ready";
  const isCutting = phase === "cutting";
  const isCut     = phase === "cut";

  // Knife idle position: right side of cake, near top-right
  const IDLE_X_PCT = 74; // % from left
  const IDLE_Y_PX  = 14; // px from top (handle starts here, blade extends down)

  return (
    <section
      className="relative py-16 flex flex-col items-center overflow-hidden"
      style={{ background:"linear-gradient(180deg, #EDF4FF 0%, #E8F0FD 50%, #EDF4FF 100%)" }}
    >
      <CakeBurst active={isCut} />

      {/* Side decorations */}
      <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:3.2, repeat:Infinity, ease:"easeInOut" }}
        className="absolute left-[3%] top-[22%] text-5xl hidden sm:block pointer-events-none select-none">🎈</motion.div>
      <motion.div animate={{ y:[0,-8,0] }} transition={{ duration:2.8, repeat:Infinity, ease:"easeInOut", delay:0.5 }}
        className="absolute left-[6%] top-[55%] text-3xl hidden sm:block pointer-events-none select-none">🎀</motion.div>
      <motion.div animate={{ y:[0,-12,0], rotate:[0,8,0] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut", delay:1 }}
        className="absolute left-[2%] top-[72%] text-4xl hidden sm:block pointer-events-none select-none">🌸</motion.div>
      <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut", delay:0.3 }}
        className="absolute right-[3%] top-[20%] text-5xl hidden sm:block pointer-events-none select-none">🎊</motion.div>
      <motion.div animate={{ y:[0,-9,0], rotate:[0,-6,0] }} transition={{ duration:3, repeat:Infinity, ease:"easeInOut", delay:0.8 }}
        className="absolute right-[6%] top-[52%] text-3xl hidden sm:block pointer-events-none select-none">🌟</motion.div>
      <motion.div animate={{ y:[0,-11,0] }} transition={{ duration:3.8, repeat:Infinity, ease:"easeInOut", delay:1.2 }}
        className="absolute right-[2%] top-[70%] text-4xl hidden sm:block pointer-events-none select-none">🫂</motion.div>
      <motion.div animate={{ y:[0,-7,0] }} transition={{ duration:2.6, repeat:Infinity, ease:"easeInOut", delay:0.6 }}
        className="absolute right-[11%] top-[36%] text-2xl hidden lg:block pointer-events-none select-none">🎁</motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity:0, y:20 }}
        whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }}
        className="relative z-10 text-center mb-8"
      >
        <p className="font-body text-xs uppercase tracking-[0.3em] text-[#3D6EA8] mb-2">
          Make a Wish
        </p>
        <h2
          className="font-display italic font-bold text-[#0D1F3C] drop-shadow-sm"
          style={{ fontSize:"clamp(1.8rem, 5vw, 3rem)" }}
        >
          {isCut ? "Happy Birthday, Sneha! 🎉" : "Cut the cake 🎂"}
        </h2>
      </motion.div>

      {/* ── Cake container ── */}
      <div className="relative z-10 select-none" style={{ width:"min(360px, 88vw)" }}>

        {/* Overflow visible so knife handle can appear above image */}
        <div ref={cakeRef} style={{ position:"relative", overflow:"visible" }}>

          {/* ── BASE CAKE IMAGE ── */}
          {!isCut && (
            <img
              src="/photos/birthday-cake.jpg"
              alt="Birthday cake"
              fetchpriority="high"
              decoding="async"
              className="w-full rounded-3xl block"
              style={{ boxShadow:"0 20px 60px rgba(37,99,235,0.2), 0 8px 20px rgba(0,0,0,0.18)" }}
            />
          )}

          {/* ── SPLIT IMAGE after cut ── */}
          {isCut && (
            <>
              {/* Left portion — stays */}
              <div style={{
                width:"100%", borderRadius:"1.5rem",
                overflow:"hidden", lineHeight:0,
                clipPath:`inset(0 ${100 - cutXPct}% 0 0 round 1.5rem)`,
                boxShadow:"0 20px 60px rgba(37,99,235,0.2)",
              }}>
                <img src="/photos/birthday-cake.jpg"
                  className="w-full block" alt="" aria-hidden="true" />
              </div>

              {/* Right portion (slice) — slides away */}
              <motion.div
                initial={{ x:0, rotate:0, y:0 }}
                animate={{ x:46, rotate:11, y:-8 }}
                transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}
                style={{
                  position:"absolute", inset:0,
                  overflow:"hidden", borderRadius:"1.5rem",
                  clipPath:`inset(0 0 0 ${cutXPct}% round 1.5rem)`,
                  transformOrigin:`${cutXPct}% 60%`,
                  zIndex:8, lineHeight:0,
                  boxShadow:"6px 12px 32px rgba(0,0,0,0.35)",
                  pointerEvents:"none",
                }}
              >
                <img src="/photos/birthday-cake.jpg"
                  className="w-full block" alt="" aria-hidden="true" />
              </motion.div>

              {/* Cut gap line */}
              <motion.div
                initial={{ opacity:0 }}
                animate={{ opacity:[1,1,0] }}
                transition={{ duration:1.2, delay:0.3 }}
                style={{
                  position:"absolute", top:0, bottom:0,
                  left:`${cutXPct}%`, width:3,
                  background:"linear-gradient(to bottom, transparent, rgba(255,255,255,0.9) 20%, rgba(255,255,255,0.9) 80%, transparent)",
                  boxShadow:"0 0 12px rgba(255,255,255,0.9)",
                  zIndex:9, pointerEvents:"none",
                }}
              />
            </>
          )}

          {/* ── CUTTING: vertical cut line growing downward ── */}
          {isCutting && cutLineH > 0 && (
            <div style={{
              position:"absolute",
              left: cutXRef.current - 1.5,
              top: cutStartY,
              width: 3,
              height: cutLineH,
              background:"linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0.95))",
              boxShadow:"0 0 10px rgba(255,255,255,0.9), 0 0 24px rgba(147,197,253,0.8)",
              borderRadius:2,
              pointerEvents:"none",
              zIndex:10,
            }} />
          )}

          {/* ── READY: right-edge glow hint ── */}
          {isReady && (
            <motion.div
              animate={{ opacity:[0,0.5,0] }}
              transition={{ duration:1.1, repeat:Infinity }}
              style={{
                position:"absolute", inset:0, borderRadius:"1.5rem",
                background:`radial-gradient(ellipse at ${IDLE_X_PCT}% 30%, rgba(96,165,250,0.5) 0%, transparent 50%)`,
                pointerEvents:"none", zIndex:5,
              }}
            />
          )}

          {/* ── KNIFE ── always inside the cake image bounds ── */}
          {!isCut && (
            <motion.div
              style={{
                position: "absolute",
                // Idle/ready: fixed to upper-right area of cake
                // Cutting: follows pointer (tip at pointer.y)
                left: isCutting
                  ? knifePos.x
                  : `calc(${IDLE_X_PCT}% - 14px)`,
                top: isCutting
                  ? knifePos.y
                  : IDLE_Y_PX,
                zIndex: 20,
                cursor: isIdle ? "pointer" : isReady ? "grab" : "none",
                pointerEvents: isCutting ? "none" : "auto",
              }}
              // Idle: gentle up-down bounce
              animate={isIdle ? { y:[0,-7,0] } : { y:0 }}
              transition={isIdle
                ? { duration:1.3, repeat:Infinity, ease:"easeInOut" }
                : { duration:0.15 }
              }
              onClick={() => { if (isIdle) setPhase("ready"); }}
              onPointerDown={handleKnifeGrab}
              onTouchStart={handleKnifeGrab}
            >
              <KnifeSvg active={!isIdle} />

              {/* Idle hint label */}
              {isIdle && (
                <motion.div
                  animate={{ opacity:[0.5,1,0.5] }}
                  transition={{ duration:1.4, repeat:Infinity }}
                  style={{
                    position:"absolute", top:"110%", left:"50%",
                    transform:"translateX(-50%)",
                    whiteSpace:"nowrap", textAlign:"center",
                    fontSize:"0.52rem", color:"#fff",
                    letterSpacing:"0.12em", textTransform:"uppercase",
                    background:"rgba(30,58,138,0.75)",
                    padding:"2px 7px", borderRadius:99,
                    backdropFilter:"blur(4px)",
                    pointerEvents:"none",
                  }}
                >
                  tap me
                </motion.div>
              )}

              {/* Ready: pulsing glow ring + hint */}
              {isReady && (
                <>
                  <motion.div
                    animate={{ scale:[1,1.15,1], opacity:[0.5,0.9,0.5] }}
                    transition={{ duration:0.9, repeat:Infinity }}
                    style={{
                      position:"absolute", inset:-8, borderRadius:8,
                      border:"2px solid #60A5FA",
                      boxShadow:"0 0 18px rgba(96,165,250,0.6)",
                      pointerEvents:"none",
                    }}
                  />
                  <motion.div
                    animate={{ y:[0,5,0], opacity:[0.6,1,0.6] }}
                    transition={{ duration:0.9, repeat:Infinity }}
                    style={{
                      position:"absolute", top:"108%", left:"50%",
                      transform:"translateX(-50%)",
                      whiteSpace:"nowrap", textAlign:"center",
                      fontSize:"0.52rem", color:"#fff",
                      letterSpacing:"0.1em", textTransform:"uppercase",
                      background:"rgba(37,99,235,0.82)",
                      padding:"2px 7px", borderRadius:99,
                      backdropFilter:"blur(4px)",
                      pointerEvents:"none",
                    }}
                  >
                    ↓ drag down
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </div>{/* /cakeRef */}
      </div>

      {/* ── Status messages ── */}
      <div className="relative z-10 w-full flex flex-col items-center mt-8 min-h-[56px]">
        <AnimatePresence mode="wait">
          {isIdle && (
            <motion.p key="idle"
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              transition={{ delay:0.5 }}
              className="font-body text-sm text-[#4A7CC9] tracking-wide text-center"
            >
              🔪 Tap the knife on the cake to activate it
            </motion.p>
          )}
          {isReady && (
            <motion.p key="ready"
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="font-body text-sm text-[#2563EB] tracking-wide font-semibold text-center"
            >
              Grab the knife and slide DOWN to cut!
            </motion.p>
          )}
          {isCutting && (
            <motion.p key="cutting"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="font-body text-sm text-[#60A5FA] tracking-wide text-center"
            >
              Keep going… slice through! 🎂
            </motion.p>
          )}
          {isCut && (
            <motion.div key="cut"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.3 }}
              className="text-center"
            >
              <p className="font-display italic text-xl sm:text-2xl text-[#2563EB]">
                Wishing you the most beautiful year yet! 🌸
              </p>
              <motion.button
                whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                onClick={() => {
                  setPhase("idle");
                  setCutLineH(0);
                }}
                className="mt-4 px-5 py-2 rounded-full border border-[#60A5FA] text-[#2563EB]
                           font-body text-sm hover:bg-[#E8F0FD] transition"
              >
                🎂 Cut again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
