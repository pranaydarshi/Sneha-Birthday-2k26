import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BURST_EMOJIS = ["🎂","🫂","✨","🎉","🌸","🌟","⭐","🎊","🤝","🎈"];

// ── Confetti burst on cut ─────────────────────────────────────
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
        dur:    0.7 + Math.random() * 0.6,
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
            position:"absolute", top:"44%", left:"50%",
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

// ── Kitchen knife SVG (blade points LEFT, handle on RIGHT) ────
function KnifeSvg({ active }) {
  const blade  = active ? "#BFDBFE" : "#D1D5DB";
  const handle = active ? "#1E3A8A" : "#1F2937";
  const guard  = active ? "#2563EB" : "#374151";
  return (
    <svg width={118} height={34} viewBox="0 0 236 68" fill="none">
      {/* Blade body */}
      <path d="M 4 34 L 118 19 L 118 49 Z" fill={blade} />
      {/* Blade bevel */}
      <path d="M 4 34 L 118 19 L 70 29 Z" fill="white" opacity={0.65} />
      {/* Blade spine */}
      <line x1="6" y1="33" x2="116" y2="22"
        stroke="white" strokeWidth="2" opacity={0.8} strokeLinecap="round" />
      {/* Blade body rectangle */}
      <rect x={116} y={22} width={18} height={24} fill={blade} />
      {/* Guard */}
      <rect x={132} y={12} width={10} height={44} rx={4} fill={guard} />
      {/* Handle shadow side */}
      <rect x={140} y={18} width={92} height={32} rx={8}
        fill={active ? "#0D1F3C" : "#111827"} />
      {/* Handle main */}
      <rect x={140} y={17} width={92} height={30} rx={7} fill={handle} />
      {/* Handle shine */}
      <rect x={144} y={20} width={82} height={5} rx={2.5}
        fill="rgba(255,255,255,0.12)" />
      {/* Grip lines */}
      {[162, 183, 207, 225].map(x => (
        <rect key={x} x={x} y={21} width={3} height={22} rx={1.5}
          fill="rgba(255,255,255,0.13)" />
      ))}
      {/* Rivets */}
      {[173, 215].map(x => (
        <circle key={x} cx={x} cy={32} r={4.5}
          fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      ))}
      {/* Active glow on blade */}
      {active && (
        <path d="M 4 34 L 118 19 L 118 49 Z"
          fill="rgba(147,197,253,0.25)" />
      )}
    </svg>
  );
}

