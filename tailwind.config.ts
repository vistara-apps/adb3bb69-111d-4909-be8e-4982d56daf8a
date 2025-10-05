import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        fg: 'var(--color-fg)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        surface: 'var(--color-surface)',
        'surface-hover': 'var(--color-surface-hover)',
        border: 'var(--color-border)',
        'text-muted': 'var(--color-text-muted)',
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
        'danger-hover': 'var(--color-danger-hover)',
        warning: 'var(--color-warning)',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 8px 24px hsla(220, 13%, 5%, 0.4)',
        button: '0 4px 12px hsla(221, 83%, 53%, 0.3)',
        overlay: '0 16px 48px hsla(220, 13%, 5%, 0.6)',
      },
    },
  },
  plugins: [],
};

export default config;
