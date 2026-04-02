import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BURST_EMOJIS = ["🎂","🫂","✨","🎉","🌟","⭐","🎊","🤝","🎈","🌸"];

// ── Celebration burst ─────────────────────────────────────────
function CakeBurst({ active }) {
  const [ps, setPs] = useState([]);
  useEffect(() => {
    if (!active) { setPs([]); return; }
    setPs(Array.from({ length: 36 }, (_, i) => ({
      id: i, sym: BURST_EMOJIS[i % BURST_EMOJIS.length],
      a: (i/36)*360+Math.random()*10, d: 100+Math.random()*150,
      s: 1.1+Math.random()*1, dl: Math.random()*0.2, dr: 0.6+Math.random()*0.5,
    })));
    const t = setTimeout(() => setPs([]), 2200);
    return () => clearTimeout(t);
  }, [active]);
  if (!ps.length) return null;
  return (
    <>
      <style>{`@keyframes bst{0%{opacity:1;transform:translate(0,0) scale(.3)}60%{opacity:1}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(1.1)}}`}</style>
      {ps.map(p => {
        const r = (p.a*Math.PI)/180;
        return <span key={p.id} style={{position:"absolute",top:"42%",left:"50%",fontSize:`${p.s}rem`,lineHeight:1,pointerEvents:"none",willChange:"transform,opacity","--tx":`${Math.cos(r)*p.d}px`,"--ty":`${Math.sin(r)*p.d-55}px`,animation:`bst ${p.dr}s ease-out ${p.dl}s both`}}>{p.sym}</span>;
      })}
    </>
  );
}

// ── Vertical knife SVG (blade DOWN, handle UP) ───────────────
function VerticalKnifeSvg({ h = 85 }) {
  return (
    <svg width={h * 0.4} height={h} viewBox="0 0 40 100" fill="none">
      <rect x={11} y={0} width={18} height={34} rx={4} fill="#1E3A8A"/>
      <rect x={14} y={4} width={12} height={2.5} rx={1} fill="rgba(255,255,255,.12)"/>
      <rect x={14} y={9} width={12} height={2.5} rx={1} fill="rgba(255,255,255,.08)"/>
      <rect x={14} y={14} width={12} height={2.5} rx={1} fill="rgba(255,255,255,.06)"/>
      <rect x={8} y={32} width={24} height={7} rx={2} fill="#4B5563"/>
      <path d="M 6 39 L 34 39 L 24 98 L 16 98 Z" fill="#CBD5E1"/>
      <path d="M 14 39 L 26 39 L 22 90 L 18 90 Z" fill="white" opacity={0.22}/>
      <line x1="16" y1="98" x2="24" y2="98" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── Sprinkles on a tier ───────────────────────────────────────
const SPRINKLE_C = ["#FCD34D","#F472B6","#60A5FA","#34D399","#FB923C","#A78BFA","#F87171"];
function Sprinkles({ seed = 0, n = 22 }) {
  const items = Array.from({ length: n }, (_, i) => {
    const k = i + seed * 100;
    return {
      x: 5 + ((k * 17.3) % 88),
      y: 8 + ((k * 11.7) % 78),
      r: ((k * 41) % 160) - 80,
      c: SPRINKLE_C[(k * 3) % SPRINKLE_C.length],
      w: 9 + (k % 5),
    };
  });
  return (
    <>
      {items.map((s, i) => (
        <div key={i} style={{
          position:"absolute", left:`${s.x}%`, top:`${s.y}%`,
          width:s.w, height:3, borderRadius:2,
          background:s.c, transform:`rotate(${s.r}deg)`,
          opacity:.75, pointerEvents:"none",
        }}/>
      ))}
    </>
  );
}

// ── Ganache drips ─────────────────────────────────────────────
function GanacheDrips({ count = 9, seed = 0 }) {
  return (
    <div style={{ position:"absolute", top:-6, left:0, right:0, display:"flex", justifyContent:"space-around", zIndex:2, pointerEvents:"none" }}>
      {Array.from({ length: count }, (_, i) => {
        const k = i + seed * 50;
        return (
          <motion.div key={i}
            animate={{ y:[0, 2, 0] }}
            transition={{ duration: 2.5 + (k%4)*0.4, repeat:Infinity, delay: (k%5)*0.2 }}
            style={{
              width: 12 + k%4*3,
              height: 16 + k%5*6,
              background:"linear-gradient(to bottom, #1C0A00, #2D0F02)",
              borderRadius:"0 0 50% 50%",
              opacity:.92,
              boxShadow:"0 2px 4px rgba(0,0,0,.2)",
            }}
          />
        );
      })}
    </div>
  );
}

// ── Pearl border ──────────────────────────────────────────────
function Pearls({ count = 14 }) {
  return (
    <div style={{ position:"absolute", bottom:8, left:0, right:0, display:"flex", justifyContent:"space-around", paddingInline:10, pointerEvents:"none", zIndex:3 }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          width:7, height:7, borderRadius:"50%",
          background:"radial-gradient(circle at 30% 30%, #9A7B5B, #6B4F35)",
          boxShadow:"0 1px 3px rgba(0,0,0,.3), inset 0 1px 2px rgba(255,255,255,.15)",
        }}/>
      ))}
    </div>
  );
}

