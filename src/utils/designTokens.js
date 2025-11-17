/**
 * Design Tokens - 2025 Cutting-Edge Design System
 * Centralized design values for consistent, modern UI
 */

// Modern Font Stacks (2025)
export const FONTS = {
  primary: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  display: `'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  mono: `'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Courier New', monospace`,
  system: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
};

// Fluid Typography (clamp for responsive sizing)
export const TYPOGRAPHY = {
  xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
  sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
  base: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
  lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
  xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
  '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
  '3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem)',
  '4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
  '5xl': 'clamp(3rem, 2.5rem + 2.5vw, 4rem)',
};

// Advanced Color Palettes (2025 Trends)
export const COLORS = {
  // Modern Gradients
  gradients: {
    sunset: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #FF6B6B 100%)',
    ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    forest: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
    cosmic: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
    peach: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
    midnight: 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',
    aurora: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
    fire: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',

    // Mesh Gradients (2025 trend)
    mesh: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)',
  },

  // Glassmorphism
  glass: {
    light: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(17, 25, 40, 0.75)',
    backdrop: 'blur(12px) saturate(180%)',
  },
};

// Shadows (2025 - more natural, softer)
export const SHADOWS = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 2px 8px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 2px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 10px 24px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.04)',
  xl: '0 20px 40px -8px rgba(0, 0, 0, 0.12), 0 8px 16px -8px rgba(0, 0, 0, 0.08)',
  '2xl': '0 30px 60px -12px rgba(0, 0, 0, 0.15), 0 12px 24px -12px rgba(0, 0, 0, 0.1)',

  // Colored shadows (2025 trend)
  colored: {
    indigo: '0 8px 24px -4px rgba(99, 102, 241, 0.3)',
    purple: '0 8px 24px -4px rgba(168, 85, 247, 0.3)',
    pink: '0 8px 24px -4px rgba(236, 72, 153, 0.3)',
    blue: '0 8px 24px -4px rgba(59, 130, 246, 0.3)',
  },

  // Neumorphism
  neu: {
    light: '8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.5)',
    dark: '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)',
  },
};

// Border Radius (Modern, softer curves)
export const RADIUS = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  '3xl': '3rem',
  full: '9999px',

  // Special shapes
  blob: '30% 70% 70% 30% / 30% 30% 70% 70%',
};

// Spacing Scale (Extended)
export const SPACING = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
};

// Animation Timings (Natural easing)
export const TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',

  // Spring-based (2025 trend)
  spring: {
    snappy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  },

  // Easing presets
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
};

// Z-Index Scale
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  tooltip: 1400,
  toast: 1500,
};

// Breakpoints (Mobile-first)
export const BREAKPOINTS = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Layout Constraints
export const LAYOUT = {
  maxWidth: {
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
    full: '100%',
  },
};

// CSS Custom Properties Generator
export const getCSSVariables = () => ({
  '--font-primary': FONTS.primary,
  '--font-display': FONTS.display,
  '--shadow-sm': SHADOWS.sm,
  '--shadow-md': SHADOWS.md,
  '--shadow-lg': SHADOWS.lg,
  '--transition-base': TRANSITIONS.base,
  '--radius-md': RADIUS.md,
  '--radius-lg': RADIUS.lg,
});

export default {
  FONTS,
  TYPOGRAPHY,
  COLORS,
  SHADOWS,
  RADIUS,
  SPACING,
  TRANSITIONS,
  Z_INDEX,
  BREAKPOINTS,
  LAYOUT,
  getCSSVariables,
};
