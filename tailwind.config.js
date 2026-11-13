/** Brand colours come from CSS variables that src/config/brand.js sets at start-up,
 *  so the colours are changed in ONE place: src/config/brand.js */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--dim-primary)',
        secondary: 'var(--dim-secondary)',
        deep: 'var(--dim-deep)',
        gold: 'var(--dim-gold)',
        'gold-light': 'var(--dim-gold-light)',
        muted: 'var(--dim-muted)',
      },
    },
  },
  plugins: [],
};
