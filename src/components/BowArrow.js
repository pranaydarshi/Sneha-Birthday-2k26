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
  // Spider-web connectors
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
          {/* White flash — fades quickly */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, background: "white" }}
          />

          {/* Dark tint so cracks are visible */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)" }} />

          {/* Crack SVG */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            viewBox="0 0 400 800"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Impact glow */}
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

          {/* Screen shake — applied to the whole overlay */}
          <motion.div
            animate={{
              x: [0, -11, 11, -8,  8, -5, 5, -2, 2, 0],
              y: [0,  -6,  6, -4,  4, -2, 2,  0, 0, 0],
            }}
            transition={{ duration: 0.52, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Constants ────────────────────────────────────────────────────────
const MAX_PULL       = 68;   // px — max bow draw distance
const FIRE_THRESHOLD = 30;   // px — minimum pull to actually fire

export default function BowArrow({ onLaunch }) {
  const [phase,  setPhase]  = useState("ready"); // ready | pulling | launched | cracked | done
  const [pullY,  setPullY]  = useState(0);

  // Derived: string bends horizontally as arrow is pulled down
  const tension  = Math.min(pullY / MAX_PULL, 1);
  const strBendX = 40 + tension * 24; // string midpoint X moves right

  const handleDrag = (_, info) => {
    setPullY(Math.max(0, Math.min(MAX_PULL, info.offset.y)));
  };

  const handleDragStart = () => setPhase("pulling");

  const handleDragEnd = (_, info) => {
    const pulled = info.offset.y;
    if (pulled >= FIRE_THRESHOLD) {
      setPullY(0);
      setPhase("launched");
      setTimeout(() => setPhase("cracked"), 660);
      setTimeout(() => { setPhase("done"); onLaunch(); }, 2750);
    } else {
      // Snap back — not enough pull
      setPullY(0);
      setPhase("ready");
    }
  };

  if (phase === "done") return null;

  return (
    <>
      {/* ── Screen crack ── */}
      <ScreenCrack show={phase === "cracked"} />

      {/* ── Arrow flying up (after launch, before crack) ── */}
      <AnimatePresence>
        {phase === "launched" && (
          <motion.div
            key="flying-arrow"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: -(window.innerHeight + 120) }}
            transition={{ duration: 0.62, ease: [0.18, 0.04, 0.38, 1] }}
            style={{
              position: "fixed",
              bottom: 148,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9989,
              pointerEvents: "none",
            }}
          >
            <svg width="20" height="68" viewBox="0 0 20 68">
              <polygon points="10,0 2,18 18,18" fill="#EC4899" />
              <rect x="8" y="18" width="4" height="34" fill="#8B5E5E" rx="1" />
              <path d="M6 50 L-2 64 M14 50 L22 64" stroke="#F472B6" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bow + Arrow UI ── */}
      <AnimatePresence>
        {(phase === "ready" || phase === "pulling") && (
          <motion.div
            key="bow-ui"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 10 }}
            transition={{ type: "spring", stiffness: 230, damping: 20 }}
            style={{
              position: "fixed",
              bottom: 48,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 150,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            {/* Hint label — fades when pulling */}
            <motion.div
              animate={phase === "pulling" ? { opacity: 0 } : { opacity: [0.55, 1, 0.55] }}
              transition={phase === "pulling" ? { duration: 0.15 } : { duration: 2.2, repeat: Infinity }}
              style={{
                fontSize: "0.58rem",
                color: "#C8848C",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: "rgba(255,240,245,0.92)",
                padding: "3px 11px",
                borderRadius: 99,
                marginBottom: 14,
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(200,130,140,0.22)",
                backdropFilter: "blur(4px)",
              }}
            >
              pull &amp; release ↑
            </motion.div>

            {/* Bow + Arrow SVG */}
            <div style={{ position: "relative", width: 80, height: 178 }}>
              <svg
                width="80"
                height="178"
                viewBox="0 0 80 178"
                style={{ position: "absolute", inset: 0, overflow: "visible" }}
              >
                {/* Bow arc */}
                <path
                  d="M40 8 Q76 89 40 170"
                  fill="none"
                  stroke="#8B5E5E"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Bow grain highlight */}
                <path
                  d="M40 8 Q76 89 40 170"
                  fill="none"
                  stroke="#C8A4A4"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.45"
                  strokeDasharray="5 7"
                />

                {/* Bowstring — bends as arrow is pulled */}
                <path
                  d={`M40 8 Q${strBendX} 89 40 170`}
                  fill="none"
                  stroke="#F9A8D4"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Arrow group — slides down with pull */}
                <g transform={`translate(0, ${pullY})`}>
                  {/* Arrowhead */}
                  <polygon points="40,6 33,22 47,22" fill="#EC4899" />
                  {/* Shaft */}
                  <line
                    x1="40" y1="22" x2="40" y2="96"
                    stroke="#8B5E5E" strokeWidth="2.8" strokeLinecap="round"
                  />
                  {/* Fletching */}
                  <path
                    d="M36 88 L27 101 M44 88 L53 101"
                    stroke="#F472B6" strokeWidth="2.2" strokeLinecap="round"
                  />
                  {/* Nock indicator */}
                  <circle cx="40" cy="99" r="6" fill="#FDE8F0" stroke="#F472B6" strokeWidth="2" />
                </g>
              </svg>

              {/* Invisible drag handle — sits at the nock */}
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
                  top: 99,
                  transform: "translate(-50%, -50%)",
                  width: 44,
                  height: 44,
                  cursor: phase === "pulling" ? "grabbing" : "grab",
                  touchAction: "none",
                  borderRadius: "50%",
                  // Uncomment to debug: background: "rgba(255,0,0,0.2)",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
