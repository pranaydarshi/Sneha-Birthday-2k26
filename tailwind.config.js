/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        blush: {
          50:  "#F0F4FF",
          100: "#E8F0FD",
          200: "#D6E4F7",
          300: "#BAD0F0",
          400: "#93BAE8",
          500: "#60A5FA",
          600: "#4A7CC9",
          700: "#2563EB",
          800: "#1E3A8A",
          900: "#0D1F3C",
        },
        slate: {
          text: "#4A5568",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body:    ["'Source Sans 3'", "'Source Sans Pro'", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(160deg, rgba(186,208,240,0.55) 0%, rgba(232,240,253,0.35) 50%, rgba(74,85,104,0.45) 100%)",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition:  "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        progressBar: {
          "0%":   { width: "0%" },
          "100%": { width: "var(--progress)" },
        },
      },
      animation: {
        "fade-up":     "fadeUp 0.8s ease forwards",
        "fade-up-slow":"fadeUp 1.2s ease forwards",
        shimmer:       "shimmer 3s linear infinite",
        float:         "float 4s ease-in-out infinite",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
