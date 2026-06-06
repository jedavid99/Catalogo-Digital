export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
     
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        gutter: "24px",
        containerMax: "1280px",
        base: "8px"
      },
      fontFamily: {
        bodyLg: ["Inter"],
        bodySm: ["Inter"],
        headlineSm: ["Sora"],
        headlineMd: ["Sora"],
        displayLg: ["Sora"],
        bodyMd: ["Inter"]
      }
    }
  },
  plugins: [],
}