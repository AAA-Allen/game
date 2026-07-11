/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        night: {
          950: "#07111F",
          900: "#0B1830",
          800: "#132542",
          700: "#1A3356",
        },
        quest: {
          html: "#3FAE63",
          css: "#49A8FF",
          javascript: "#F3C84B",
          react: "#73D7FF",
          node: "#F38A3C",
          database: "#D89E3F",
          boss: "#8B5CF6",
        },
        reward: {
          xp: "#F6C453",
          success: "#37D67A",
          error: "#E85C5C",
          epic: "#58B8FF",
          legendary: "#9F6BFF",
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans SC"', "sans-serif"],
        display: ['"Press Start 2P"', '"Noto Sans SC"', "monospace"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
      borderRadius: {
        quest: "16px",
        panel: "22px",
        stage: "28px",
        orb: "999px",
      },
      boxShadow: {
        quest: "0 12px 30px rgba(4, 10, 18, 0.35)",
        float: "0 20px 50px rgba(4, 10, 18, 0.45)",
        glow: "0 0 24px rgba(109, 168, 255, 0.18)",
        rare: "0 0 20px rgba(159, 107, 255, 0.32)",
      },
      backgroundImage: {
        "sky-night": "linear-gradient(180deg, #07111F 0%, #0B1830 45%, #132542 100%)",
        "mist-forest":
          "radial-gradient(circle at 30% 20%, rgba(63, 174, 99, 0.18), transparent 40%)",
        "mist-lake":
          "radial-gradient(circle at 50% 30%, rgba(73, 168, 255, 0.20), transparent 42%)",
        "mist-boss":
          "radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.22), transparent 38%)",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 18px rgba(109, 168, 255, 0.12)",
          },
          "50%": {
            boxShadow: "0 0 28px rgba(109, 168, 255, 0.28)",
          },
        },
        xpRise: {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.9)" },
          "20%": { opacity: "1", transform: "translateY(0px) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-30px) scale(1.03)" },
        },
        treasurePop: {
          "0%": { transform: "scale(0.88)", opacity: "0" },
          "70%": { transform: "scale(1.04)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 2.6s ease-in-out infinite",
        "xp-rise": "xpRise 1.1s ease-out forwards",
        "treasure-pop": "treasurePop 0.55s ease-out",
      },
    },
  },
  plugins: [],
};
