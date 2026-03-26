import { useEffect, useState, useRef } from "react";

const SYMBOLS = ["💖","🌸","✨","🎉","💜","⭐","🎊","🩷","🌺","💫","🎈","🌷","💝","🎀","🌟"];

let uid = 0;
function makeParticles(count) {
  return Array.from({ length: count }, () => ({
    id:       ++uid,
    symbol:   SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    left:     Math.random() * 100,           // % across screen
    delay:    Math.random() * 0.6,           // stagger start
    duration: 2.2 + Math.random() * 2,      // fall speed
    size:     1.4 + Math.random() * 1,      // rem
    swing:    (Math.random() - 0.5) * 120,  // px horizontal drift
    spin:     Math.random() > 0.5 ? 360 : -360,
  }));
}

export default function FallingCelebration({ active }) {
  const [particles, setParticles] = useState([]);
  const timersRef = useRef([]);

  useEffect(() => {
    // Clear all timers and particles when inactive
    if (!active) {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      setParticles([]);
      return;
    }

    // Initial burst
    setParticles(makeParticles(35));

    // 2 more waves
    const t1 = setTimeout(() => setParticles(p => [...p, ...makeParticles(25)]), 800);
    const t2 = setTimeout(() => setParticles(p => [...p, ...makeParticles(20)]), 1600);
    timersRef.current = [t1, t2];

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [active]);

  if (!active && particles.length === 0) return null;

  return (
    <>
      {/* Inline keyframe — single definition, shared by all particles */}
      <style>{`
        @keyframes celebFall {
          0%   { opacity: 1;   transform: translateY(-40px) translateX(0)    rotate(0deg); }
          100% { opacity: 0;   transform: translateY(105vh) translateX(var(--swing)) rotate(var(--spin)); }
        }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 9999 }}
      >
        {particles.map(p => (
          <span
            key={p.id}
            style={{
              position:   "absolute",
              left:       `${p.left}%`,
              top:        0,
              fontSize:   `${p.size}rem`,
              lineHeight: 1,
              willChange: "transform, opacity",
              "--swing":  `${p.swing}px`,
              "--spin":   `${p.spin}deg`,
              animation:  `celebFall ${p.duration}s ease-in ${p.delay}s both`,
            }}
          >
            {p.symbol}
          </span>
        ))}
      </div>
    </>
  );
}
