import { useState, useEffect } from "react";
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

const UNLOCK_TIME = Date.now() + 10 * 1000; // TEST MODE — change back to April 4 before sharing

export default function App() {
  const [locked,         setLocked]         = useState(Date.now() < UNLOCK_TIME);
  const [showConfetti,   setShowConfetti]   = useState(false);
  const [autoPlayStory,  setAutoPlayStory]  = useState(false);
  const [celebrating,    setCelebrating]    = useState(false);
  const [showSurprise,   setShowSurprise]   = useState(false);
  const [showBow,     setShowBow]     = useState(false);
  const [showTeaser,  setShowTeaser]  = useState(false);
  const [openLetter,  setOpenLetter]  = useState(false);
  const [cakeDone,    setCakeDone]    = useState(false);

  const handleUnlocked = () => {
    setLocked(false);
    setTimeout(() => setShowConfetti(true), 300);
    setTimeout(() => setShowConfetti(false), 8700);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Page already unlocked on load → same flow
  useEffect(() => {
    if (!locked) {
      const t1 = setTimeout(() => setShowConfetti(true), 400);
      const t2 = setTimeout(() => setShowConfetti(false), 8400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, []); // only on mount

  // Cake blown → celebration for 2s → stop canvas → show surprise card
  const handleCakeCelebrate = () => {
    setCakeDone(true);
    setCelebrating(true);
    // Last particle wave spawns at 1600ms; max fall duration ~4.8s from that point.
    // Wait ~5800ms so all flowers land off-screen before the card pops up.
    setTimeout(() => setCelebrating(false), 5800);
    setTimeout(() => setShowSurprise(true),  5800);
  };

  const handleAutoPlayDone = () => {
    setAutoPlayStory(false);
    setShowTeaser(true);
    setShowBow(true); // bow appears over teaser card
  };

  return (
    <div className="min-h-screen">
      {locked && <LockScreen onUnlocked={handleUnlocked} />}

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
            // Keep teaser + bow visible while crack fades, then clean up
            setTimeout(() => setShowTeaser(false), 1200);
          }}
        />
      )}
      <LetterModal autoOpen={openLetter} />
      <Navbar />

      <main>
        {/* Cake — first thing she sees after unlock */}
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
