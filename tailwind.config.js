/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['clamp(1.75rem, 3vw, 2.6rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-hero': ['clamp(2.35rem, 4.8vw, 4.5rem)', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
      },
      spacing: {
        section: 'clamp(1.5rem, 2.5vw, 2.25rem)',
      },
      maxWidth: {
        shell: '76rem',
      },
      colors: {
        canvas: 'rgb(var(--bg) / <alpha-value>)',
        'canvas-2': 'rgb(var(--bg-secondary) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        elevated: 'rgb(var(--surface-elevated) / <alpha-value>)',
        ink: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--text-secondary) / <alpha-value>)',
        faint: 'rgb(var(--text-muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-2': 'rgb(var(--accent-secondary) / <alpha-value>)',
        line: 'rgb(var(--border) / <alpha-value>)',
        ok: 'rgb(var(--success) / <alpha-value>)',
        danger: 'rgb(var(--error) / <alpha-value>)',
        signal: 'rgb(var(--signal) / <alpha-value>)',
        'on-accent': 'rgb(var(--accent-contrast) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
