import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar              from "./components/Navbar";
import BirthdayCake        from "./components/BirthdayCake";
import Gallery             from "./components/Gallery";
import Footer              from "./components/Footer";
import LockScreen          from "./components/LockScreen";
import FallingCelebration  from "./components/FallingCelebration";
import LetterModal         from "./components/LetterModal";
import SurpriseCard        from "./components/SurpriseCard";
import TeaserCard          from "./components/TeaserCard";
import BowArrow            from "./components/BowArrow";
import BirthdayMusic       from "./components/BirthdayMusic";

const UNLOCK_TIME = 1775241000000; // Apr 4, 2026 12:00 AM IST

const LS_UNLOCKED  = "sg_unlocked";
const LS_CAKE_DONE = "sg_cakeDone";

export default function App() {
  const [locked,        setLocked]        = useState(() => {
    // If she's already unlocked before, skip the lock screen entirely on refresh
    if (localStorage.getItem(LS_UNLOCKED) === "true") return false;
    return true; // LockScreen itself handles countdown vs swipe based on time
  });
  const [showConfetti,  setShowConfetti]  = useState(false);
  const [autoPlayStory, setAutoPlayStory] = useState(false);
  const [celebrating,   setCelebrating]   = useState(false);
  const [showSurprise,  setShowSurprise]  = useState(false);
  const [showBow,       setShowBow]       = useState(false);
  const [showTeaser,    setShowTeaser]    = useState(false);
  const [openLetter,    setOpenLetter]    = useState(false);
  const [showPlane,     setShowPlane]     = useState(false);
  const [cakeDone,      setCakeDone]      = useState(() =>
    localStorage.getItem(LS_CAKE_DONE) === "true"
  );
  const [resetting,     setResetting]     = useState(false);
  const [playMusic,     setPlayMusic]     = useState(false);
  const [wasReset,      setWasReset]      = useState(false);

  const handleUnlocked = () => {
    localStorage.setItem(LS_UNLOCKED, "true");
    setWasReset(false);
    setLocked(false);
    setPlayMusic(true);
    setTimeout(() => setShowConfetti(true), 300);
    setTimeout(() => setShowConfetti(false), 8700);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Page already unlocked on load → light confetti + restore scroll position
  useEffect(() => {
    if (!locked) {
      const t1 = setTimeout(() => setShowConfetti(true), 400);
      const t2 = setTimeout(() => setShowConfetti(false), 8400);
      // Restore exact scroll position from before refresh
      const saved = localStorage.getItem("sg_scroll");
      if (saved) {
        setTimeout(() => window.scrollTo({ top: parseInt(saved, 10), behavior: "instant" }), 80);
      }
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, []); // only on mount

  // Save scroll position continuously while unlocked
  useEffect(() => {
    if (locked) return;
    const onScroll = () => localStorage.setItem("sg_scroll", window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [locked]);

  // Cake blown → celebration → surprise card
  const handleCakeCelebrate = () => {
    localStorage.setItem(LS_CAKE_DONE, "true");
    setCakeDone(true);
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 5800);
    setTimeout(() => setShowSurprise(true),  5800);
  };

  const handleAutoPlayDone = () => {
    setAutoPlayStory(false);
    setShowTeaser(true);
    setShowBow(true);
  };

  const handleReset = () => {
    setResetting(true);
    // Let the time-travel animation play for 900ms, then wipe state
    setTimeout(() => {
      localStorage.removeItem(LS_UNLOCKED);
      localStorage.removeItem(LS_CAKE_DONE);
      localStorage.removeItem("sg_scroll");
      setLocked(true);
      setWasReset(true);
      setCakeDone(false);
      setShowConfetti(false);
      setAutoPlayStory(false);
      setCelebrating(false);
      setShowSurprise(false);
      setShowBow(false);
      setShowTeaser(false);
      setOpenLetter(false);
      setShowPlane(false);
      // Fade the overlay out after state is reset
      setTimeout(() => setResetting(false), 500);
    }, 900);
  };

  return (
    <div className="min-h-screen">

      {/* ── Time-travel reset overlay ── */}
      <AnimatePresence>
        {resetting && (
          <motion.div
            key="rewind"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[500] flex flex-col items-center justify-center gap-5"
            style={{ background: "linear-gradient(160deg, #0D1F3C 0%, #081228 100%)" }}
          >
            <motion.div
              animate={{ rotate: [0, -20, 15, -10, 5, 0], scale: [1, 1.3, 0.85, 1.15, 0.95, 1] }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
              style={{ fontSize: "4rem", lineHeight: 1 }}
            >
              ⏪
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                fontFamily: "inherit",
                fontSize: "0.7rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(186,208,240,0.5)",
              }}
            >
              Rewinding…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <BirthdayMusic play={playMusic} />
      {locked && <LockScreen onUnlocked={handleUnlocked} forceSwipe={wasReset} />}

      <FallingCelebration active={celebrating} />
      <SurpriseCard
        active={showSurprise}
        onDone={() => { setShowSurprise(false); setAutoPlayStory(true); }}
      />
      <TeaserCard active={showTeaser} onDone={() => {}} />
      {showBow && (
        <BowArrow
          onLaunch={() => {
            setOpenLetter(true);
            setTimeout(() => setShowTeaser(false), 1200);
            setTimeout(() => setShowPlane(true), 4500);
          }}
        />
      )}
      <LetterModal showPlane={showPlane} autoOpen={openLetter} />
      <Navbar onReset={handleReset} />

      <main>
        <div id="cake">
          <BirthdayCake onCelebrate={handleCakeCelebrate} />
        </div>

        {cakeDone && (
          <Gallery
            autoPlay={autoPlayStory}
            onAutoPlayDone={handleAutoPlayDone}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
