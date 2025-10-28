/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        waitly: {
          primary: {
            DEFAULT: "#d8b4fe",
            hover: "#cbacff",
            text: "#27272A",
            light: "#f3e8ff",
            50: "#faf5ff",
            100: "#f3e8ff",
            200: "#e9d5ff",
            300: "#d8b4fe",
            400: "#c084fc",
            500: "#a855f7",
            600: "#9333ea",
            700: "#7c3aed",
            800: "#6b21a8",
            900: "#581c87",
          },
          neutral: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
          },
          success: "#059669",
          error: "#dc2626",
          warning: "#d97706",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "waitly-sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "waitly-base": ["1rem", { lineHeight: "1.5rem" }],
        "waitly-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "waitly-xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "waitly-2xl": ["1.5rem", { lineHeight: "2rem" }],
      },
      spacing: {
        "waitly-xs": "0.5rem",
        "waitly-sm": "0.75rem",
        "waitly-md": "1rem",
        "waitly-lg": "1.5rem",
        "waitly-xl": "2rem",
        "waitly-2xl": "2.5rem",
      },
      borderRadius: {
        "waitly-sm": "0.375rem",
        "waitly-md": "0.5rem",
        "waitly-lg": "0.75rem",
      },
      boxShadow: {
        "waitly-sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "waitly-md":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "waitly-lg":
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};
