import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400&display=swap');

  :root {
    color-scheme: light dark;

    --color-background: #fafaf8;
    --color-surface: #ffffff;
    --color-surface-muted: #f3f1ee;
    --color-text: #2c2c2c;
    --color-text-muted: #6b6b6b;
    --color-text-light: #8a8a8a;
    --color-border: #e8e6e3;
    --color-accent: #a39382;
    --color-accent-hover: #8b7d6e;
    --color-selection-text: #ffffff;
    --image-filter: grayscale(20%) contrast(0.95);
    --image-filter-hover: grayscale(0%) contrast(1);
  }

  /* Follows the system setting, same as ofry.net */
  @media (prefers-color-scheme: dark) {
    :root {
      --color-background: #000000;
      --color-surface: #0c0c0c;
      --color-surface-muted: rgba(255, 255, 255, 0.06);
      --color-text: #f5f5f7;
      --color-text-muted: #a1a1a6;
      --color-text-light: #6e6e73;
      --color-border: rgba(255, 255, 255, 0.1);
      --color-accent: #c4b5a5;
      --color-accent-hover: #ddd1c4;
      --color-selection-text: #1d1d1f;
      --image-filter: grayscale(20%) contrast(0.95) brightness(0.85);
      --image-filter-hover: grayscale(0%) contrast(1) brightness(1);
    }
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-weight: 300;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.7;
    letter-spacing: 0.01em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color ${({ theme }) => theme.transitions.default}, color ${({ theme }) => theme.transitions.default};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 400;
    line-height: 1.3;
    letter-spacing: 0.02em;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.default};
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.selectionText};
  }
`
