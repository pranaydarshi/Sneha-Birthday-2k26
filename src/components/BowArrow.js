import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Crack paths radiating from top-centre impact point ──────────────
const CRACKS = [
  { d: "M200 52 L172 210 L142 400 L108 620",  w: 3.0, o: 0.95, delay: 0.00 },
  { d: "M200 52 L228 215 L262 408 L298 628",  w: 2.6, o: 0.90, delay: 0.02 },
  { d: "M200 52 L155 172 L88 268 L28 345",    w: 2.4, o: 0.85, delay: 0.04 },
  { d: "M200 52 L245 168 L318 252 L390 322",  w: 2.4, o: 0.85, delay: 0.04 },
  { d: "M200 52 L186 295 L158 528 L128 762",  w: 1.9, o: 0.75, delay: 0.06 },
  { d: "M200 52 L214 290 L244 520 L274 755",  w: 1.9, o: 0.75, delay: 0.06 },
  { d: "M200 52 L128 145 L55 188 L2 222",     w: 1.7, o: 0.65, delay: 0.08 },
  { d: "M200 52 L272 140 L348 182 L400 215",  w: 1.7, o: 0.65, delay: 0.08 },
  { d: "M155 172 L245 168",                   w: 1.0, o: 0.42, delay: 0.10 },
  { d: "M142 400 L262 408",                   w: 1.0, o: 0.38, delay: 0.12 },
  { d: "M88  268 L318 252",                   w: 0.8, o: 0.32, delay: 0.14 },
  { d: "M108 620 L298 628",                   w: 0.8, o: 0.28, delay: 0.16 },
];

