import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // Ensure this covers all Vue/TS files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;