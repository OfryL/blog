export const theme = {
  colors: {
    background: '#fafaf8',
    surface: '#ffffff',
    text: '#2c2c2c',
    textMuted: '#6b6b6b',
    textLight: '#8a8a8a',
    border: '#e8e6e3',
    accent: '#a39382',
    accentHover: '#8b7d6e'
  },
  fonts: {
    heading: "'Cormorant Garamond', Georgia, serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
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
