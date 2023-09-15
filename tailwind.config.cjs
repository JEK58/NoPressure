/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#570df8",
          secondary: "hsl(342,100%,70%)",
          accent: "#1dcdbc",
          neutral: "#2b3440",
          "base-100": "#ffffff",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
    ],
  },
  theme: {
    extend: {
      colors: {
        primary: "hsl(125,50%,56%)",
      },
    },
  },
  plugins: [daisyui],
};

module.exports = config;
