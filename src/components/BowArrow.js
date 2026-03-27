import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MAX_PULL       = 52;
const FIRE_THRESHOLD = 24;

// ── Arrow rushing toward the camera (4th-wall break) ──────────────────
function OutwardArrow({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Radial vignette — closes in as arrow approaches */}
          <motion.div
            key="vignette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed", inset: 0, zIndex: 9991, pointerEvents: "none",
              background:
                "radial-gradient(ellipse 55% 35% at 50% 8%, transparent 0%, rgba(0,0,0,0.96) 70%)",
            }}
          />
          {/* Arrow growing toward camera from top-centre */}
          <motion.div
            key="outward-arrow"
            style={{
              position: "fixed",
              top: "5%",
              left: "50%",
              x: "-50%",
              zIndex: 9992,
              pointerEvents: "none",
              originX: "50%",
              originY: "0%",
            }}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 30, opacity: [1, 1, 0] }}
            transition={{
              duration: 0.68,
              ease: [0.12, 0.05, 0.42, 1],
              times: [0, 0.65, 1],
            }}
          >
            <svg width="32" height="90" viewBox="0 0 32 90">
              <polygon points="16,0 3,24 29,24" fill="#EC4899" />
              <rect x="12" y="24" width="8" height="46" fill="#8B5E5E" rx="2" />
              <path
                d="M9 68 L-2 84 M23 68 L34 84"
                stroke="#F472B6" strokeWidth="3.5" strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── White flash that fades out, revealing the letter ──────────────────
