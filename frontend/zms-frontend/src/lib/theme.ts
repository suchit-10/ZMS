// Zoo Management System Theme Constants
// This file maintains consistent colors, fonts, and design tokens across the application

export const ZMS_COLORS = {
  // Primary Zoo Green Theme (matching Login page)
  primary: {
    50: '#eaf6ef',    // Very light green background
    100: '#d4edda',   // Light green
    200: '#c3e6cb',   // Lighter green
    300: '#b1dfbb',   // Medium light green
    400: '#86c999',   // Medium green
    500: '#1b6e3a',   // Main green (Login buttons)
    600: '#145a2e',   // Darker green (hover states)
    700: '#0f4722',   // Very dark green
    800: '#0a3417',   // Darkest green
    900: '#06210e',   // Almost black green
  },
  
  // Professional UI Colors
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5', 
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  
  // Background Colors
  background: {
    light: '#f8fff8',      // Light background from Login
    main: '#ffffff',       // Main white
    dark: '#f3f7f4',       // Darker shade of Login background
    darker: '#e6f4e6',     // Even darker (for main app background)
  },
  
  // Text Colors
  text: {
    primary: '#111827',    // Dark gray for headers
    secondary: '#6b7280',  // Medium gray for body text
    muted: '#9ca3af',      // Light gray for hints
    white: '#ffffff',
  },
  
  // Status Colors
  status: {
    success: '#10b981',
    warning: '#f59e0b', 
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Border Colors
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
    dark: '#9ca3af',
  }
} as const

export const ZMS_FONTS = {
  // Font family matching Login page
  primary: '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  
  // Font weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
} as const

export const ZMS_SPACING = {
  // Common spacing values
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const

export const ZMS_SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const

export const ZMS_RADIUS = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
} as const

// Component-specific theme styles
export const ZMS_COMPONENTS = {
  button: {
    primary: `bg-[${ZMS_COLORS.primary[500]}] hover:bg-[${ZMS_COLORS.primary[600]}] text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[${ZMS_COLORS.primary[500]}] focus:ring-offset-2`,
    secondary: `bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[${ZMS_COLORS.primary[500]}] focus:ring-offset-2`,
    danger: `bg-red-600 hover:bg-red-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`,
  },
  
  input: {
    base: `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[${ZMS_COLORS.primary[500]}] focus:border-transparent`,
    error: `w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`,
  },
  
  card: {
    base: 'bg-white rounded-lg shadow-sm border border-gray-200',
    hover: 'bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow',
  },
  
  sidebar: {
    background: ZMS_COLORS.background.darker,
    activeItem: `bg-[${ZMS_COLORS.primary[50]}] text-[${ZMS_COLORS.primary[700]}] border-r-2 border-[${ZMS_COLORS.primary[500]}]`,
    hoverItem: `hover:bg-[${ZMS_COLORS.primary[50]}] hover:text-[${ZMS_COLORS.primary[600]}]`,
  }
} as const

export default {
  ZMS_COLORS,
  ZMS_FONTS,
  ZMS_SPACING,
  ZMS_SHADOWS,
  ZMS_RADIUS,
  ZMS_COMPONENTS,
}
