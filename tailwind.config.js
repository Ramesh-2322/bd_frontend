/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        medical: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          text: "#1f2937",
          bg: "#fff7f7",
          card: "#ffffff"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(159, 18, 57, 0.08)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top right, rgba(225,29,72,0.14), transparent 45%), radial-gradient(circle at bottom left, rgba(244,63,94,0.15), transparent 35%)",
      },
      fontFamily: {
        sans: ["Poppins", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
