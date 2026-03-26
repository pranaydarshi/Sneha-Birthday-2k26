import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCRATCH_THRESHOLD = 0.52; // 52% scratched → auto-reveal

export default function SurpriseCard({ active, onDone }) {
  const canvasRef   = useRef(null);
  const [revealed,  setRevealed]  = useState(false);
  const [visible,   setVisible]   = useState(false);
  const isDrawing   = useRef(false);
  const doneRef     = useRef(false);

  // Show/hide card
  useEffect(() => {
    if (!active) {
      setVisible(false);
      setRevealed(false);
      doneRef.current = false;
      return;
    }
    setVisible(true);
    setRevealed(false);
    doneRef.current = false;
  }, [active]);

  // Draw scratch surface once card is visible
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const W = canvas.width, H = canvas.height;

    // Gradient scratch surface (gold → pink, like a lottery card)
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0,   "#E8C97A");
    grad.addColorStop(0.4, "#D4A857");
    grad.addColorStop(0.7, "#E8A0B0");
    grad.addColorStop(1,   "#C8707A");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Coin-texture dots
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * W, y = Math.random() * H;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // "SCRATCH HERE" text
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font      = "bold 16px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.fillText("✦  SCRATCH HERE  ✦", W / 2, H / 2 - 10);
    ctx.font      = "13px 'Georgia', serif";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText("🎁 a surprise awaits", W / 2, H / 2 + 16);
  }, [visible]);

  // Check how much has been scratched
  const checkReveal = useCallback(() => {
    if (doneRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx   = canvas.getContext("2d", { willReadFrequently: true });
    const data  = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparent++;
    }
    const pct = transparent / (canvas.width * canvas.height);
    if (pct >= SCRATCH_THRESHOLD) {
      doneRef.current = true;
      setRevealed(true);
      setTimeout(() => {
        setVisible(false);
        setTimeout(onDone, 500);
      }, 900);
    }
  }, [onDone]);

  // Scratch drawing
  const scratchAt = useCallback((x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
    checkReveal();
  }, [checkReveal]);

  const getXY = (e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const src    = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top)  * scaleY,
    };
  };

  const onMouseDown  = (e) => { isDrawing.current = true;  scratchAt(...Object.values(getXY(e))); };
  const onMouseMove  = (e) => { if (!isDrawing.current) return; scratchAt(...Object.values(getXY(e))); };
  const onMouseUp    = ()  => { isDrawing.current = false; };
  const onTouchStart = (e) => { e.preventDefault(); isDrawing.current = true;  scratchAt(...Object.values(getXY(e))); };
  const onTouchMove  = (e) => { e.preventDefault(); if (!isDrawing.current) return; scratchAt(...Object.values(getXY(e))); };
  const onTouchEnd   = ()  => { isDrawing.current = false; };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="scratch-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[400] flex items-center justify-center px-5"
          style={{ background: "rgba(20,8,8,0.88)", backdropFilter: "blur(12px)" }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 40, opacity: 0 }}
            animate={{ scale: 1,   y: 0,  opacity: 1 }}
            exit={{   scale: 0.9,  y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="flex flex-col items-center gap-4 text-center"
            style={{ width: "100%", maxWidth: 340 }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="font-body text-xs uppercase tracking-[0.3em] text-[#E8D5D5]/60 mb-1">
                A surprise for you
              </p>
              <h3
                className="font-display italic font-bold text-[#F8F1F1]"
                style={{ fontSize: "clamp(1.2rem, 5vw, 1.6rem)" }}
              >
                {revealed ? "🎬 Enjoy your story!" : "Scratch to reveal 🎁"}
              </h3>
            </motion.div>

            {/* Scratch card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, type: "spring", stiffness: 200 }}
              className="relative rounded-2xl overflow-hidden"
              style={{
                width: "100%", height: 180,
                boxShadow: "0 8px 40px rgba(200,120,140,0.35), 0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {/* Reveal layer — shown underneath */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                style={{
                  background: "linear-gradient(135deg, #FDE8F0, #F7CAC9)",
                }}
              >
                <motion.span
                  animate={revealed ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.6 }}
                  className="text-5xl"
                >
                  🎬
                </motion.span>
                <p className="font-display italic font-bold text-[#4A2A2A] text-lg">
                  Your story awaits!
                </p>
                <p className="font-body text-xs text-[#8B5E5E]/80 tracking-wide uppercase">
                  20 photos · just for you
                </p>
              </div>

              {/* Scratch canvas — sits on top */}
              {!revealed && (
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={360}
                  className="absolute inset-0 w-full h-full"
                  style={{ cursor: "crosshair", touchAction: "none" }}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                />
              )}

              {/* Revealed sparkle overlay */}
              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none flex items-center justify-center"
                  >
                    {["✨","🌟","💖","⭐","🎉"].map((s, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="absolute text-xl pointer-events-none"
                        style={{
                          left: `${15 + i * 18}%`,
                          top:  i % 2 === 0 ? "20%" : "65%",
                        }}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Hint */}
            {!revealed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="font-body text-[0.7rem] text-[#E8D5D5]/40 tracking-widest uppercase"
              >
                Use your finger to scratch ✦
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
