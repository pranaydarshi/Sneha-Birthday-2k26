import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BURST_EMOJIS = ["🎂","🫂","✨","🎉","🌸","🌟","⭐","🎊","🤝","🎈"];

function CakeBurst({ active }) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (!active) { setParticles([]); return; }
    setParticles(
      Array.from({ length: 36 }, (_, i) => ({
        id:    i,
        symbol: BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)],
        angle:  (i / 36) * 360 + Math.random() * 10,
        dist:   90 + Math.random() * 150,
        size:   1.2 + Math.random() * 1,
        delay:  Math.random() * 0.18,
        dur:    0.7 + Math.random() * 0.5,
      }))
    );
    const t = setTimeout(() => setParticles([]), 2000);
    return () => clearTimeout(t);
  }, [active]);
  if (!particles.length) return null;
  return (
    <>
      <style>{`@keyframes cakeBurst{0%{opacity:1;transform:translate(0,0) scale(0.4)}60%{opacity:1}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(1)}}`}</style>
      {particles.map(p => {
        const rad = (p.angle * Math.PI) / 180;
        return (
          <span key={p.id} style={{
            position:"absolute", top:"42%", left:"50%",
            fontSize:`${p.size}rem`, lineHeight:1, pointerEvents:"none",
            willChange:"transform,opacity",
            "--tx":`${Math.cos(rad)*p.dist}px`,
            "--ty":`${Math.sin(rad)*p.dist - 50}px`,
            animation:`cakeBurst ${p.dur}s ease-out ${p.delay}s both`,
          }}>{p.symbol}</span>
        );
      })}
    </>
  );
}

