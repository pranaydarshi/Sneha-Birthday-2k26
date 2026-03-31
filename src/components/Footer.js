import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ✏️  Customise these
const FRIEND_NAME = "Sneha";

const SHARE_URL  = typeof window !== "undefined" ? window.location.href : "https://example.com";

const SHARE_LINKS = [
  {
    label: "WhatsApp",
    icon:  "💬",
    href:  `https://api.whatsapp.com/send?text=${encodeURIComponent("A birthday surprise just for you 🎊 " + SHARE_URL)}`,
    color: "bg-[#25D366]/15 hover:bg-[#25D366]/30 border-[#25D366]/30",
  },
  {
    label: "Twitter / X",
    icon:  "𝕏",
    href:  `https://twitter.com/intent/tweet?text=${encodeURIComponent("Happy Birthday! 🎉🤝")}&url=${encodeURIComponent(SHARE_URL)}`,
    color: "bg-[#1DA1F2]/15 hover:bg-[#1DA1F2]/30 border-[#1DA1F2]/30",
  },
  {
    label: "Copy Link",
    icon:  "🔗",
    href:  null,  // handled via clipboard
    color: "bg-[#60A5FA]/20 hover:bg-[#60A5FA]/40 border-[#60A5FA]/40",
  },
];

function ShareButton({ btn }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      alert("Link copied to clipboard! 🎉");
    } catch {
      prompt("Copy this link:", SHARE_URL);
    }
  };

  const commonClass = `inline-flex items-center gap-2 px-4 py-2.5 rounded-full
    font-body text-sm font-semibold text-[#0D1F3C] border transition-all duration-200 ${btn.color}`;

  if (!btn.href) {
    return (
      <button onClick={handleCopy} className={commonClass}>
        <span aria-hidden="true">{btn.icon}</span>
        {btn.label}
      </button>
    );
  }

  return (
    <a
      href={btn.href}
      target="_blank"
      rel="noopener noreferrer"
      className={commonClass}
    >
      <span aria-hidden="true">{btn.icon}</span>
      {btn.label}
    </a>
  );
}

export default function Footer() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer
      id="footer"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #0D1F3C 0%, #122847 40%, #0D1F3C 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#60A5FA]/10 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#BAD0F0]/10 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-6 py-20 flex flex-col items-center gap-12">

        {/* Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="font-body text-xs uppercase tracking-widest text-[#BAD0F0]/50">
            Share the love
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {SHARE_LINKS.map((btn) => (
              <ShareButton key={btn.label} btn={btn} />
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#60A5FA]/50 to-transparent origin-center"
        />

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="block text-3xl mb-3"
            aria-hidden="true"
          >
            🫂
          </motion.span>
          <p className="font-display italic text-[#E8F0FD]/70 text-sm">
            Made with love, for {FRIEND_NAME}.
          </p>
          <p className="font-body text-[0.7rem] text-[#E8F0FD]/30 tracking-widest uppercase mt-2">
            &copy; {new Date().getFullYear()} · A Birthday Surprise
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
