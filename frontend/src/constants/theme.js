export const COLORS = {
  // Navy Blue Palette (Primary Brand)
  primary: '#0F172A',      // Slate 900 - Deep Navy
  primaryDark: '#0A0F1D',  // Header / Top background
  primaryLight: '#1E293B', // Slate 800 - Secondary dark card
  accent: '#2563EB',       // Blue 600 - Action buttons / Links
  accentLight: '#3B82F6',  // Blue 500
  accentSoft: '#EFF6FF',   // Very light blue for chips

  // Greens for Settlements & Positive Balance
  success: '#10B981',      // Emerald 500
  successDark: '#059669',  // Emerald 600
  successLight: '#D1FAE5', // Emerald 100 - Pill background
  successBorder: '#A7F3D0',

  // Alert & Danger
  danger: '#EF4444',       // Red 500
  dangerLight: '#FEE2E2',  // Red 100
  warning: '#F59E0B',      // Amber 500
  warningLight: '#FEF3C7', // Amber 100

  // Background & Surfaces
  background: '#F8FAFC',   // Slate 50 - Very clean light grey
  cardBg: '#FFFFFF',       // Pure white for cards
  cardHover: '#F1F5F9',    // Slate 100
  border: '#E2E8F0',       // Slate 200
  borderLight: '#F1F5F9',

  // Typography
  textPrimary: '#0F172A',  // Main headings / titles
  textSecondary: '#475569',// Subtext / labels
  textMuted: '#94A3B8',    // Placeholder / small hints
  textWhite: '#FFFFFF',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SHADOWS = {
  small: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  floating: {
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};