// ── Realistic CSS Cake ────────────────────────────────────────
function CssCandle({ lit, showSmoke, index }) {
  const colors = [
    { body:"#FFB347", stripe:"#FF8C00" },
    { body:"#87CEEB", stripe:"#4682B4" },
    { body:"#98FB98", stripe:"#3CB371" },
  ];
  const c = colors[index % colors.length];
  return (
    <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center" }}>
      {/* Smoke */}
      <AnimatePresence>
        {showSmoke && (
          <>
            {[0,1,2].map(i => (
              <motion.div key={i}
                initial={{ opacity:0.9, y:0, x:0, scale:0.3 }}
                animate={{ opacity:0, y:-40, x:(i-1)*8, scale:1.8 }}
                transition={{ duration:1.4+i*0.2, ease:"easeOut", delay:i*0.1 }}
                style={{
                  position:"absolute", bottom:"100%", left:"50%",
                  width:8, height:8, borderRadius:"50%",
                  background:"rgba(180,180,180,0.7)",
                  filter:"blur(3px)", pointerEvents:"none",
                  marginLeft:-4,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Flame */}
      <AnimatePresence>
        {lit && (
          <motion.div
            initial={{ scaleY:0, opacity:0 }}
            animate={{ scaleY:1, opacity:1 }}
            exit={{ scaleY:0, opacity:0 }}
            transition={{ duration:0.3 }}
            style={{ position:"relative", marginBottom:2 }}
          >
            {/* Outer glow */}
            <motion.div
              animate={{ scale:[1,1.3,1], opacity:[0.4,0.7,0.4] }}
              transition={{ duration:0.8, repeat:Infinity }}
              style={{
                position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)",
                width:18, height:22, borderRadius:"50%",
                background:"rgba(252,211,77,0.35)", filter:"blur(6px)",
              }}
            />
            {/* Inner flame */}
            <motion.div
              animate={{ y:[0,-3,0], scaleX:[1,1.2,0.85,1], scaleY:[1,0.95,1.05,1] }}
              transition={{ duration:0.55, repeat:Infinity, ease:"easeInOut" }}
              style={{
                width:10, height:18, borderRadius:"50% 50% 40% 40%",
                background:"linear-gradient(to top, #EF4444 0%, #F97316 35%, #FCD34D 70%, #FEF3C7 100%)",
                filter:"blur(0.4px)",
                transformOrigin:"bottom center",
                position:"relative", zIndex:1,
              }}
            />
            {/* Core white */}
            <motion.div
              animate={{ y:[0,-2,0] }}
              transition={{ duration:0.55, repeat:Infinity }}
              style={{
                position:"absolute", bottom:4, left:"50%", transform:"translateX(-50%)",
                width:4, height:7, borderRadius:"50% 50% 40% 40%",
                background:"rgba(255,255,255,0.9)", filter:"blur(0.5px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wax drip */}
      <div style={{
        position:"absolute", top:lit ? 28 : 0, left:"50%", marginLeft:-2,
        width:4, height:6, background:c.body,
        borderRadius:"0 0 4px 4px", opacity:0.8,
      }}/>

      {/* Candle body with stripes */}
      <div style={{
        width:14, height:52, borderRadius:"4px 4px 2px 2px",
        background:`linear-gradient(135deg, ${c.body} 0%, ${c.stripe} 100%)`,
        boxShadow:`inset -3px 0 6px rgba(0,0,0,0.15), inset 2px 0 4px rgba(255,255,255,0.3)`,
        position:"relative", overflow:"hidden",
      }}>
        {/* Stripe rings */}
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position:"absolute", left:0, right:0,
            top:`${15 + i*20}%`, height:3,
            background:"rgba(255,255,255,0.25)",
            transform:"rotate(-8deg) scaleX(1.2)",
          }}/>
        ))}
        {/* Shine */}
        <div style={{
          position:"absolute", top:0, left:2, width:3, bottom:0,
          background:"linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.1))",
          borderRadius:2,
        }}/>
      </div>

      {/* Candle base */}
      <div style={{
        width:18, height:5, borderRadius:"0 0 4px 4px",
        background:`linear-gradient(135deg, ${c.stripe} 0%, ${c.body} 100%)`,
        marginTop:-1,
      }}/>
    </div>
  );
}

function CssCake({ state, showSmoke }) {
  const isLit = state === "idle";
  const isCut = state === "cut";

  return (
    <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <style>{`
        @keyframes plateShimmer {
          0%,100% { box-shadow: 0 8px 32px rgba(37,99,235,0.18), 0 2px 8px rgba(0,0,0,0.08); }
          50%      { box-shadow: 0 8px 40px rgba(37,99,235,0.28), 0 2px 12px rgba(0,0,0,0.1); }
        }
        @keyframes frostingDrip {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(3px); }
        }
        @keyframes sprinkleWiggle {
          0%,100% { transform: rotate(var(--r)); }
          50%     { transform: rotate(calc(var(--r) + 15deg)); }
        }
      `}</style>

      {/* Candles on top */}
      <div style={{
        display:"flex", gap:16, alignItems:"flex-end",
        marginBottom: -2, position:"relative", zIndex:10,
      }}>
        {[0,1,2].map(i => (
          <CssCandle key={i} lit={isLit} showSmoke={showSmoke} index={i} />
        ))}
      </div>

      {/* ── Top tier ── */}
      <div style={{ position:"relative", zIndex:9 }}>
        {/* Frosting drips on top tier */}
        <div style={{
          position:"absolute", top:-8, left:0, right:0,
          display:"flex", justifyContent:"space-around", zIndex:10,
        }}>
          {[0,1,2,3,4,5,6].map(i => (
            <motion.div key={i}
              animate={{ y:[0,2,0] }}
              transition={{ duration:2+i*0.3, repeat:Infinity, delay:i*0.2 }}
              style={{
                width:12+Math.sin(i)*4, height:18+i%3*4,
                background:"white",
                borderRadius:"0 0 50% 50%",
                opacity:0.95,
                boxShadow:"0 2px 4px rgba(0,0,0,0.06)",
              }}
            />
          ))}
        </div>

        {/* Top tier body */}
        <div style={{
          width:160, height:70,
          background:"linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)",
          borderRadius:8,
          boxShadow:"inset -8px 0 16px rgba(0,0,0,0.08), inset 4px 0 8px rgba(255,255,255,0.5)",
          position:"relative", overflow:"hidden",
          border:"2px solid rgba(255,255,255,0.7)",
        }}>
          {/* Shine */}
          <div style={{
            position:"absolute", top:0, left:8, width:16, bottom:0,
            background:"linear-gradient(to bottom, rgba(255,255,255,0.45), rgba(255,255,255,0.1))",
            borderRadius:4,
          }}/>
          {/* "23" text */}
          <div style={{
            position:"absolute", inset:0, display:"flex",
            alignItems:"center", justifyContent:"center",
          }}>
            <span style={{
              fontFamily:"Georgia, serif", fontSize:30, fontWeight:"bold",
              color:"white",
              textShadow:"0 2px 8px rgba(37,99,235,0.5), 0 0 20px rgba(255,255,255,0.4)",
              letterSpacing:4,
            }}>23</span>
          </div>
          {/* Dot decorations */}
          {[20,45,68,90,115,138].map((x,i) => (
            <div key={i} style={{
              position:"absolute", bottom:10, left:x,
              width:6, height:6, borderRadius:"50%",
              background:["#FCD34D","#FB923C","#F472B6","#A78BFA","#34D399","#60A5FA"][i],
              boxShadow:`0 0 6px ${["#FCD34D","#FB923C","#F472B6","#A78BFA","#34D399","#60A5FA"][i]}`,
            }}/>
          ))}
        </div>

        {/* Top tier frosting base */}
        <div style={{
          height:12, background:"white",
          borderRadius:"0 0 6px 6px",
          boxShadow:"0 4px 8px rgba(0,0,0,0.06)",
          border:"1.5px solid rgba(255,255,255,0.8)",
          borderTop:"none",
        }}/>
      </div>

      {/* ── Middle tier ── */}
      <div style={{ position:"relative", zIndex:8, marginTop:-2 }}>
        {/* Frosting drips */}
        <div style={{
          position:"absolute", top:-10, left:0, right:0,
          display:"flex", justifyContent:"space-around", zIndex:10,
        }}>
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <motion.div key={i}
              animate={{ y:[0,3,0] }}
              transition={{ duration:2.5+i*0.25, repeat:Infinity, delay:i*0.15 }}
              style={{
                width:14+Math.cos(i)*3, height:20+i%4*5,
                background:"white", borderRadius:"0 0 50% 50%",
                opacity:0.92,
                boxShadow:"0 3px 6px rgba(0,0,0,0.06)",
              }}
            />
          ))}
        </div>

        {/* Middle tier body */}
        <div style={{
          width:220, height:80,
          background:"linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)",
          borderRadius:6,
          boxShadow:"inset -10px 0 20px rgba(0,0,0,0.07), inset 5px 0 10px rgba(255,255,255,0.5)",
          position:"relative", overflow:"hidden",
          border:"2px solid rgba(255,255,255,0.75)",
        }}>
          {/* Shine */}
          <div style={{
            position:"absolute", top:0, left:10, width:18, bottom:0,
            background:"linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.08))",
            borderRadius:4,
          }}/>
          {/* Sprinkles */}
          {[
            {x:28, y:22, r:30, c:"#FCD34D"},
            {x:55, y:55, r:-20, c:"#F472B6"},
            {x:80, y:28, r:45, c:"#34D399"},
            {x:110, y:50, r:-35, c:"#A78BFA"},
            {x:145, y:20, r:15, c:"#FB923C"},
            {x:170, y:58, r:-45, c:"#60A5FA"},
            {x:195, y:35, r:60, c:"#FCD34D"},
            {x:42, y:40, r:-15, c:"#34D399"},
            {x:130, y:40, r:25, c:"#F472B6"},
          ].map((s,i) => (
            <motion.div key={i}
              animate={{ rotate:[s.r, s.r+10, s.r] }}
              transition={{ duration:2+i*0.4, repeat:Infinity }}
              style={{
                position:"absolute", left:s.x, top:s.y,
                width:14, height:4, borderRadius:2,
                background:s.c, opacity:0.85,
                transform:`rotate(${s.r}deg)`,
                boxShadow:`0 0 4px ${s.c}`,
              }}
            />
          ))}
          {/* Rosette decorations */}
          {[40, 110, 180].map((x,i) => (
            <div key={i} style={{
              position:"absolute", bottom:8, left:x,
              width:20, height:20,
            }}>
              {[0,45,90,135,180,225,270,315].map(angle => (
                <div key={angle} style={{
                  position:"absolute", top:"50%", left:"50%",
                  width:7, height:7, borderRadius:"50%",
                  background:["#FCD34D","#F472B6","#60A5FA"][i],
                  opacity:0.8,
                  transform:`rotate(${angle}deg) translateX(6px) translateY(-50%)`,
                  boxShadow:`0 0 4px ${["#FCD34D","#F472B6","#60A5FA"][i]}`,
                }}/>
              ))}
              <div style={{
                position:"absolute", top:"50%", left:"50%",
                width:6, height:6, borderRadius:"50%",
                background:"white", transform:"translate(-50%,-50%)",
              }}/>
            </div>
          ))}
        </div>

        {/* Middle tier frosting base */}
        <div style={{
          height:14, background:"white",
          borderRadius:"0 0 6px 6px",
          boxShadow:"0 4px 10px rgba(0,0,0,0.07)",
          border:"1.5px solid rgba(255,255,255,0.85)",
          borderTop:"none",
        }}/>
      </div>

      {/* ── Bottom tier ── */}
      <div style={{ position:"relative", zIndex:7, marginTop:-2 }}>
        {/* Frosting drips */}
        <div style={{
          position:"absolute", top:-10, left:0, right:0,
          display:"flex", justifyContent:"space-around", zIndex:10,
        }}>
          {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
            <motion.div key={i}
              animate={{ y:[0,4,0] }}
              transition={{ duration:3+i*0.2, repeat:Infinity, delay:i*0.12 }}
              style={{
                width:16+Math.sin(i)*4, height:22+i%5*5,
                background:"white", borderRadius:"0 0 50% 50%",
                opacity:0.9,
                boxShadow:"0 4px 8px rgba(0,0,0,0.05)",
              }}
            />
          ))}
        </div>

        {/* Bottom tier body */}
        <div style={{
          width:290, height:95,
          background:"linear-gradient(135deg, #1D4ED8 0%, #2563EB 40%, #3B82F6 70%, #60A5FA 100%)",
          borderRadius:6,
          boxShadow:"inset -14px 0 28px rgba(0,0,0,0.15), inset 7px 0 14px rgba(255,255,255,0.2)",
          position:"relative", overflow:"hidden",
          border:"2px solid rgba(255,255,255,0.5)",
        }}>
          {/* Shine */}
          <div style={{
            position:"absolute", top:0, left:12, width:22, bottom:0,
            background:"linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.05))",
            borderRadius:4,
          }}/>
          {/* Large sprinkles */}
          {[
            {x:18, y:25, r:40, c:"#FCD34D", w:18},
            {x:50, y:60, r:-25, c:"#F9A8D4", w:16},
            {x:90, y:30, r:55, c:"#86EFAC", w:20},
            {x:130, y:65, r:-40, c:"#FCD34D", w:16},
            {x:165, y:20, r:20, c:"#F9A8D4", w:18},
            {x:200, y:55, r:-30, c:"#A5F3FC", w:16},
            {x:240, y:28, r:65, c:"#86EFAC", w:20},
            {x:270, y:60, r:-15, c:"#FCD34D", w:16},
            {x:35, y:48, r:30, c:"#A5F3FC", w:14},
            {x:110, y:48, r:-50, c:"#86EFAC", w:16},
            {x:218, y:42, r:35, c:"#F9A8D4", w:14},
          ].map((s,i) => (
            <motion.div key={i}
              animate={{ rotate:[s.r, s.r+8, s.r] }}
              transition={{ duration:2.5+i*0.3, repeat:Infinity }}
              style={{
                position:"absolute", left:s.x, top:s.y,
                width:s.w, height:5, borderRadius:3,
                background:s.c, opacity:0.9,
                transform:`rotate(${s.r}deg)`,
                boxShadow:`0 0 6px ${s.c}80`,
              }}
            />
          ))}
          {/* Dots */}
          {[20,60,100,145,185,225,265].map((x,i) => (
            <div key={i} style={{
              position:"absolute", top:12, left:x,
              width:8, height:8, borderRadius:"50%",
              background:["#FCD34D","#F9A8D4","#86EFAC","#A5F3FC","#FCD34D","#F9A8D4","#86EFAC"][i],
              boxShadow:`0 0 8px ${["#FCD34D","#F9A8D4","#86EFAC","#A5F3FC","#FCD34D","#F9A8D4","#86EFAC"][i]}`,
            }}/>
          ))}
          {/* Stars / hearts row at bottom */}
          <div style={{
            position:"absolute", bottom:10, left:0, right:0,
            display:"flex", justifyContent:"space-around", paddingInline:12,
          }}>
            {["⭐","✨","🌟","⭐","✨","🌟","⭐"].map((s,i) => (
              <span key={i} style={{ fontSize:12, opacity:0.7 }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Bottom tier frosting base */}
        <div style={{
          height:16, background:"white",
          borderRadius:"0 0 6px 6px",
          boxShadow:"0 6px 14px rgba(0,0,0,0.08)",
          border:"1.5px solid rgba(255,255,255,0.9)",
          borderTop:"none",
        }}/>
      </div>

      {/* ── Plate ── */}
      <div style={{
        width:320, height:18,
        background:"linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 50%, #CBD5E1 100%)",
        borderRadius:"0 0 50% 50% / 0 0 100% 100%",
        boxShadow:"0 8px 24px rgba(37,99,235,0.12), 0 2px 8px rgba(0,0,0,0.08)",
        animation:"plateShimmer 3s ease-in-out infinite",
        border:"1.5px solid rgba(255,255,255,0.85)",
      }}/>

      {/* Cut slice effect */}
      <AnimatePresence>
        {isCut && (
          <motion.div
            initial={{ opacity:0, x:20, rotate:5 }}
            animate={{ opacity:1, x:48, rotate:12 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
            style={{
              position:"absolute", bottom:18, right:-20,
              width:52, height:88,
              background:"linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)",
              borderRadius:"4px 50% 4px 4px",
              boxShadow:"4px 8px 20px rgba(37,99,235,0.3)",
              border:"1.5px solid rgba(255,255,255,0.5)",
              overflow:"hidden",
            }}
          >
            {/* slice frosting top */}
            <div style={{
              position:"absolute", top:0, left:0, right:0, height:14,
              background:"white", borderRadius:"4px 50% 0 0",
            }}/>
            {/* slice inner layers */}
            <div style={{
              position:"absolute", top:14, left:0, right:0, height:4,
              background:"rgba(255,255,255,0.3)",
            }}/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flame glow ambient on plate */}
      {isLit && (
        <motion.div
          animate={{ opacity:[0.2, 0.45, 0.2] }}
          transition={{ duration:1.2, repeat:Infinity }}
          style={{
            position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
            width:120, height:120,
            background:"radial-gradient(circle, rgba(252,211,77,0.35) 0%, transparent 70%)",
            borderRadius:"50%", pointerEvents:"none",
          }}
        />
      )}
    </div>
  );
}

export default function BirthdayCake({ onCelebrate }) {
  const [state,     setState]     = useState("idle");
  const [showSmoke, setShowSmoke] = useState(false);

  const blowCandles = () => {
    if (state !== "idle") return;
    setState("blowing");
    setShowSmoke(true);
    setTimeout(() => setShowSmoke(false), 1600);
    setTimeout(() => {
      setState("cut");
      if (onCelebrate) onCelebrate();
    }, 1800);
  };

  return (
    <section
      className="relative py-16 flex flex-col items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #EDF4FF 0%, #E8F0FD 50%, #EDF4FF 100%)" }}
    >
      <CakeBurst active={state === "cut"} />

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
          {state === "cut" ? "Happy Birthday, Sneha! 🎉" : "Blow out the candles 🕯️"}
        </h2>
      </motion.div>

      {/* CSS Cake */}
      <motion.div
        className="relative z-10 cursor-pointer select-none"
        onClick={blowCandles}
        whileHover={state === "idle" ? { scale:1.02 } : {}}
        title="Tap to blow out the candles!"
        animate={state === "cut" ? { y:[0,-8,0] } : {}}
        transition={state === "cut" ? { duration:0.5 } : {}}
      >
        <CssCake state={state} showSmoke={showSmoke} />
      </motion.div>

      {/* CTA messages */}
      <div className="relative z-10 w-full flex flex-col items-center mt-8">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.p
              key="idle"
              initial={{ opacity:0, y:8 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }}
              transition={{ delay:0.5 }}
              className="font-body text-sm text-[#4A7CC9] tracking-wide"
            >
              👆 Tap the cake to blow out the candles
            </motion.p>
          )}
          {state === "blowing" && (
            <motion.p
              key="blowing"
              initial={{ opacity:0, scale:0.8 }}
              animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0 }}
              className="font-display italic text-2xl text-[#2563EB]"
            >
              Whoooosh! 💨
            </motion.p>
          )}
          {state === "cut" && (
            <motion.div
              key="cut"
              initial={{ opacity:0, y:16 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.4 }}
              className="text-center"
            >
              <p className="font-display italic text-xl sm:text-2xl text-[#2563EB]">
                Wishing you the most beautiful year yet! 🌸
              </p>
              <motion.button
                whileHover={{ scale:1.04 }}
                whileTap={{ scale:0.97 }}
                onClick={(e) => { e.stopPropagation(); setState("idle"); }}
                className="mt-4 px-5 py-2 rounded-full border border-[#60A5FA] text-[#2563EB]
                           font-body text-sm hover:bg-[#E8F0FD] transition"
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
