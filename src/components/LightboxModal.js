import { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LightboxModal({ photos, index, onClose, onPrev, onNext }) {
  const photo          = photos[index];
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying]   = useState(false);
  const playRef = useRef(null);
  const touchStart = useRef(null);

  // Keyboard navigation
  const onKey = useCallback(
    (e) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowRight")  onNext();
      if (e.key === "ArrowLeft")   onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onKey]);

  // Reset loaded state when photo changes
  useEffect(() => { setLoaded(false); }, [index]);

  // Auto-play slideshow
  useEffect(() => {
    if (playing) {
      playRef.current = setInterval(onNext, 3000);
    }
    return () => clearInterval(playRef.current);
  }, [playing, onNext]);

  // Touch swipe
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStart.current === null) return;
    const delta = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? onNext() : onPrev();
    touchStart.current = null;
  };

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="lightbox-backdrop fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-8"
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Card */}
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{ opacity: 0, y: 20, scale: 0.96    }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full sm:max-w-4xl sm:max-h-[90vh] sm:h-auto flex flex-col sm:rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "rgba(30,20,20,0.85)", backdropFilter: "blur(4px)" }}
        >
          {/* Image area */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black/40 min-h-[60vh] sm:min-h-[50vmin]">
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full border-2 border-blush-300/40 border-t-blush-400"
                />
              </div>
            )}
            <motion.img
              src={photo.src}
              alt={photo.alt}
              onLoad={() => setLoaded(true)}
              className="max-h-[65vh] max-w-full object-contain"
              style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
            />

            {/* Prev / Next arrows */}
            <button
              onClick={onPrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                         bg-white/15 active:bg-white/30 hover:bg-white/25 text-white/80 hover:text-white transition-all duration-200
                         backdrop-blur-sm border border-white/15 text-2xl sm:text-xl"
            >
              ‹
            </button>
            <button
              onClick={onNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                         bg-white/15 active:bg-white/30 hover:bg-white/25 text-white/80 hover:text-white transition-all duration-200
                         backdrop-blur-sm border border-white/15 text-2xl sm:text-xl"
            >
              ›
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close lightbox"
              className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
                         bg-white/10 hover:bg-white/25 text-white/80 hover:text-white
                         backdrop-blur-sm border border-white/15 text-base transition-all duration-200"
            >
              ✕
            </button>

            {/* Counter */}
            <div className="absolute top-3 left-3 font-body text-xs text-white/60 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm">
              {index + 1} / {photos.length}
            </div>
          </div>

          {/* Caption bar */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-t border-white/10">
            <p className="font-display italic text-base sm:text-lg text-white/90 leading-snug flex-1 min-w-0 truncate">
              {photo.caption}
            </p>

            {/* Slideshow toggle */}
            <button
              onClick={() => setPlaying((p) => !p)}
              title={playing ? "Pause slideshow" : "Start slideshow"}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold tracking-wide
                         border transition-all duration-200
                         ${playing
                           ? "bg-blush-300/30 border-blush-300/50 text-blush-200"
                           : "bg-white/8 border-white/20 text-white/60 hover:text-white/90"
                         }`}
            >
              {playing ? "⏸ Pause" : "▶ Slideshow"}
            </button>
          </div>

          {/* Dot strip */}
          <div className="flex justify-center gap-1 pb-3 px-4 flex-wrap">
            {photos.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to photo ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-4 h-1.5 bg-blush-300"
                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/50"
                }`}
                onClick={() => {
                  // navigate via parent — we'd need onGoto, so just call next/prev accordingly
                  const diff = i - index;
                  if (diff > 0) for (let k = 0; k < diff; k++) onNext();
                  else         for (let k = 0; k < -diff; k++) onPrev();
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
