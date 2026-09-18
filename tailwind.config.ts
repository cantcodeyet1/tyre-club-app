import type { Config } from 'tailwindcss';

const config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFCB14',
          hover: '#f2bd00',
          start: '#FFF200',
          end: '#FFCB14',
          light: 'rgba(245, 200, 0, 0.1)',
          border: 'rgba(245, 200, 0, 0.3)',
          text: '#7a6000',
        },
        secondary: '#5a5755',
        background: '#ffffff',
        surface: {
          DEFAULT: '#ffffff',
          glass: 'rgba(255, 255, 255, 0.72)',
          muted: 'rgba(255, 255, 255, 0.5)',
        },
        textPrimary: '#1a1a1a',
        textSecondary: '#515151',
        textTertiary: '#9a9490',
        success: {
          DEFAULT: '#00D807',
          light: '#A6EEA9',
          border: '#00D807',
          text: '#155c3e',
        },
        warning: {
          DEFAULT: '#FFB300',
          light: '#FFE3A3',
          border: '#FFB300',
          text: '#8a5500',
        },
        danger: {
          DEFAULT: '#FB2929',
          light: '#FFBFBF',
          border: '#FB2929',
          text: '#a52018',
        },
        border: {
          subtle: '#F2F2F2',
          field: '#D9D9D9',
          DEFAULT: 'rgba(0, 0, 0, 0.12)',
          strong: 'rgba(0, 0, 0, 0.2)',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        inter: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      spacing: {
        18: '4.5rem',
        safe: 'env(safe-area-inset-bottom)',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05)',
        soft: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
        yellow: '0 2px 8px rgba(245, 200, 0, 0.30)',
        avatar: '0 4px 12.1px rgba(144, 144, 144, 0.25)',
        nav: '0 -4px 14px rgba(0, 0, 0, 0.15)',
        phone: '0 20px 60px rgba(0, 0, 0, 0.18), 0 4px 16px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'yellow-cta': 'linear-gradient(90deg, #FFF200 0%, #FFCB14 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
