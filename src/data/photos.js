// 20 photos — mix of both folders, diverse dates/outfits/moods, shuffled so same-day
// photos never land in the same masonry column (columns fill at i % numCols).
const photos = [
  // ── Column 1 seed ─────────────────────────────────────────
  {
    id: 1,
    src:     "/photos/Sneha_Profile.jpg",
    thumb:   "/photos/Sneha_Profile.jpg",
    alt:     "Sneha portrait",
    caption: "Always effortlessly herself ✨",
    span:    "tall",
  },
  // ── Column 2 seed ─────────────────────────────────────────
  {
    id: 2,
    src:     "/photos/20241025_181028.jpg",
    thumb:   "/photos/20241025_181028.jpg",
    alt:     "Sneha in purple kurti, golden hour",
    caption: "Purple in the golden hour 💜",
    span:    "tall",
  },
  // ── Column 3 seed ─────────────────────────────────────────
  {
    id: 3,
    src:     "/photos/20250207_184315.jpg",
    thumb:   "/photos/20250207_184315.jpg",
    alt:     "Sneha in floral dress under fairy lights",
    caption: "Lit up the whole place — the lights helped a little ✨",
    span:    "tall",
  },
  // ── Column 4 seed ─────────────────────────────────────────
  {
    id: 4,
    src:     "/photos/20250412_181637.jpg",
    thumb:   "/photos/20250412_181637.jpg",
    alt:     "Sneha at sunset by the river, pink top and black skirt",
    caption: "Golden hour found its match 🌅",
    span:    "normal",
  },
  // ── Row 2 ─────────────────────────────────────────────────
  {
    id: 5,
    src:     "/photos/20241231_085549.jpg",
    thumb:   "/photos/20241231_085549.jpg",
    alt:     "Sneha in pink dress, hair flying at beach",
    caption: "Hair flying, joy on her face — pure energy 🌊",
    span:    "tall",
  },
  {
    id: 6,
    src:     "/photos/20241115_150118.jpg",
    thumb:   "/photos/20241115_150118.jpg",
    alt:     "Sneha at go-kart track with helmet",
    caption: "Go-karts, chaos — she still won 🏎️",
    span:    "normal",
  },
  {
    id: 7,
    src:     "/photos/20250209_193831.jpg",
    thumb:   "/photos/20250209_193831.jpg",
    alt:     "Sneha sitting at mall cafe near Starbucks, floral top",
    caption: "She walks into a room and just owns it 🌸",
    span:    "normal",
  },
  {
    id: 8,
    src:     "/photos/20250704_181638.jpg",
    thumb:   "/photos/20250704_181638.jpg",
    alt:     "Sneha at yellow villa balcony, pink jacket",
    caption: "That yellow house and that smile — both unforgettable 🌻",
    span:    "tall",
  },
  // ── Row 3 ─────────────────────────────────────────────────
  {
    id: 9,
    src:     "/photos/20250301_003637.jpg",
    thumb:   "/photos/20250301_003637.jpg",
    alt:     "Sneha walking alone on night road under streetlights",
    caption: "Some roads look better at night 🌃",
    span:    "tall",
  },
  {
    id: 10,
    src:     "/photos/20241230_154008.jpg",
    thumb:   "/photos/20241230_154008.jpg",
    alt:     "Sneha on beach rocks with sunglasses",
    caption: "Cool vibes, salty air, zero worries 😎",
    span:    "normal",
  },
  {
    id: 11,
    src:     "/photos/20250206_203824.jpg",
    thumb:   "/photos/20250206_203824.jpg",
    alt:     "Sneha with ice cream at cafe, glasses, huge smile",
    caption: "This face when the dessert arrives 🍦",
    span:    "normal",
  },
  {
    id: 12,
    src:     "/photos/20241229_154431.jpg",
    thumb:   "/photos/20241229_154431.jpg",
    alt:     "Sneha smiling on boat, backwaters",
    caption: "On the water, completely at peace 🛶",
    span:    "normal",
  },
  // ── Row 4 ─────────────────────────────────────────────────
  {
    id: 13,
    src:     "/photos/20241025_191827.jpg",
    thumb:   "/photos/20241025_191827.jpg",
    alt:     "Sneha close-up portrait, bokeh lights",
    caption: "Lost in thought, and still the most captivating person there 💫",
    span:    "normal",
  },
  {
    id: 14,
    src:     "/photos/20250329_180539.jpg",
    thumb:   "/photos/20250329_180539.jpg",
    alt:     "Sneha laughing candidly at restaurant",
    caption: "Caught mid-laugh — the best kind of photo 😊",
    span:    "normal",
  },
  {
    id: 15,
    src:     "/photos/20241230_091006.jpg",
    thumb:   "/photos/20241230_091006.jpg",
    alt:     "Sneha in red kurti under coconut trees",
    caption: "Coconut trees, carefree afternoon 🌴",
    span:    "normal",
  },
  {
    id: 16,
    src:     "/photos/20250209_221415.jpg",
    thumb:   "/photos/20250209_221415.jpg",
    alt:     "Sneha laughing on orange stairs at cafe",
    caption: "That laugh — unfiltered, the real one 😄",
    span:    "normal",
  },
  // ── Row 5 ─────────────────────────────────────────────────
  {
    id: 17,
    src:     "/photos/20241229_174910.jpg",
    thumb:   "/photos/20241229_174910.jpg",
    alt:     "Sneha silhouette against dramatic sunset sky",
    caption: "She watches sunsets like she owns them 🌇",
    span:    "wide",
  },
  {
    id: 18,
    src:     "/photos/20250121_161751.jpg",
    thumb:   "/photos/20250121_161751.jpg",
    alt:     "Sneha candid at office, white shirt, looking away",
    caption: "In her element — making it look effortless 💼",
    span:    "tall",
  },
  {
    id: 19,
    src:     "/photos/20250704_184053.jpg",
    thumb:   "/photos/20250704_184053.jpg",
    alt:     "Sneha walking down a tree-lined path",
    caption: "The whole road ahead — walking right into it 🌿",
    span:    "tall",
  },
  {
    id: 20,
    src:     "/photos/20241231_073017.jpg",
    thumb:   "/photos/20241231_073017.jpg",
    alt:     "Sneha in camping tent, soft morning light",
    caption: "Morning light, messy hair, zero worries — that's her 🏕️",
    span:    "normal",
  },
];

export default photos;
