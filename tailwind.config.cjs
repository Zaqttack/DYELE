/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#121117",
        parchment: "#f7f3ea",
        inkMuted: "#4d4b52",
        match: "#4f9a5f",
        hint: "#d9b24c",
        miss: "#d0d0d4"
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Source Sans 3", "sans-serif"]
      },
      boxShadow: {
        tile: "0 6px 16px rgba(18, 17, 23, 0.12)"
      }
    }
  },
  plugins: []
};