function WhiteFlash({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="flash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          style={{
            position: "fixed", inset: 0, zIndex: 9993,
            background: "white", pointerEvents: "none",
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ── Shared bow SVG + drag interaction ────────────────────────────────
// corner=false → large, centred, full pull interaction (teaser screen)
// corner=true  → small, bottom-right, tap to fire (docked plane state)
export default function BowArrow({ onLaunch, corner = false }) {
  const [phase,  setPhase]  = useState("ready");
  const [pullY,  setPullY]  = useState(0);

  // Fire sequence shared between both modes
  const fire = (skipUpward = false) => {
    if (skipUpward) {
      // Corner tap: jump straight to outward burst
      setPhase("returning");
      setTimeout(() => setPhase("flash"),  700);
      setTimeout(() => { setPhase("done"); onLaunch(); }, 920);
    } else {
      // Full sequence: up → returns outward → flash
      setPhase("launched");
      setTimeout(() => setPhase("returning"), 560);
      setTimeout(() => setPhase("flash"),    1180);
      setTimeout(() => { setPhase("done"); onLaunch(); }, 1400);
    }
  };

  const handleDragStart = () => { if (!corner) setPhase("pulling"); };
  const handleDrag = (_, info) => {
    if (!corner) setPullY(Math.max(0, Math.min(MAX_PULL, info.offset.y)));
  };
  const handleDragEnd = (_, info) => {
    if (!corner) {
      if (info.offset.y >= FIRE_THRESHOLD) { setPullY(0); fire(false); }
      else { setPullY(0); setPhase("ready"); }
    }
  };

  if (phase === "done") return null;

  // SVG coord helpers — same viewBox in both modes, just different pixel size
  const svgW  = corner ? 130 : 200;
  const svgH  = corner ? 78  : 120;
  const cx    = corner ? 65  : 100;  // horizontal centre in viewBox pixels
  const bowY  = corner ? 48  : 72;   // bow tips Y
  const peak  = corner ? 6   : 8;    // arc peak Y
  const lTip  = corner ? 10  : 18;   // left tip X
  const rTip  = corner ? 120 : 182;  // right tip X
  const nockY = bowY + pullY;
  const tipY  = peak  + pullY;

  // Drag handle position in rendered-pixel space
  const handleTop = corner ? bowY : bowY; // both start at bowY in viewBox, same rendered px

  const hintStyle = {
    fontSize: corner ? "0.48rem" : "0.58rem",
    color: "#F9A8D4",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    background: "rgba(20,8,8,0.85)",
    border: "1px solid rgba(249,168,212,0.28)",
    padding: corner ? "2px 7px" : "3px 12px",
    borderRadius: 99,
    marginBottom: corner ? 8 : 12,
    whiteSpace: "nowrap",
    backdropFilter: "blur(6px)",
  };

  const wrapStyle = corner
    ? { position: "fixed", bottom: 18, right: 18, zIndex: 9985,
        display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none" }
    : { position: "fixed", bottom: 44, left: "50%", transform: "translateX(-50%)",
        zIndex: 9985, display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none" };

  return (
    <>
      <OutwardArrow show={phase === "returning"} />
      <WhiteFlash   show={phase === "flash"} />

      {/* Arrow flying upward (launched phase — non-corner only) */}
      <AnimatePresence>
        {phase === "launched" && !corner && (
          <motion.div
            key="flying-up"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -(window.innerHeight * 0.55), opacity: [1, 1, 0] }}
            transition={{ duration: 0.52, ease: [0.15, 0.05, 0.5, 1], times: [0, 0.7, 1] }}
            style={{
              position: "fixed", bottom: 160, left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9989, pointerEvents: "none",
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

      {/* Bow + Arrow UI */}
      <AnimatePresence>
        {(phase === "ready" || phase === "pulling") && (
          <motion.div
            key="bow-ui"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{
              type: "spring", stiffness: 220, damping: 22,
              delay: corner ? 0 : 0.6,
            }}
            style={wrapStyle}
          >
            {/* Hint label */}
            <motion.div
              animate={
                phase === "pulling"
                  ? { opacity: 0 }
                  : { opacity: [0.5, 1, 0.5] }
              }
              transition={
                phase === "pulling"
                  ? { duration: 0.15 }
                  : { duration: 2.2, repeat: Infinity }
              }
              style={hintStyle}
            >
              {corner ? "tap to fire 🏹" : "pull & release ↑"}
            </motion.div>

            {/* Bow SVG — same viewBox, different pixel size */}
            <div
              style={{ position: "relative", width: svgW, height: svgH }}
              onClick={corner ? () => fire(true) : undefined}
            >
              <svg
                width={svgW}
                height={svgH}
                viewBox={`0 0 ${svgW} ${svgH}`}
                style={{ position: "absolute", inset: 0, overflow: "visible",
                         cursor: corner ? "pointer" : "default" }}
              >
                {/* Bow arc — horizontal ∩ shape */}
                <path
                  d={`M ${lTip} ${bowY} Q ${cx} ${peak} ${rTip} ${bowY}`}
                  fill="none" stroke="#8B5E5E"
                  strokeWidth={corner ? 4 : 5.5} strokeLinecap="round"
                />
                {/* Grain */}
                <path
                  d={`M ${lTip} ${bowY} Q ${cx} ${peak} ${rTip} ${bowY}`}
                  fill="none" stroke="#C8A4A4"
                  strokeWidth={corner ? 1.2 : 1.8}
                  strokeDasharray="6 9" strokeLinecap="round" opacity="0.5"
                />
                {/* Tip caps */}
                <circle cx={lTip} cy={bowY} r={corner ? 3.5 : 5} fill="#8B5E5E" />
                <circle cx={rTip} cy={bowY} r={corner ? 3.5 : 5} fill="#8B5E5E" />

                {/* Bowstring — V when pulled */}
                <path
                  d={`M ${lTip} ${bowY} L ${cx} ${nockY} L ${rTip} ${bowY}`}
                  fill="none" stroke="#F9A8D4"
                  strokeWidth={corner ? 1.6 : 2.2} strokeLinecap="round"
                />

                {/* Arrow (vertical ↑, perpendicular to bow) */}
                <polygon points={`${cx},${tipY} ${cx-7},${tipY+15} ${cx+7},${tipY+15}`} fill="#EC4899" />
                <line
                  x1={cx} y1={tipY + 15} x2={cx} y2={nockY - 6}
                  stroke="#8B5E5E" strokeWidth={corner ? 2.2 : 3} strokeLinecap="round"
                />
                <path
                  d={`M ${cx-5} ${nockY-9} L ${cx-14} ${nockY+4} M ${cx+5} ${nockY-9} L ${cx+14} ${nockY+4}`}
                  stroke="#F472B6" strokeWidth={corner ? 1.8 : 2.4} strokeLinecap="round"
                />
                <circle cx={cx} cy={nockY} r={corner ? 4.5 : 6}
                  fill="#FDE8F0" stroke="#F472B6" strokeWidth={corner ? 1.5 : 2} />
              </svg>

              {/* Invisible drag handle — only for non-corner mode */}
              {!corner && (
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
                    left: "50%", top: handleTop,
                    transform: "translate(-50%, -50%)",
                    width: 48, height: 48,
                    cursor: phase === "pulling" ? "grabbing" : "grab",
                    touchAction: "none",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
