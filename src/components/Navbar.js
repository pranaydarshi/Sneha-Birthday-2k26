import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Cake",    href: "#cake"    },
  { label: "Gallery", href: "#gallery" },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 60);
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);

      // Determine active section
      const sections = ["cake", "gallery"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && scrollTop >= el.offsetTop - 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 z-[60] h-[3px] progress-bar transition-all duration-100"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass shadow-sm shadow-blush-300/30 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#cake"
            onClick={(e) => { e.preventDefault(); handleNavClick("#cake"); }}
            whileHover={{ scale: 1.04 }}
            className="font-display italic text-[1.25rem] font-bold text-[#8B5E5E] tracking-wide"
          >
            💖 Sneha
          </motion.a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => {
              const id = href.replace("#", "");
              const active = activeSection === id;
              return (
                <li key={label}>
                  <motion.a
                    href={href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                    whileHover={{ y: -2 }}
                    className={`font-body text-[0.9rem] font-semibold tracking-widest uppercase transition-colors duration-300 relative pb-1 ${
                      active ? "text-[#8B5E5E]" : "text-[#4A5568] hover:text-[#8B5E5E]"
                    }`}
                  >
                    {label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8A4A4] rounded-full"
                      />
                    )}
                  </motion.a>
                </li>
              );
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-[5px] p-2 rounded-lg hover:bg-blush-200/50 transition"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[2px] bg-[#8B5E5E] rounded-full origin-center transition-all"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-5 h-[2px] bg-[#8B5E5E] rounded-full"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[2px] bg-[#8B5E5E] rounded-full origin-center transition-all"
            />
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden glass border-t border-blush-300/30"
            >
              <ul className="flex flex-col py-4 px-5 gap-1">
                {NAV_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                      className="block py-3 px-2 font-body font-semibold tracking-widest uppercase text-sm text-[#4A5568] hover:text-[#8B5E5E] transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
