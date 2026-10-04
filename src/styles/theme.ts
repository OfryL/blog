// Colors are CSS custom properties so the palette can switch with the
// system color scheme (see GlobalStyles) without re-rendering the tree.
export const theme = {
  colors: {
    background: 'var(--color-background)',
    surface: 'var(--color-surface)',
    surfaceMuted: 'var(--color-surface-muted)',
    text: 'var(--color-text)',
    textMuted: 'var(--color-text-muted)',
    textLight: 'var(--color-text-light)',
    border: 'var(--color-border)',
    accent: 'var(--color-accent)',
    accentHover: 'var(--color-accent-hover)',
    selectionText: 'var(--color-selection-text)'
  },
  fonts: {
    heading: "'Cormorant Garamond', Georgia, serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace"
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px'
  },
  transitions: {
    default: '0.3s ease'
  }
}

export type Theme = typeof theme
