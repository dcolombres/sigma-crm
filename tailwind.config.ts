import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#556ee6',
        secondary: '#34c38f',
        background: '#f8f8fb',
        'sidebar-bg': '#ffffff',
        'sidebar-text': '#495057',
        'sidebar-hover': '#f0f0f0',
        'topbar-bg': '#ffffff',
        'card-bg': '#ffffff',
        'text-primary': '#495057',
        'text-secondary': '#7a7f9a',
      },
    },
  },
  plugins: [],
}
export default config
