/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Note: In Tailwind v4, theme configuration is done in CSS using @theme
  // Plugins may need to be checked for v4 compatibility
  // plugins: [
  //   require('tailwindcss-animate') // Check if compatible with v4
  // ],
}