// ── Single candle + flame (with blow-out support) ─────────────
function Candle({ color, stripe, idx, blown }) {
  return (
    <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center" }}>
      {/* Flame area — fixed height for layout stability */}
      <div style={{ position:"relative", height:17, width:10, marginBottom:1 }}>
        {!blown ? (
          <motion.div
            animate={{ y:[0,-3,0], scaleX:[1,1.2,.85,1] }}
            transition={{ duration:.55+idx*.08, repeat:Infinity, ease:"easeInOut" }}
            style={{ position:"absolute", bottom:0, left:1.5 }}
          >
            <div style={{ width:7, height:16, background:"linear-gradient(to top,#EF4444,#F97316 40%,#FCD34D 75%,#FEF9C3)", borderRadius:"50% 50% 40% 40%", filter:"blur(.4px)" }}/>
            <div style={{ position:"absolute", bottom:3, left:"50%", marginLeft:-1.5, width:3, height:6, background:"rgba(255,255,255,.85)", borderRadius:"50% 50% 40% 40%", filter:"blur(.5px)" }}/>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0.7, y: 5, scale: 0.4 }}
            animate={{ opacity: 0, y: -18, scale: 2.5 }}
            transition={{ duration: 1.2, delay: idx * 0.12 }}
            style={{
              position:"absolute", bottom:4, left:"50%", marginLeft:-3,
              width:6, height:6, borderRadius:"50%",
              background:"rgba(180,180,200,0.6)",
              filter:"blur(3px)", pointerEvents:"none",
            }}
          />
        )}
      </div>
      {/* Candle body */}
      <div style={{
        width:10, height:42,
        background:`repeating-linear-gradient(to bottom,${color} 0px,${color} 7px,${stripe} 7px,${stripe} 9px)`,
        borderRadius:"3px 3px 1px 1px",
        boxShadow:"inset -2px 0 4px rgba(0,0,0,.12), inset 1px 0 3px rgba(255,255,255,.2)",
      }}/>
    </div>
  );
}

// ── Interior face (chocolate cake cross-section with cream) ──
function InteriorFace({ style }) {
  return (
    <div style={{
      position:"absolute", top:0, bottom:0,
      background:"linear-gradient(180deg, #3D1A08, #2A0E03 15%, #4A1E0A 50%, #3A1506 85%, #2A0E03)",
      zIndex:4, pointerEvents:"none",
      ...style,
    }}>
      {[22, 48, 74].map(yp => (
        <div key={yp} style={{
          position:"absolute", left:0, right:0,
          top:`${yp}%`, height:3,
          background:"rgba(245,235,210,.8)",
          boxShadow:"0 1px 2px rgba(0,0,0,.12)",
        }}/>
      ))}
    </div>
  );
}

// ══════ MAIN: CSS Chocolate Truffle Cake ══════════════════════
const TOP_W = 168, TOP_H = 72;
const BOT_W = 252, BOT_H = 86;
const CHOC = "linear-gradient(to right, #1C0A00 0%, #3D1A08 12%, #5C2A0A 50%, #3D1A08 88%, #1C0A00 100%)";
const CHOC_LIGHT = "linear-gradient(to right, #2D1206 0%, #4A2010 12%, #6B3514 50%, #4A2010 88%, #2D1206 100%)";

const CANDLES = [
  { color:"#F9A8D4", stripe:"#EC4899" },
  { color:"#93C5FD", stripe:"#3B82F6" },
  { color:"#FDE68A", stripe:"#F59E0B" },
  { color:"#F9A8D4", stripe:"#EC4899" },
  { color:"#86EFAC", stripe:"#22C55E" },
];

