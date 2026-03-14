import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ============================================
         Colors — Design System Tokens
         ============================================ */
      colors: {
        brand: {
          primary: '#635bff',
          secondary: '#8a81ff',
          accent: '#4f48e0',
          dark: '#1e1b5e',
          light: '#f0efff',
          50: '#f0efff',
          100: '#e0deff',
          200: '#c4bfff',
          300: '#a59eff',
          400: '#8a81ff',
          500: '#635bff',
          600: '#4f48e0',
          700: '#3d37b3',
          800: '#2d2986',
          900: '#1e1b5e',
          950: '#0f0e33',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e8e8ed',
          300: '#d1d1db',
          400: '#9898a6',
          500: '#6b6b7b',
          600: '#4a4a5a',
          700: '#2d2d3a',
          800: '#1a1a2e',
          900: '#0d0d1a',
        },
        surface: {
          card: '#ffffff',
          overlay: 'rgba(13, 13, 26, 0.7)',
          input: '#fafafa',
          disabled: '#f5f5f5',
          warm: '#f5f5f7',
          'dark-card': '#1a1a2e',
          'dark-elevated': '#222240',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e8e8ed',
          300: '#d1d1db',
          400: '#9898a6',
          500: '#6b6b7b',
          600: '#4a4a5a',
          700: '#2d2d3a',
          800: '#1a1a2e',
          900: '#0d0d1a',
          950: '#06060d',
        },
        text: {
          primary: '#1a1a2e',
          secondary: '#4a4a5a',
          muted: '#6b6b7b',
          inverse: '#f5f5f5',
          link: '#635bff',
        },
        status: {
          success: {
            DEFAULT: '#10b981',
            light: '#ecfdf5',
          },
          warning: {
            DEFAULT: '#f59e0b',
            light: '#fffbeb',
          },
          error: {
            DEFAULT: '#ef4444',
            light: '#fef2f2',
          },
          info: {
            DEFAULT: '#3b82f6',
            light: '#eff6ff',
          },
        },
        border: {
          light: '#e8e8ed',
          dark: 'rgba(255, 255, 255, 0.08)',
        },
      },

      /* ============================================
         Typography — Font Size + Line Height + Weight
         ============================================ */
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-sm': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-1': ['2rem', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-4': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
      },

      /* ============================================
         Border Radius
         ============================================ */
      borderRadius: {
        'radius-sm': '0.25rem',
        'radius-md': '0.5rem',
        'radius-lg': '0.75rem',
        'radius-xl': '1rem',
        'radius-2xl': '1.5rem',
        'radius-full': '9999px',
      },

      /* ============================================
         Box Shadows
         ============================================ */
      boxShadow: {
        'shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'shadow-md': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'shadow-xl': '0 16px 48px rgba(0, 0, 0, 0.12)',
        'shadow-glow': '0 4px 20px rgba(99, 91, 255, 0.35)',
      },

      /* ============================================
         Container
         ============================================ */
      maxWidth: {
        container: '1200px',
      },

      /* ============================================
         Transitions
         ============================================ */
      transitionDuration: {
        'duration-fast': '150ms',
        'duration-normal': '300ms',
        'duration-slow': '500ms',
      },

      /* ============================================
         Animations & Keyframes
         ============================================ */
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'marquee': 'marquee 40s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
