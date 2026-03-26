import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import StoryMode from "./StoryMode";
import LightboxModal from "./LightboxModal";
import photos from "../data/photos";

// Slight deterministic tilt per card
function getTilt(id) {
  const tilts = [-3.5, -2, -1, 1.5, 2.5, 3, -2.5, 1, -1.5, 2];
  return tilts[id % tilts.length];
}

// Split photos into N columns (top-to-bottom fill)
function splitIntoColumns(items, n) {
  const cols = Array.from({ length: n }, () => []);
  items.forEach((item, i) => cols[i % n].push({ item, originalIndex: i }));
  return cols;
}

function useColumnCount() {
  if (typeof window === "undefined") return 2;
  if (window.innerWidth >= 1280) return 4;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640)  return 2;
  return 2;
}

function PolaroidCard({ photo, index, onOpenLightbox, onOpenStory }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const tilt   = getTilt(photo.id);

  const aspectStyle =
    photo.span === "tall"  ? { aspectRatio: "3/4"  } :
    photo.span === "wide"  ? { aspectRatio: "4/3"  } :
                             { aspectRatio: "1/1"   };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotate: tilt * 1.5 }}
      animate={inView ? { opacity: 1, y: 0, rotate: tilt } : {}}
      transition={{ duration: 0.6, delay: (index % 6) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, scale: 1.03, y: -6, transition: { duration: 0.2 } }}
      className="relative mb-4 cursor-pointer group"
      style={{ transformOrigin: "center bottom" }}
    >
      {/* Polaroid frame */}
      <div
        className="bg-white rounded-sm overflow-visible"
        style={{ boxShadow: "0 4px 18px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07)", padding: "7px 7px 38px 7px" }}
        onClick={() => onOpenLightbox(index)}
      >
        {/* Photo */}
        <div className="overflow-hidden bg-blush-200 rounded-[1px]" style={aspectStyle}>
          <motion.img
            src={photo.thumb}
            alt={photo.alt}
            loading="lazy"
            className="w-full h-full object-cover object-top"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.35 }}
          />
        </div>
        {/* Caption strip */}
        <div className="pt-1.5 px-1 text-center">
          <p className="font-display italic text-[#4A2A2A] leading-tight"
             style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.75rem)" }}>
            {photo.caption}
          </p>
        </div>
      </div>

      {/* Play story button — visible on hover */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0 }}
        whileFocus={{ opacity: 1 }}
        _groupHover={{ opacity: 1 }}
        onClick={(e) => { e.stopPropagation(); onOpenStory(index); }}
        className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full
                   bg-[#C8A4A4] text-white text-xs flex items-center justify-center
                   shadow-lg hover:bg-[#B08080] transition-colors z-10
                   opacity-0 group-hover:opacity-100"
        title="Play story from here"
        aria-label="Play story"
      >
        ▶
      </motion.button>
    </motion.div>
  );
}

export default function Gallery({ autoPlay = false, onAutoPlayDone }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [storyIndex,    setStoryIndex]    = useState(null);
  const [numCols]       = useState(() => useColumnCount());
  const headingRef      = useRef(null);
  const headingInView   = useInView(headingRef, { once: true, margin: "-80px" });

  // Auto-launch story when parent signals it
  useEffect(() => {
    if (autoPlay) setStoryIndex(0);
  }, [autoPlay]);

  const openLightbox  = useCallback(i => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto     = useCallback(() => setLightboxIndex(i => (i - 1 + photos.length) % photos.length), []);
  const nextPhoto     = useCallback(() => setLightboxIndex(i => (i + 1) % photos.length), []);
  const openStory  = useCallback(i => { setLightboxIndex(null); setStoryIndex(i); }, []);
  const closeStory = useCallback(() => {
    setStoryIndex(null);
    if (onAutoPlayDone) onAutoPlayDone();
  }, [onAutoPlayDone]);

  const columns = splitIntoColumns(photos, numCols);

  return (
    <section id="gallery" className="py-24 px-4 sm:px-5 max-w-7xl mx-auto">

      {/* Heading */}
      <div ref={headingRef} className="text-center mb-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          className="font-body text-xs uppercase tracking-[0.3em] text-[#B08080] mb-3"
        >
          Our Story in Pictures
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-display italic font-bold text-[#4A2A2A]"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          A Gallery of Moments
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={headingInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-5 h-[2px] w-24 bg-gradient-to-r from-transparent via-[#C8A4A4] to-transparent"
        />
      </div>

      {/* Story mode CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={headingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className="flex justify-center mb-12"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => openStory(0)}
          className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full
                     bg-gradient-to-r from-[#C8A4A4] to-[#B08080] text-white
                     font-body font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all"
        >
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>▶</motion.span>
          Watch as a Cinematic Story
          <span className="text-white/70 text-xs font-normal">{photos.length} photos · auto-play</span>
        </motion.button>
      </motion.div>

      {/* JS-based masonry — reliable with animated children */}
      <div className="flex gap-3 sm:gap-4 items-start">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col gap-3 sm:gap-4">
            {col.map(({ item, originalIndex }) => (
              <PolaroidCard
                key={item.id}
                photo={item}
                index={originalIndex}
                onOpenLightbox={openLightbox}
                onOpenStory={openStory}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <LightboxModal
          photos={photos}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}

      {/* Story Mode */}
      <AnimatePresence>
        {storyIndex !== null && (
          <StoryMode photos={photos} startIndex={storyIndex} onClose={closeStory} />
        )}
      </AnimatePresence>
    </section>
  );
}