function ScreenCrack({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="crack-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ position: "fixed", inset: 0, zIndex: 9990, pointerEvents: "none" }}
        >
          {/* White flash */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, background: "white" }}
          />
          {/* Dark tint */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)" }} />
          {/* Cracks */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            viewBox="0 0 400 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <circle cx="200" cy="52" r="32" fill="white" opacity="0.15" />
            <circle cx="200" cy="52" r="16" fill="white" opacity="0.45" />
            <circle cx="200" cy="52" r="7"  fill="white" opacity="0.95" />
            {CRACKS.map(({ d, w, o, delay }, i) => (
              <motion.path
                key={i}
                d={d}
                fill="none"
                stroke="white"
                strokeWidth={w}
                strokeLinecap="round"
                opacity={o}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.22, ease: "easeOut", delay }}
              />
            ))}
          </svg>
          {/* Screen shake */}
          <motion.div
            animate={{
              x: [0, -11, 11, -8, 8, -5, 5, -2, 2, 0],
              y: [0,  -6,  6, -4, 4, -2, 2,  0, 0, 0],
            }}
            transition={{ duration: 0.52, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const MAX_PULL       = 52;
const FIRE_THRESHOLD = 24;

export default function BowArrow({ onLaunch }) {
  const [phase,  setPhase]  = useState("ready");
  const [pullY,  setPullY]  = useState(0);

  // Arrow position in SVG — nock sits at string centre (y=72), tip above it
  const nockY = 72 + pullY;
  const tipY  = 6  + pullY;

  const handleDragStart = () => setPhase("pulling");

  const handleDrag = (_, info) => {
    setPullY(Math.max(0, Math.min(MAX_PULL, info.offset.y)));
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.y >= FIRE_THRESHOLD) {
      setPullY(0);
      setPhase("launched");
      setTimeout(() => setPhase("cracked"), 620);
      setTimeout(() => { setPhase("done"); onLaunch(); }, 2700);
    } else {
      setPullY(0);
      setPhase("ready");
    }
  };

  if (phase === "done") return null;

  return (
    <>
      <ScreenCrack show={phase === "cracked"} />

      {/* ── Arrow flying up after launch ── */}
      <AnimatePresence>
        {phase === "launched" && (
          <motion.div
            key="flying-arrow"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -(window.innerHeight + 200), opacity: 1 }}
            transition={{ duration: 0.58, ease: [0.15, 0.05, 0.35, 1] }}
            style={{
              position: "fixed",
              bottom: 160,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9989,
              pointerEvents: "none",
            }}
          >
            <svg width="20" height="70" viewBox="0 0 20 70">
              <polygon points="10,0 2,18 18,18" fill="#EC4899" />
              <rect x="8" y="18" width="4" height="36" fill="#8B5E5E" rx="1" />
              <path d="M6 52 L-2 66 M14 52 L22 66" stroke="#F472B6" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bow + Arrow UI ── */}
      <AnimatePresence>
        {(phase === "ready" || phase === "pulling") && (
          <motion.div
            key="bow-ui"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.6 }}
            style={{
              position: "fixed",
              bottom: 44,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9985,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            {/* Hint */}
            <motion.div
              animate={phase === "pulling"
                ? { opacity: 0 }
                : { opacity: [0.5, 1, 0.5] }
              }
              transition={phase === "pulling"
                ? { duration: 0.15 }
                : { duration: 2.2, repeat: Infinity }
              }
              style={{
                fontSize: "0.58rem",
                color: "#F9A8D4",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: "rgba(20,8,8,0.85)",
                border: "1px solid rgba(249,168,212,0.3)",
                padding: "3px 12px",
                borderRadius: 99,
                marginBottom: 12,
                whiteSpace: "nowrap",
                backdropFilter: "blur(6px)",
              }}
            >
              pull &amp; release ↑
            </motion.div>

            {/* ── Bow SVG (horizontal ∩, arrow vertical ↑) ── */}
            <div style={{ position: "relative", width: 200, height: 120 }}>
              <svg
                width="200"
                height="120"
                viewBox="0 0 200 120"
                style={{ position: "absolute", inset: 0, overflow: "visible" }}
              >
                {/* Bow arc — horizontal ∩ shape */}
                <path
                  d="M 18 72 Q 100 8 182 72"
                  fill="none"
                  stroke="#8B5E5E"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
                {/* Bow grain highlight */}
                <path
                  d="M 18 72 Q 100 8 182 72"
                  fill="none"
                  stroke="#C8A4A4"
                  strokeWidth="1.8"
                  strokeDasharray="6 9"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                {/* Bow tip caps */}
                <circle cx="18"  cy="72" r="5" fill="#8B5E5E" />
                <circle cx="182" cy="72" r="5" fill="#8B5E5E" />

                {/* Bowstring — straight when at rest, V-down when pulled */}
                <path
                  d={`M 18 72 L 100 ${nockY} L 182 72`}
                  fill="none"
                  stroke="#F9A8D4"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />

                {/* ── Arrow (vertical ↑, perpendicular to bow) ── */}
                {/* Arrowhead — pink triangle */}
                <polygon
                  points={`100,${tipY} 92,${tipY + 17} 108,${tipY + 17}`}
                  fill="#EC4899"
                />
                {/* Shaft */}
                <line
                  x1="100" y1={tipY + 17}
                  x2="100" y2={nockY - 7}
                  stroke="#8B5E5E"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Fletching — two wings angled out from nock */}
                <path
                  d={`M 95 ${nockY - 9} L 82 ${nockY + 6} M 105 ${nockY - 9} L 118 ${nockY + 6}`}
                  stroke="#F472B6"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                {/* Nock indicator */}
                <circle
                  cx="100" cy={nockY}
                  r="6"
                  fill="#FDE8F0"
                  stroke="#F472B6"
                  strokeWidth="2"
                />
              </svg>

              {/* Invisible drag handle — sits over the nock */}
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: MAX_PULL }}
                dragElastic={0.06}
                dragMomentum={false}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 72,
                  transform: "translate(-50%, -50%)",
                  width: 48,
                  height: 48,
                  cursor: phase === "pulling" ? "grabbing" : "grab",
                  touchAction: "none",
                  borderRadius: "50%",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
