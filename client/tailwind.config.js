const flowbite = require("flowbite-react/tailwind");
const scrollbar = require("tailwind-scrollbar");
const lineClamp = require("@tailwindcss/line-clamp");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {},
  },
  plugins: [flowbite.plugin(), scrollbar, lineClamp],
};