const topTierBody = {
  width: TOP_W, height: TOP_H, borderRadius: 6,
  background: CHOC,
  overflow: "hidden",
  boxShadow: "inset 0 2px 10px rgba(255,255,255,.08), inset 0 -4px 12px rgba(0,0,0,.25), 0 4px 12px rgba(0,0,0,.2)",
  border: "1.5px solid rgba(80,40,10,.5)",
};

function useCakeAudio() {
  const audioRef = useRef(null);
  const play = (src, volume = 0.65) => {
    try {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      const a = new Audio(src);
      a.volume = volume;
      a.play().catch(() => {});
      audioRef.current = a;
      window._cakeAudio = a; // expose so StoryMode can hand off
    } catch (_) {}
  };
  const stop = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    window._cakeAudio = null;
  };
  useEffect(() => () => stop(), []);
  return { play, stop };
}

export default function BirthdayCake({ onCelebrate }) {
  // Phases: idle → blowing → celebrated → knife → placed1 → slicing → done
  const [phase, setPhase]       = useState("idle");
  const [blown, setBlown]       = useState(false);
  const [knifeXPct, setKnifeXPct] = useState(50);
  const [cuts, setCuts]         = useState([]);
  const [dropping, setDropping] = useState(false);

  const tierRef     = useRef(null);
  const droppingRef = useRef(false);
  const onCelebRef  = useRef(onCelebrate);
  onCelebRef.current = onCelebrate;
  const cakeAudio   = useCakeAudio();

  // ── Auto phase transitions ────────────────────────────────
  useEffect(() => {
    let t;
    if (phase === "blowing") {
      setBlown(true);
      // Play cake-cutting song when candles blow out
      cakeAudio.play("/audio/cake.mp3", 0.6);
      t = setTimeout(() => setPhase("celebrated"), 1200);
    } else if (phase === "celebrated") {
      t = setTimeout(() => setPhase("knife"), 2500);
    } else if (phase === "slicing") {
      t = setTimeout(() => {
        setPhase("done");
        if (onCelebRef.current) onCelebRef.current();
      }, 1500);
    }
    return () => clearTimeout(t);
  }, [phase]);

  // ── Pointer tracking for knife guide ──────────────────────
  useEffect(() => {
    if (phase !== "knife" && phase !== "placed1") return;
    const onMove = (e) => {
      if (droppingRef.current) return;
      const tier = tierRef.current;
      if (!tier) return;
      const rect = tier.getBoundingClientRect();
      const src = e.touches ? e.touches[0] : e;
      const pct = ((src.clientX - rect.left) / rect.width) * 100;
      setKnifeXPct(Math.max(10, Math.min(90, pct)));
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("touchmove", onMove);
    };
  }, [phase]);

  // ── Tap handler ───────────────────────────────────────────
  const handleTap = (e) => {
    const tier = tierRef.current;
    let tapPct = knifeXPct;
    if (tier && (phase === "knife" || phase === "placed1")) {
      const rect = tier.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      tapPct = Math.max(10, Math.min(90, pct));
      setKnifeXPct(tapPct);
    }

    if (phase === "idle") {
      setPhase("blowing");
    } else if (phase === "knife" && !droppingRef.current) {
      droppingRef.current = true;
      setDropping(true);
      const cutPct = tapPct;
      setTimeout(() => {
        setCuts([cutPct]);
        droppingRef.current = false;
        setDropping(false);
        setPhase("placed1");
      }, 450);
    } else if (phase === "placed1" && !droppingRef.current) {
      if (Math.abs(tapPct - cuts[0]) < 12) return;
      droppingRef.current = true;
      setDropping(true);
      const cutPct = tapPct;
      setTimeout(() => {
        setCuts(prev => [...prev, cutPct].sort((a, b) => a - b));
        droppingRef.current = false;
        setDropping(false);
        setPhase("slicing");
      }, 450);
    }
  };

  const reset = (e) => {
    if (e) e.stopPropagation();
    setPhase("idle");
    setBlown(false);
    setCuts([]);
    setKnifeXPct(50);
    setDropping(false);
    droppingRef.current = false;
  };

  // ── Computed values ───────────────────────────────────────
  const isCuttable = phase === "knife" || phase === "placed1";
  const showSlice  = phase === "slicing" || phase === "done";
  const leftCut    = cuts.length >= 2 ? cuts[0] : 0;
  const rightCut   = cuts.length >= 2 ? cuts[1] : 0;

  const toBottomPct = (topPct) =>
    topPct * (TOP_W / BOT_W) + ((BOT_W - TOP_W) / 2 / BOT_W) * 100;

  return (
    <section
      className="relative py-16 flex flex-col items-center overflow-hidden"
      style={{ background:"linear-gradient(180deg, #EDF4FF 0%, #E8F0FD 50%, #EDF4FF 100%)" }}
    >
      <CakeBurst active={phase === "celebrated" || phase === "done"} />

      {/* side decorations */}
      {[
        { pos:"left-[2%] top-[22%]",  sz:"text-2xl sm:text-5xl", em:"🎈", dur:3.2, d:0   },
        { pos:"left-[4%] top-[55%]",  sz:"text-xl  sm:text-3xl", em:"🎀", dur:2.8, d:.5  },
        { pos:"left-[1%] top-[72%]",  sz:"text-2xl sm:text-4xl", em:"🌸", dur:4,   d:1   },
        { pos:"right-[2%] top-[20%]", sz:"text-2xl sm:text-5xl", em:"🎊", dur:3.5, d:.3  },
        { pos:"right-[4%] top-[52%]", sz:"text-xl  sm:text-3xl", em:"🌟", dur:3,   d:.8  },
        { pos:"right-[1%] top-[70%]", sz:"text-2xl sm:text-4xl", em:"🫂", dur:3.8, d:1.2 },
        { pos:"right-[11%] top-[36%]",sz:"hidden lg:block text-2xl", em:"🎁", dur:2.6, d:.6 },
      ].map((d,i) => (
        <motion.div key={i} animate={{ y:[0,-10,0] }}
          transition={{ duration:d.dur, repeat:Infinity, ease:"easeInOut", delay:d.d }}
          className={`absolute ${d.pos} ${d.sz} pointer-events-none select-none`}>{d.em}</motion.div>
      ))}

      {/* heading */}
      <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
        className="relative z-10 text-center mb-8">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-[#3D6EA8] mb-2">Make a Wish</p>
        <h2 className="font-display italic font-bold text-[#0D1F3C] drop-shadow-sm"
          style={{ fontSize:"clamp(1.8rem, 5vw, 3rem)" }}>
          {phase === "done"       ? "Happy Birthday, Sneha! 🎉" :
           phase === "slicing"    ? "🎂🎉" :
           isCuttable || dropping ? "Cut the cake! 🔪" :
           phase === "celebrated" ? "Time to cut! 🎂" :
           phase === "blowing"    ? "Make a wish… ✨" :
                                    "Tap the cake 🎂"}
        </h2>
      </motion.div>

      {/* ══════ CAKE + KNIFE WRAPPER ══════ */}
      <div
        onClick={handleTap}
        className="relative z-10 select-none"
        style={{
          width: "min(320px, 88vw)",
          overflow: "visible",
          cursor: phase === "idle" ? "pointer" : isCuttable ? "crosshair" : "default",
          touchAction: isCuttable ? "none" : undefined,
        }}
      >
        {/* ── CSS CAKE ── */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>

          {/* candles */}
          <div style={{ display:"flex", gap:14, marginBottom:2, position:"relative", zIndex:10 }}>
            {CANDLES.map((c,i) => (
              <Candle key={i} idx={i} color={c.color} stripe={c.stripe} blown={blown}/>
            ))}
          </div>

          {/* ─── TOP TIER ─── */}
          <div ref={tierRef} style={{ position:"relative", zIndex:9 }}>
            <GanacheDrips count={8} seed={1}/>

            {/* Full cake body (when NOT slicing) */}
            {!showSlice && (
              <div style={{ ...topTierBody, position:"relative" }}>
                <Sprinkles seed={1} n={20}/>
                <Pearls count={12}/>
                <div style={{ position:"absolute", top:0, left:8, width:14, bottom:0, background:"linear-gradient(to bottom,rgba(255,255,255,.08),transparent)", borderRadius:4 }}/>
              </div>
            )}

            {/* Split cake — left remainder */}
            {showSlice && (
              <div style={{ ...topTierBody, position:"relative", clipPath:`inset(0 ${(100-leftCut).toFixed(1)}% 0 0)` }}>
                <Sprinkles seed={1} n={20}/>
                <Pearls count={12}/>
              </div>
            )}

            {/* Split cake — right remainder */}
            {showSlice && (
              <div style={{ ...topTierBody, position:"absolute", top:0, left:0, clipPath:`inset(0 0 0 ${rightCut.toFixed(1)}%)` }}>
                <Sprinkles seed={1} n={20}/>
                <Pearls count={12}/>
              </div>
            )}

            {/* Interior faces visible in the gap */}
            {showSlice && (
              <>
                <InteriorFace style={{ left:`${leftCut}%`, width:5 }} />
                <InteriorFace style={{ left:`calc(${rightCut}% - 5px)`, width:5 }} />
              </>
            )}

            {/* Animated slice piece */}
            <AnimatePresence>
              {showSlice && (
                <motion.div
                  initial={{ y: 0, rotate: 0, x: 0 }}
                  animate={{ y: -55, rotate: -6, x: 10 }}
                  transition={{ duration: 0.85, ease: [.22,1,.36,1] }}
                  style={{
                    position:"absolute", top:0, left:0,
                    width: TOP_W, height: TOP_H, borderRadius:6,
                    clipPath:`inset(0 ${(100-rightCut).toFixed(1)}% 0 ${leftCut.toFixed(1)}%)`,
                    transformOrigin:`${((leftCut+rightCut)/2).toFixed(1)}% 100%`,
                    zIndex:15, overflow:"hidden",
                    boxShadow:"4px 8px 24px rgba(0,0,0,.4)",
                  }}
                >
                  <div style={{ position:"absolute", inset:0, background:CHOC, borderRadius:6 }}>
                    <Sprinkles seed={1} n={20}/>
                    <Pearls count={12}/>
                  </div>
                  <InteriorFace style={{ left:`${leftCut}%`, width:5 }} />
                  <InteriorFace style={{ left:`calc(${rightCut}% - 5px)`, width:5 }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cut lines (extend through bridge + bottom tier) */}
            {cuts.map((cut, i) => (
              <motion.div key={`cut-${i}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  position:"absolute", top:-2, bottom:-100,
                  left:`${cut}%`, width:2, borderRadius:1,
                  background:"linear-gradient(to bottom, rgba(255,255,255,.85), rgba(255,255,255,.5), rgba(255,255,255,.2), transparent)",
                  boxShadow:"0 0 8px rgba(255,255,255,.6)",
                  transformOrigin:"top", zIndex:20, pointerEvents:"none",
                }}
              />
            ))}

            {/* Guide line (dashed, follows finger) */}
            {isCuttable && !dropping && (
              <motion.div
                animate={{ left: `${knifeXPct}%` }}
                transition={{ duration: 0.06 }}
                style={{
                  position:"absolute", top:-55, bottom:-100,
                  width:0, borderLeft:"2px dashed rgba(96,165,250,0.45)",
                  pointerEvents:"none", zIndex:25,
                }}
              />
            )}

            {/* Hovering knife (follows finger) */}
            {isCuttable && !dropping && (
              <motion.div
                animate={{ left: `${knifeXPct}%` }}
                transition={{ duration: 0.08, ease: "linear" }}
                style={{
                  position:"absolute", top:-90,
                  transform:"translateX(-50%)",
                  zIndex:30, pointerEvents:"none",
                }}
              >
                <VerticalKnifeSvg h={82}/>
              </motion.div>
            )}

            {/* Dropping knife animation */}
            <AnimatePresence>
              {dropping && (
                <motion.div
                  key={`drop-${cuts.length}`}
                  initial={{ top: -90, opacity: 1 }}
                  animate={{ top: 200, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    top: { duration: 0.4, ease: "easeIn" },
                    opacity: { delay: 0.35, duration: 0.1 },
                  }}
                  style={{
                    position:"absolute",
                    left:`${knifeXPct}%`,
                    transform:"translateX(-50%)",
                    zIndex:30, pointerEvents:"none",
                  }}
                >
                  <VerticalKnifeSvg h={82}/>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* frosting bridge */}
          <div style={{
            width:TOP_W+30, height:10,
            background:"linear-gradient(to right, #1C0A00, #3D1A08 20%, #4A2010 50%, #3D1A08 80%, #1C0A00)",
            borderRadius:"0 0 4px 4px", position:"relative", zIndex:8,
            boxShadow:"0 2px 6px rgba(0,0,0,.15)",
          }}/>

          {/* ─── BOTTOM TIER ─── */}
          <div style={{ position:"relative", zIndex:7, marginTop:-2 }}>
            <GanacheDrips count={11} seed={2}/>
            <div style={{
              width:BOT_W, height:BOT_H, borderRadius:6,
              background:CHOC_LIGHT,
              position:"relative", overflow:"hidden",
              boxShadow:"inset 0 2px 10px rgba(255,255,255,.06), inset 0 -4px 12px rgba(0,0,0,.25), 0 6px 18px rgba(0,0,0,.25)",
              border:"1.5px solid rgba(80,40,10,.4)",
            }}>
              <Sprinkles seed={3} n={28}/>
              <Pearls count={18}/>
              <div style={{ position:"absolute", top:0, left:10, width:16, bottom:0, background:"linear-gradient(to bottom,rgba(255,255,255,.06),transparent)", borderRadius:4 }}/>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{
                  fontFamily:"Georgia,serif", fontSize:32, fontWeight:"bold",
                  color:"rgba(255,220,180,.55)",
                  textShadow:"0 0 18px rgba(255,180,80,.45), 0 2px 6px rgba(0,0,0,.5)",
                  letterSpacing:6,
                }}>23</span>
              </div>

              {/* Cut lines on bottom tier (converted position) */}
              {cuts.map((cut, i) => (
                <motion.div key={`bcut-${i}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  style={{
                    position:"absolute", top:0, bottom:0,
                    left:`${toBottomPct(cut)}%`, width:2, borderRadius:1,
                    background:"rgba(255,255,255,.3)",
                    boxShadow:"0 0 6px rgba(255,255,255,.3)",
                    transformOrigin:"top", zIndex:5, pointerEvents:"none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* glass stand */}
          <div style={{
            width:BOT_W+32, height:18, marginTop:-2,
            background:"linear-gradient(to right, transparent 0%, rgba(200,220,240,.35) 20%, rgba(255,255,255,.55) 50%, rgba(200,220,240,.35) 80%, transparent 100%)",
            borderRadius:"0 0 50% 50% / 0 0 100% 100%",
            boxShadow:"0 6px 20px rgba(0,0,0,.1)",
            border:"1px solid rgba(200,220,240,.4)", borderTop:"none",
          }}/>
        </div>

        {/* Idle tap hint */}
        {phase === "idle" && (
          <motion.div
            animate={{ opacity:[.5,1,.5] }}
            transition={{ duration:1.5, repeat:Infinity }}
            style={{
              position:"absolute", top:8, left:"50%", transform:"translateX(-50%)",
              whiteSpace:"nowrap", fontSize:".55rem", color:"#fff",
              background:"rgba(30,58,138,.8)", padding:"3px 10px", borderRadius:99,
              zIndex:40, pointerEvents:"none",
              letterSpacing:".08em", textTransform:"uppercase",
            }}
          >
            🎂 tap the cake
          </motion.div>
        )}
      </div>

      {/* ── Status messages ── */}
      <div className="relative z-10 w-full flex flex-col items-center mt-8 min-h-[56px]">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.p key="i" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }} transition={{ delay:.5 }}
              className="font-body text-sm text-[#4A7CC9] tracking-wide text-center">
              🎂 Tap the cake to blow out the candles!
            </motion.p>
          )}
          {phase === "blowing" && (
            <motion.p key="b" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="font-body text-sm text-[#60A5FA] tracking-wide text-center italic">
              Make a wish… ✨
            </motion.p>
          )}
          {phase === "celebrated" && (
            <motion.p key="c" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              className="font-body text-sm text-[#2563EB] tracking-wide text-center font-semibold">
              🔪 Time to cut the cake!
            </motion.p>
          )}
          {phase === "knife" && (
            <motion.p key="k" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              className="font-body text-sm text-[#2563EB] tracking-wide text-center">
              Tap on the cake to make your first cut!
            </motion.p>
          )}
          {phase === "placed1" && (
            <motion.p key="p1" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              className="font-body text-sm text-[#2563EB] tracking-wide text-center font-semibold">
              Great! Now tap for the second cut! ✂️
            </motion.p>
          )}
          {phase === "slicing" && (
            <motion.p key="s" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="font-display italic text-xl text-[#2563EB] text-center">
              🎉🎂🎉
            </motion.p>
          )}
          {phase === "done" && (
            <motion.div key="d" initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:.3 }}
              className="text-center">
              <p className="font-display italic text-xl sm:text-2xl text-[#2563EB]">
                Wishing you the most beautiful year yet! 🌸
              </p>
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:.97 }}
                onClick={reset}
                className="mt-4 px-5 py-2 rounded-full border border-[#60A5FA] text-[#2563EB] font-body text-sm hover:bg-[#E8F0FD] transition">
                🎂 Cut again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