// ── Slice that slides out after cut ───────────────────────────
function CakeSlice({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 0, rotate: 0, opacity: 0 }}
          animate={{ x: 55, rotate: 14, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute", right: 12, bottom: 14,
            width: 56, height: 72, zIndex: 15, pointerEvents: "none",
            borderRadius: "6px 6px 4px 4px",
            background: "linear-gradient(160deg, #3D1A0A 0%, #5C2D0E 40%, #7A3A12 100%)",
            boxShadow: "4px 8px 24px rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          {/* Frosting top */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:12,
            background:"linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.6) 100%)",
          }} />
          {/* Layer lines */}
          {[24, 44].map((t, i) => (
            <div key={i} style={{
              position:"absolute", left:0, right:0, top:t, height:4,
              background:"rgba(255,255,255,0.18)",
            }} />
          ))}
          {/* Side shine */}
          <div style={{
            position:"absolute", top:0, left:4, bottom:0, width:5,
            background:"linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)",
            borderRadius:3,
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function BirthdayCake({ onCelebrate }) {
  // idle → ready → cutting → cut
  const [phase, setPhase] = useState("idle");
  // Knife position relative to the cake img div (px)
  const [knifePos, setKnifePos] = useState({ x: 0, y: 0 });
  // The cut line: start x, end x, and y (all px relative to cake div)
  const [cutLine, setCutLine] = useState({ x1: 0, x2: 0, y: 0 });

  const cakeRef   = useRef(null);
  const startXRef = useRef(0);
  const onCelebRef = useRef(onCelebrate);
  onCelebRef.current = onCelebrate;

  // ── Document-level pointer listeners while cutting ──────────
  useEffect(() => {
    if (phase !== "cutting") return;

    const rect = cakeRef.current.getBoundingClientRect();
    const cakeW = rect.width;
    const cakeLeft = rect.left;
    const cakeTop  = rect.top;

    const onMove = (e) => {
      const src = e.touches ? e.touches[0] : e;
      const x = Math.max(0, Math.min(src.clientX - cakeLeft, cakeW));
      const y = Math.max(0, Math.min(src.clientY - cakeTop, rect.height));
      setKnifePos({ x, y });
      setCutLine(prev => ({
        x1: Math.min(prev.x1, x),
        x2: Math.max(prev.x2, x),
        y: prev.y,
      }));
      // Cut complete if horizontal sweep > 72% of cake width
      if (Math.abs(x - startXRef.current) / cakeW > 0.72) {
        setPhase("cut");
        if (onCelebRef.current) onCelebRef.current();
      }
    };
    const onUp = () => {
      // Lifted finger without completing cut → back to ready
      setPhase(prev => prev === "cutting" ? "ready" : prev);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerup",   onUp);
    document.addEventListener("touchmove",   onMove, { passive: true });
    document.addEventListener("touchend",    onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup",   onUp);
      document.removeEventListener("touchmove",   onMove);
      document.removeEventListener("touchend",    onUp);
    };
  }, [phase]);

  // ── Activate knife on tap ────────────────────────────────────
  const activateKnife = () => {
    if (phase === "idle") setPhase("ready");
  };

  // ── Grab knife → start cutting ───────────────────────────────
  const handleKnifeGrab = (e) => {
    if (phase !== "ready") return;
    e.preventDefault();
    e.stopPropagation();
    const rect = cakeRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    const x    = Math.max(0, Math.min(src.clientX - rect.left, rect.width));
    const y    = Math.max(0, Math.min(src.clientY - rect.top,  rect.height));
    startXRef.current = x;
    setKnifePos({ x, y });
    setCutLine({ x1: x, x2: x, y });
    setPhase("cutting");
  };

  const isCutDone  = phase === "cut";
  const isReady    = phase === "ready";
  const isCutting  = phase === "cutting";
  const isIdle     = phase === "idle";

  // Knife position when not grabbed (right edge of cake, vertically centered)
  // The knife is 118px wide; blade tip ≈ at left edge of knife div.
  // We position the knife div so it overlaps the right ~10px of cake.
  const knifeIdleStyle = {
    position: "absolute",
    right: -108,          // 108px outside the right edge so blade tip is at +10px from right
    top: "50%",
    transform: "translateY(-50%)",
    cursor: isIdle ? "pointer" : "grab",
    zIndex: 20,
    touchAction: "none",
  };

  const knifeCutStyle = {
    position: "absolute",
    // blade tip is at x≈0 of the knife div, position so tip ≈ pointer
    left: knifePos.x - 4,
    top:  knifePos.y - 17,
    zIndex: 20,
    pointerEvents: "none",
  };

  return (
    <section
      className="relative py-16 flex flex-col items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #EDF4FF 0%, #E8F0FD 50%, #EDF4FF 100%)" }}
    >
      <CakeBurst active={isCutDone} />

      {/* Side decorations */}
      <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:3.2, repeat:Infinity, ease:"easeInOut" }}
        className="absolute left-[3%] top-[22%] text-5xl hidden sm:block pointer-events-none select-none">🎈</motion.div>
      <motion.div animate={{ y:[0,-8,0] }} transition={{ duration:2.8, repeat:Infinity, ease:"easeInOut", delay:0.5 }}
        className="absolute left-[6%] top-[55%] text-3xl hidden sm:block pointer-events-none select-none">🎀</motion.div>
      <motion.div animate={{ y:[0,-12,0], rotate:[0,8,0] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut", delay:1 }}
        className="absolute left-[2%] top-[72%] text-4xl hidden sm:block pointer-events-none select-none">🌸</motion.div>
      <motion.div animate={{ y:[0,-6,0] }} transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut", delay:1.5 }}
        className="absolute left-[11%] top-[38%] text-2xl hidden lg:block pointer-events-none select-none">✨</motion.div>
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
          {isCutDone ? "Happy Birthday, Sneha! 🎉" : "Cut the cake 🎂"}
        </h2>
      </motion.div>

      {/* ── Cake + knife wrapper ── */}
      <div className="relative z-10 select-none" style={{ width:"min(380px, 88vw)" }}>

        {/* Cake image */}
        <div ref={cakeRef} style={{ position:"relative" }}>
          <motion.img
            src="/photos/birthday-cake.jpg"
            alt="Birthday cake"
            fetchpriority="high"
            decoding="async"
            className="w-full rounded-3xl"
            style={{
              boxShadow:"0 20px 60px rgba(37,99,235,0.2), 0 8px 20px rgba(0,0,0,0.18)",
              display:"block",
            }}
            animate={isCutDone ? { scale:[1,1.04,1] } : {}}
            transition={{ duration:0.6 }}
          />

          {/* Ready overlay: glow from right edge hinting where knife enters */}
          {isReady && (
            <motion.div
              animate={{ opacity:[0, 0.5, 0] }}
              transition={{ duration:1.1, repeat:Infinity }}
              style={{
                position:"absolute", inset:0, borderRadius:"1.5rem",
                background:"radial-gradient(ellipse at 95% 50%, rgba(96,165,250,0.45) 0%, transparent 55%)",
                pointerEvents:"none",
              }}
            />
          )}

          {/* Cut line — grows as knife moves */}
          {(isCutting || isCutDone) && cutLine.x2 > cutLine.x1 && (
            <div style={{
              position:"absolute",
              top: cutLine.y - 2,
              left: cutLine.x1,
              width: cutLine.x2 - cutLine.x1,
              height: 4,
              borderRadius: 2,
              background:"linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.95), rgba(255,255,255,0.05))",
              boxShadow:"0 0 10px rgba(255,255,255,0.9), 0 0 24px rgba(147,197,253,0.7)",
              pointerEvents:"none",
              zIndex:8,
            }} />
          )}

          {/* Cake slice sliding out */}
          <CakeSlice show={isCutDone} />
        </div>

        {/* ── Knife ── */}
        {/* Idle / Ready: sits to the right edge of cake */}
        {!isCutting && !isCutDone && (
          <motion.div
            style={knifeIdleStyle}
            animate={isIdle ? { x:[0,10,0] } : { x:0 }}
            transition={isIdle
              ? { duration:1.4, repeat:Infinity, ease:"easeInOut" }
              : { duration:0.25, ease:"easeOut" }
            }
            onClick={activateKnife}
            onPointerDown={handleKnifeGrab}
            onTouchStart={handleKnifeGrab}
          >
            <KnifeSvg active={!isIdle} />
            {/* Tap hint */}
            {isIdle && (
              <motion.div
                animate={{ opacity:[0.5,1,0.5] }}
                transition={{ duration:1.4, repeat:Infinity }}
                style={{
                  position:"absolute", top:"115%", left:"50%",
                  transform:"translateX(-50%)",
                  whiteSpace:"nowrap",
                  fontSize:"0.55rem", color:"#4A7CC9",
                  letterSpacing:"0.12em", textTransform:"uppercase",
                  textAlign:"center",
                }}
              >
                tap to activate
              </motion.div>
            )}
            {/* Active hint */}
            {isReady && (
              <motion.div
                animate={{ x:[0,-5,0] }}
                transition={{ duration:0.9, repeat:Infinity, ease:"easeInOut" }}
                style={{
                  position:"absolute", top:"115%", left:"50%",
                  transform:"translateX(-50%)",
                  whiteSpace:"nowrap",
                  fontSize:"0.55rem", color:"#2563EB",
                  letterSpacing:"0.1em", textTransform:"uppercase",
                  fontWeight:"bold",
                  textAlign:"center",
                }}
              >
                ← grab &amp; slide to cut
              </motion.div>
            )}
            {/* Glow ring when active */}
            {isReady && (
              <motion.div
                animate={{ scale:[1,1.12,1], opacity:[0.4,0.8,0.4] }}
                transition={{ duration:0.9, repeat:Infinity }}
                style={{
                  position:"absolute", inset:-8, borderRadius:8,
                  border:"2px solid #60A5FA",
                  pointerEvents:"none",
                  boxShadow:"0 0 16px rgba(96,165,250,0.5)",
                }}
              />
            )}
          </motion.div>
        )}

        {/* Cutting: knife follows finger */}
        {isCutting && (
          <div style={knifeCutStyle}>
            <KnifeSvg active />
          </div>
        )}
      </div>

      {/* ── CTA messages ── */}
      <div className="relative z-10 w-full flex flex-col items-center mt-8">
        <AnimatePresence mode="wait">
          {isIdle && (
            <motion.p
              key="idle"
              initial={{ opacity:0, y:8 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }}
              transition={{ delay:0.5 }}
              className="font-body text-sm text-[#4A7CC9] tracking-wide"
            >
              🔪 Tap the knife to activate it
            </motion.p>
          )}
          {isReady && (
            <motion.p
              key="ready"
              initial={{ opacity:0, y:8 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }}
              className="font-body text-sm text-[#2563EB] tracking-wide font-semibold"
            >
              ← Grab the knife and slice across!
            </motion.p>
          )}
          {isCutting && (
            <motion.p
              key="cutting"
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              exit={{ opacity:0 }}
              className="font-body text-sm text-[#60A5FA] tracking-wide"
            >
              Keep going… almost there! 🎂
            </motion.p>
          )}
          {isCutDone && (
            <motion.div
              key="cut"
              initial={{ opacity:0, y:16 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.35 }}
              className="text-center"
            >
              <p className="font-display italic text-xl sm:text-2xl text-[#2563EB]">
                Wishing you the most beautiful year yet! 🌸
              </p>
              <motion.button
                whileHover={{ scale:1.04 }}
                whileTap={{ scale:0.97 }}
                onClick={() => {
                  setPhase("idle");
                  setCutLine({ x1:0, x2:0, y:0 });
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
