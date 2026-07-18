/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#F1EDE2",
        parchmentDark: "#E7E0CF",
        ink: "#20241F",
        trail: {
          DEFAULT: "#2F4B3C",
          light: "#3E5F4C",
          dark: "#1B2E23",
        },
        sage: "#8DA292",
        amber: "#C97A3D",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        topo: "radial-gradient(circle at 1px 1px, rgba(47,75,60,0.08) 1px, transparent 0)",
      },
      backgroundSize: {
        topo: "18px 18px",
      },
    },
  },
  plugins: [],
};
