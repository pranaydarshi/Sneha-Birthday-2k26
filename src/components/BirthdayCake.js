import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BURST_EMOJIS = ["🎂","🫂","✨","🎉","🌸","🌟","⭐","🎊","🤝","🎈"];

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

// ── Horizontal knife SVG (blade LEFT, handle RIGHT) ───────────
function KnifeSvg({ active, w = 105 }) {
  const bl = active ? "#CBD5E1" : "#D1D5DB";
  const hd = active ? "#1E3A8A" : "#1F2937";
  const gd = active ? "#2563EB" : "#374151";
  const h = w * (34/105);
  return (
    <svg width={w} height={h} viewBox="0 0 210 68" fill="none">
      <path d="M 2 34 L 105 18 L 105 50 Z" fill={bl}/>
      <path d="M 2 34 L 105 18 L 55 28 Z" fill="white" opacity={.6}/>
      <line x1="10" y1="33" x2="100" y2="20" stroke="white" strokeWidth="2" opacity={.75} strokeLinecap="round"/>
      <rect x={103} y={20} width={16} height={28} fill={bl}/>
      <rect x={117} y={10} width={10} height={48} rx={3} fill={gd}/>
      <rect x={125} y={15} width={82} height={38} rx={7} fill={hd}/>
      <rect x={128} y={18} width={74} height={5} rx={2.5} fill="rgba(255,255,255,.1)"/>
      {[148,170,195].map(x=><rect key={x} x={x} y={19} width={3} height={30} rx={1.5} fill="rgba(255,255,255,.12)"/>)}
      {[158,185].map(x=><circle key={x} cx={x} cy={34} r={4} fill="rgba(255,255,255,.18)"/>)}
      {active && <path d="M 2 34 L 105 18 L 105 50 Z" fill="rgba(147,197,253,.2)"/>}
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

// ── Single candle + flame ─────────────────────────────────────
function Candle({ color, stripe, idx }) {
  return (
    <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <motion.div
        animate={{ y:[0,-3,0], scaleX:[1,1.2,.85,1] }}
        transition={{ duration:.55+idx*.08, repeat:Infinity, ease:"easeInOut" }}
        style={{ position:"relative", marginBottom:1 }}
      >
        <div style={{ width:7, height:16, background:"linear-gradient(to top,#EF4444,#F97316 40%,#FCD34D 75%,#FEF9C3)", borderRadius:"50% 50% 40% 40%", filter:"blur(.4px)" }}/>
        <div style={{ position:"absolute", bottom:3, left:"50%", marginLeft:-1.5, width:3, height:6, background:"rgba(255,255,255,.85)", borderRadius:"50% 50% 40% 40%", filter:"blur(.5px)" }}/>
      </motion.div>
      <div style={{
        width:10, height:42,
        background:`repeating-linear-gradient(to bottom,${color} 0px,${color} 7px,${stripe} 7px,${stripe} 9px)`,
        borderRadius:"3px 3px 1px 1px",
        boxShadow:"inset -2px 0 4px rgba(0,0,0,.12), inset 1px 0 3px rgba(255,255,255,.2)",
      }}/>
    </div>
  );
}

// ── MAIN: CSS Chocolate Truffle Cake ──────────────────────────
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

export default function BirthdayCake({ onCelebrate }) {
  const [phase, setPhase]       = useState("idle"); // idle|ready|cutting|cut
  const [knifeX, setKnifeX]     = useState(0);
  const [cutProg, setCutProg]   = useState(0);  // 0→1 how far left knife has gone
  const [cutPct, setCutPct]     = useState(68);  // % from left where cut lands
  const [tierTop, setTierTop]   = useState(0);   // top-tier Y within wrapper (px)

  const wrapRef    = useRef(null);
  const tierRef    = useRef(null);
  const startXRef  = useRef(0);
  const tierRectR  = useRef(null); // cached tier rect
  const onCelebRef = useRef(onCelebrate);
  onCelebRef.current = onCelebrate;

  // measure where top tier is so knife lines up
  useLayoutEffect(() => {
    if (!tierRef.current || !wrapRef.current) return;
    const wR = wrapRef.current.getBoundingClientRect();
    const tR = tierRef.current.getBoundingClientRect();
    setTierTop(tR.top - wR.top);
  }, []);

  // ── pointer tracking while cutting ─────────────────────────
  useEffect(() => {
    if (phase !== "cutting") return;
    const wR = wrapRef.current.getBoundingClientRect();
    const tR = tierRef.current.getBoundingClientRect();

    const onMove = (e) => {
      e.preventDefault();
      const src = e.touches ? e.touches[0] : e;
      const x = src.clientX - tR.left;
      // progress = how far knife tip has moved from right edge toward left
      const prog = Math.max(0, Math.min(1, (tR.width - x) / tR.width));
      setKnifeX(src.clientX - wR.left);
      setCutProg(prog);

      if (prog > 0.72) {
        setPhase("cut");
        setCutPct(Math.max(20, Math.min(80, (x / tR.width) * 100)));
        if (onCelebRef.current) onCelebRef.current();
      }
    };
    const onUp = () => {
      setPhase(p => p === "cutting" ? "ready" : p);
      setCutProg(0);
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

  // ── knife grab handler ─────────────────────────────────────
  const grabKnife = (e) => {
    if (phase !== "ready") return;
    e.preventDefault(); e.stopPropagation();
    const wR = wrapRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    startXRef.current = src.clientX;
    setKnifeX(src.clientX - wR.left);
    setCutProg(0);
    setPhase("cutting");
  };

  const isCut = phase === "cut";
  const isCutting = phase === "cutting";

  // knife idle position: to the right of the top tier, vertically centered on it
  const knifeIdleTop = tierTop + TOP_H / 2 - 16;

  return (
    <section
      className="relative py-16 flex flex-col items-center overflow-hidden"
      style={{ background:"linear-gradient(180deg, #EDF4FF 0%, #E8F0FD 50%, #EDF4FF 100%)" }}
    >
      <CakeBurst active={isCut} />

      {/* side decorations */}
      {[
        { pos:"left-[3%] top-[22%]", sz:"text-5xl", em:"🎈", dur:3.2, d:0 },
        { pos:"left-[6%] top-[55%]", sz:"text-3xl", em:"🎀", dur:2.8, d:.5 },
        { pos:"left-[2%] top-[72%]", sz:"text-4xl", em:"🌸", dur:4,   d:1 },
        { pos:"right-[3%] top-[20%]",sz:"text-5xl", em:"🎊", dur:3.5, d:.3 },
        { pos:"right-[6%] top-[52%]",sz:"text-3xl", em:"🌟", dur:3,   d:.8 },
        { pos:"right-[2%] top-[70%]",sz:"text-4xl", em:"🫂", dur:3.8, d:1.2 },
        { pos:"right-[11%] top-[36%]",sz:"text-2xl hidden lg:block", em:"🎁", dur:2.6, d:.6 },
      ].map((d,i) => (
        <motion.div key={i} animate={{ y:[0,-10,0] }}
          transition={{ duration:d.dur, repeat:Infinity, ease:"easeInOut", delay:d.d }}
          className={`absolute ${d.pos} ${d.sz} hidden sm:block pointer-events-none select-none`}>{d.em}</motion.div>
      ))}

      {/* heading */}
      <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
        className="relative z-10 text-center mb-8">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-[#3D6EA8] mb-2">Make a Wish</p>
        <h2 className="font-display italic font-bold text-[#0D1F3C] drop-shadow-sm"
          style={{ fontSize:"clamp(1.8rem, 5vw, 3rem)" }}>
          {isCut ? "Happy Birthday, Sneha! 🎉" : "Cut the cake 🎂"}
        </h2>
      </motion.div>

      {/* ══════ CAKE + KNIFE WRAPPER ══════ */}
      <div ref={wrapRef} className="relative z-10 select-none"
        style={{ width:"min(320px, 88vw)", overflow:"visible" }}>

        {/* ── CSS CAKE ── */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>

          {/* candles */}
          <div style={{ display:"flex", gap:14, marginBottom:2, position:"relative", zIndex:10 }}>
            {CANDLES.map((c,i) => <Candle key={i} idx={i} color={c.color} stripe={c.stripe}/>)}
          </div>

          {/* ─── TOP TIER ─── */}
          <div ref={tierRef} style={{ position:"relative", zIndex:9 }}>
            <GanacheDrips count={8} seed={1}/>

            {/* main body — clipped to left portion when cut */}
            <div style={{
              width:TOP_W, height:TOP_H, borderRadius:6,
              background:CHOC,
              position:"relative", overflow:"hidden",
              boxShadow:"inset 0 2px 10px rgba(255,255,255,.08), inset 0 -4px 12px rgba(0,0,0,.25), 0 4px 12px rgba(0,0,0,.2)",
              border:"1.5px solid rgba(80,40,10,.5)",
              clipPath: isCut ? `inset(0 ${100-cutPct}% 0 0)` : undefined,
            }}>
              <Sprinkles seed={1} n={20}/>
              <Pearls count={12}/>
              {/* shine */}
              <div style={{ position:"absolute", top:0, left:8, width:14, bottom:0, background:"linear-gradient(to bottom,rgba(255,255,255,.08),transparent)", borderRadius:4 }}/>
            </div>

            {/* ─── CUT SLICE (right portion — slides out) ─── */}
            <AnimatePresence>
              {isCut && (
                <motion.div
                  initial={{ x:0, rotate:0, y:0 }}
                  animate={{ x:52, rotate:12, y:-14 }}
                  transition={{ duration:.6, ease:[.22,1,.36,1] }}
                  style={{
                    position:"absolute", top:0, left:0,
                    width:TOP_W, height:TOP_H, borderRadius:6,
                    clipPath:`inset(0 0 0 ${cutPct}%)`,
                    transformOrigin:`${cutPct}% 60%`,
                    zIndex:15, overflow:"hidden",
                    boxShadow:"6px 10px 28px rgba(0,0,0,.45)",
                  }}
                >
                  {/* exterior */}
                  <div style={{ position:"absolute", inset:0, background:CHOC, borderRadius:6 }}>
                    <Sprinkles seed={1} n={20}/>
                    <Pearls count={12}/>
                  </div>
                  {/* interior face — chocolate layers with cream */}
                  <div style={{
                    position:"absolute", top:0, bottom:0,
                    left:`${cutPct}%`, width: 30,
                    background:"linear-gradient(135deg, #2A0E03, #4A1E0A 50%, #3A1506)",
                    zIndex:4,
                  }}>
                    {/* cream filling layers */}
                    {[.2, .48, .76].map((yp,i)=>(
                      <div key={i} style={{
                        position:"absolute", left:0, right:0,
                        top:`${yp*100}%`, height:4,
                        background:"rgba(245,235,210,.85)",
                        boxShadow:"0 1px 2px rgba(0,0,0,.15)",
                      }}/>
                    ))}
                    {/* frosting top */}
                    <div style={{
                      position:"absolute", top:0, left:0, right:0, height:8,
                      background:"linear-gradient(to bottom, #3D1A08, #2A0E03)",
                    }}/>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* cut line glowing while dragging */}
            {isCutting && cutProg > 0 && (
              <div style={{
                position:"absolute", top:-4, bottom:-4,
                left: `${(1-cutProg)*100}%`,
                width:3, borderRadius:2,
                background:"linear-gradient(to bottom, transparent, rgba(255,255,255,.95), transparent)",
                boxShadow:"0 0 10px rgba(255,255,255,.9), 0 0 22px rgba(147,197,253,.7)",
                pointerEvents:"none", zIndex:12,
              }}/>
            )}

            {/* cut gap flash after cut */}
            {isCut && (
              <motion.div
                initial={{ opacity:1 }}
                animate={{ opacity:[1,1,0] }}
                transition={{ duration:1.2, delay:.2 }}
                style={{
                  position:"absolute", top:-2, bottom:-2,
                  left:`${cutPct}%`, width:3, borderRadius:2,
                  background:"rgba(255,255,255,.9)",
                  boxShadow:"0 0 14px rgba(255,255,255,.9)",
                  pointerEvents:"none", zIndex:11,
                }}
              />
            )}
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
              {/* chocolate text "23" */}
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{
                  fontFamily:"Georgia,serif", fontSize:28, fontWeight:"bold",
                  color:"rgba(255,255,255,.12)",
                  textShadow:"0 2px 8px rgba(0,0,0,.4)",
                  letterSpacing:4,
                }}>23</span>
              </div>
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
        </div>{/* /cake flex column */}

        {/* ══════ KNIFE ══════ */}
        {!isCut && (
          <motion.div
            style={{
              position:"absolute",
              // When idle/ready: sit to the right of top tier, vertically centered
              // When cutting: tip follows knifeX
              ...(isCutting
                ? { left: knifeX - 4, top: knifeIdleTop }
                : { right: -8, top: knifeIdleTop }),
              zIndex: 22,
              cursor: phase === "idle" ? "pointer" : phase === "ready" ? "grab" : "none",
              pointerEvents: isCutting ? "none" : "auto",
              touchAction: "none",
            }}
            animate={phase === "idle" ? { x:[0,8,0] } : {}}
            transition={phase === "idle" ? { duration:1.3, repeat:Infinity, ease:"easeInOut" } : { duration:.15 }}
            onClick={() => { if (phase === "idle") setPhase("ready"); }}
            onPointerDown={grabKnife}
            onTouchStart={grabKnife}
          >
            <KnifeSvg active={phase !== "idle"} w={phase === "idle" ? 90 : 105}/>

            {/* idle hint */}
            {phase === "idle" && (
              <motion.div animate={{ opacity:[.5,1,.5] }} transition={{ duration:1.4, repeat:Infinity }}
                style={{ position:"absolute", top:"120%", left:"50%", transform:"translateX(-50%)",
                  whiteSpace:"nowrap", fontSize:".52rem", color:"#fff", letterSpacing:".1em", textTransform:"uppercase",
                  background:"rgba(30,58,138,.8)", padding:"2px 8px", borderRadius:99, backdropFilter:"blur(4px)",
                  pointerEvents:"none" }}>
                tap me
              </motion.div>
            )}

            {/* ready glow + hint */}
            {phase === "ready" && (
              <>
                <motion.div animate={{ scale:[1,1.12,1], opacity:[.4,.85,.4] }}
                  transition={{ duration:.85, repeat:Infinity }}
                  style={{ position:"absolute", inset:-7, borderRadius:6,
                    border:"2px solid #60A5FA", boxShadow:"0 0 16px rgba(96,165,250,.6)",
                    pointerEvents:"none" }}/>
                <motion.div animate={{ x:[0,-6,0], opacity:[.5,1,.5] }}
                  transition={{ duration:.85, repeat:Infinity }}
                  style={{ position:"absolute", top:"120%", left:"50%", transform:"translateX(-50%)",
                    whiteSpace:"nowrap", fontSize:".52rem", color:"#fff", letterSpacing:".1em", textTransform:"uppercase",
                    background:"rgba(37,99,235,.85)", padding:"2px 8px", borderRadius:99, fontWeight:"bold",
                    pointerEvents:"none" }}>
                  ← drag to cut
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </div>{/* /wrapper */}

      {/* ── Status messages ── */}
      <div className="relative z-10 w-full flex flex-col items-center mt-8 min-h-[56px]">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.p key="i" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }} transition={{ delay:.5 }}
              className="font-body text-sm text-[#4A7CC9] tracking-wide text-center">
              🔪 Tap the knife to activate it
            </motion.p>
          )}
          {phase === "ready" && (
            <motion.p key="r" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              className="font-body text-sm text-[#2563EB] tracking-wide font-semibold text-center">
              Grab the knife and slide LEFT to cut!
            </motion.p>
          )}
          {isCutting && (
            <motion.p key="c" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="font-body text-sm text-[#60A5FA] tracking-wide text-center">
              Keep slicing… almost there! 🎂
            </motion.p>
          )}
          {isCut && (
            <motion.div key="d" initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:.3 }}
              className="text-center">
              <p className="font-display italic text-xl sm:text-2xl text-[#2563EB]">
                Wishing you the most beautiful year yet! 🌸
              </p>
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:.97 }}
                onClick={() => { setPhase("idle"); setCutProg(0); }}
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
