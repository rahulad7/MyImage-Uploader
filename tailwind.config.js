/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(147.52deg, #F9FAFB 8.89%, #D2D6DB 100.48%)",
      },
      colors: {
        neutral: "#171717",
        "neutral-200": "#E5E5E5",
      },
      boxShadow: {
        "custom-light": "0px 2px 4px -1px #0000000F",
        "custom-dark": "0px 4px 6px -1px #0000001A",
      },
      borderWidth: {
        0.5: "0.5px",
      },
    },
  },
  plugins: [],
};
