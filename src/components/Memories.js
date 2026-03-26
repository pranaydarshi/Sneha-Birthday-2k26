import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const MEMORIES = [
  {
    icon:  "🏎️",
    year:  "Nov 2024",
    title: "Go-Kart Chaos (You vs Me)",
    body:  "You were convinced you'd win. Spoiler: you did. I'm still blaming the kart and the track and the weather.",
    color: "from-[#FADADD] to-[#F7CAC9]",
  },
  {
    icon:  "🛶",
    year:  "Dec 2024",
    title: "That Backwaters Afternoon",
    body:  "Drifting on the boat, talking about everything and nothing. Honestly one of the most peaceful hours we've spent together.",
    color: "from-[#E0F5F5] to-[#B2D8D8]",
  },
  {
    icon:  "🏕️",
    year:  "Dec 2024",
    title: "Beach Camping at the End of the Year",
    body:  "Messy hair, salty air, and laughing till our stomachs hurt. That trip was everything. We need a part two.",
    color: "from-[#FFF0E6] to-[#FFDAB9]",
  },
  {
    icon:  "🌊",
    year:  "Dec 2024",
    title: "Walking Into the Waves Like You Owned Them",
    body:  "You just walked straight in, pink dress and all. I stood there watching, not surprised one bit. That's so you.",
    color: "from-[#E6F0FF] to-[#C8D8F0]",
  },
  {
    icon:  "🌙",
    year:  "2024",
    title: "The Late Nights That Ran Way Too Long",
    body:  "We always said \"just one more topic\" and suddenly it's 2AM. Some conversations are just worth losing sleep over.",
    color: "from-[#E8D5D5] to-[#D4A5A5]",
  },
  {
    icon:  "🎂",
    year:  "2026",
    title: "This Exact Moment Right Now",
    body:  "You thought it was just another birthday. Surprise — you got a whole website. Happy 23rd, bestie! 🎉",
    color: "from-[#F9E4F9] to-[#E8C8E8]",
  },
];

function MemoryCard({ mem, index }) {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`relative rounded-2xl p-7 bg-gradient-to-br ${mem.color}
                  shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden`}
    >
      {/* Decorative circle */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/20 blur-xl pointer-events-none" />

      <div className="flex items-start gap-4">
        <span className="text-3xl shrink-0 mt-1" aria-hidden="true">{mem.icon}</span>
        <div>
          <span className="font-body text-xs uppercase tracking-widest text-[#8B5E5E]/70 font-semibold">
            {mem.year}
          </span>
          <h3 className="font-display italic font-bold text-[#4A2A2A] text-lg sm:text-xl mt-1 mb-3 leading-snug">
            {mem.title}
          </h3>
          <p className="font-body text-[0.93rem] text-[#4A5568]/90 leading-relaxed">
            {mem.body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Memories() {
  const headingRef = useRef(null);
  const inView     = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section
      id="memories"
      className="py-28 px-5"
      style={{
        background:
          "linear-gradient(180deg, #F8F1F1 0%, #F0E4E4 40%, #F8F1F1 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="font-body text-xs uppercase tracking-[0.3em] text-[#B08080] mb-3"
          >
            The Two of Us — Our Story
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display italic font-bold text-[#4A2A2A] leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Memories We Made Together
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-5 h-[2px] w-24 bg-gradient-to-r from-transparent via-[#C8A4A4] to-transparent origin-center"
          />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MEMORIES.map((mem, i) => (
            <MemoryCard key={i} mem={mem} index={i} />
          ))}
        </div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 text-center"
        >
          <p className="font-display italic text-xl sm:text-2xl text-[#8B5E5E] max-w-2xl mx-auto leading-relaxed">
            "We didn't realise we were making memories; we just knew we were
            having fun."
          </p>
          <footer className="mt-4 font-body text-sm text-[#4A5568]/60 tracking-widest uppercase">
            — Winnie the Pooh
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
