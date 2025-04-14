import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6750A4',  // M3のプライマリカラー
        'primary-dark': '#5D4A93',
        'primary-darker': '#533D88',
        'on-primary': '#FFFFFF',
        'primary-container': '#EADDFF',
        'on-primary-container': '#21005E',
        
        secondary: '#625B71',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#E8DEF8',
        'secondary-container-dark': '#D9CFF9',
        'secondary-container-darker': '#CAC0FA',
        'on-secondary-container': '#1E192B',
        
        surface: '#FFFBFE',
        'surface-variant': '#E7E0EC',
        'on-surface': '#1C1B1F',
        
        outline: '#79747E',
      }
    },
  },
  plugins: [],
};

export default config;