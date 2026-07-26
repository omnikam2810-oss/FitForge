/**
 * FitForge Design System — Color Palette
 *
 * Light mode: Clean whites with purple/teal accents
 * Dark mode: Deep navy-black, NOT just inverted — deliberately designed
 */

export interface ColorBrand {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface ColorSurface {
  bg: string;
  card: string;
  elevated: string;
}

export interface ColorText {
  primary: string;
  secondary: string;
  muted: string;
  inverse: string;
}

export interface ColorBorder {
  default: string;
  light: string;
}

export interface ColorStatus {
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ColorTheme {
  brand: ColorBrand;
  surface: ColorSurface;
  text: ColorText;
  border: ColorBorder;
  status: ColorStatus;
}

export const lightColors: ColorTheme = {
  brand: {
    primary: '#6C5CE7',    // Electric purple — main CTA, accent
    secondary: '#00CEC9',  // Vibrant teal — success states, progress
    tertiary: '#FD79A8',   // Coral pink — streaks, highlights
  },
  surface: {
    bg: '#F8F9FC',         // Cool off-white — app background
    card: '#FFFFFF',       // Pure white cards
    elevated: '#FFFFFF',   // Modals, bottom sheets
  },
  text: {
    primary: '#1A1D27',    // Near-black with warm undertone
    secondary: '#6B7280',  // Medium gray — captions, labels
    muted: '#9CA3AF',      // Soft gray — disabled, placeholders
    inverse: '#FFFFFF',    // Text on dark/colored backgrounds
  },
  border: {
    default: '#E5E7EB',    // Subtle card borders
    light: '#F3F4F6',      // Ultra-light dividers
  },
  status: {
    success: '#10B981',    // Emerald green
    warning: '#F59E0B',    // Amber
    error: '#EF4444',      // Red
    info: '#6C5CE7',       // Brand purple
  },
};

export const darkColors: ColorTheme = {
  brand: {
    primary: '#A29BFE',    // Lighter purple for contrast on dark
    secondary: '#55EFC4',  // Bright mint green
    tertiary: '#FF7675',   // Soft coral
  },
  surface: {
    bg: '#0D0F14',         // Deep space navy — NOT pure black
    card: '#1A1D27',       // Dark slate cards
    elevated: '#242836',   // Slightly lighter for modals
  },
  text: {
    primary: '#F0F1F5',    // Bright off-white
    secondary: '#9CA3AF',  // Mid-gray
    muted: '#4B5563',      // Dark gray for disabled states
    inverse: '#1A1D27',    // Dark text on light backgrounds
  },
  border: {
    default: '#2D3142',    // Subtle dark border
    light: '#1F2233',      // Ultra-subtle dividers
  },
  status: {
    success: '#34D399',    // Bright emerald
    warning: '#FBBF24',    // Warm amber
    error: '#F87171',      // Soft red
    info: '#A29BFE',       // Brand purple (light variant)
  },
};

/** Gradient presets for premium UI effects */
export const gradients = {
  primary: ['#6C5CE7', '#A29BFE'],
  secondary: ['#00CEC9', '#55EFC4'],
  tertiary: ['#FD79A8', '#FF7675'],
  premium: ['#6C5CE7', '#00CEC9'],
  dark: ['#0D0F14', '#1A1D27'],
  cardShine: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0)'],
} as const;
