import { motion, AnimatePresence } from "framer-motion";

export default function TeaserCard({ active, onDone }) {
  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="teaser"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[300] flex items-center justify-center p-6"
        style={{ background: "rgba(20, 8, 8, 0.92)", backdropFilter: "blur(12px)" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1,   opacity: 1, y: 0  }}
          transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.15 }}
          className="relative max-w-sm w-full text-center flex flex-col items-center gap-6 px-4"
        >
          {/* Bouncing emoji */}
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, -8, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl select-none"
          >
            🙈
          </motion.div>

          {/* Sarcastic text */}
          <div className="flex flex-col gap-3">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display italic font-bold text-[#F8F1F1]"
              style={{ fontSize: "clamp(1.6rem, 6vw, 2.4rem)" }}
            >
              Wait, wait, wait…
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="font-body text-[#E8D5D5]/80 text-base sm:text-lg leading-relaxed"
            >
              You really thought that was it? 😏
              <br />Not quite done yet, Sneha.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="font-display italic text-[#F9A8D4] text-lg sm:text-xl"
            >
              One last surprise is waiting for you… 💌
            </motion.p>
          </div>

          {/* Bow hint — points to the bow that appears at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col items-center gap-1 mt-2"
          >
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: "1.4rem", lineHeight: 1 }}
            >
              🏹
            </motion.span>
            <span style={{
              fontSize: "0.6rem",
              color: "rgba(249,168,212,0.7)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}>
              draw the bow below
            </span>
          </motion.div>

          {/* Decorative sparkles */}
          {["✨","💫","⭐"].map((s, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
              className="absolute text-lg pointer-events-none select-none"
              style={{
                left:  i === 0 ? "8%"  : i === 1 ? "88%" : "5%",
                top:   i === 0 ? "15%" : i === 1 ? "20%" : "75%",
              }}
            >
              {s}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
