export const COLORS = {
  // Deep Midnight Navy Palette (Executive / Premium Brand)
  primary: '#0B132B',       // Deepest Navy
  primaryDark: '#070B19',   // Header / StatusBar background
  primaryCard: '#1C2541',   // Card surface for dark cards
  primaryBorder: '#2E3A59', // Border for dark elements
  
  // Electric & Royal Blue Accents
  accent: '#2563EB',        // Royal Blue 600
  accentLight: '#3B82F6',   // Blue 500
  accentGlow: '#60A5FA',    // Light Blue for highlights
  accentSoft: '#EFF6FF',    // Ultra-light blue tint
  accentBorder: '#BFDBFE',

  // Emerald Greens for Settlements & Success
  success: '#10B981',       // Emerald 500
  successDark: '#059669',   // Emerald 600
  successLight: '#ECFDF5',  // Emerald 50
  successBorder: '#A7F3D0', // Emerald 200
  successText: '#065F46',

  // Coral & Amber Alerts
  danger: '#EF4444',        // Red 500
  dangerLight: '#FEF2F2',   // Red 50
  dangerBorder: '#FECACA',
  warning: '#F59E0B',       // Amber 500
  warningLight: '#FFFBEB',  // Amber 50
  warningBorder: '#FDE68A',

  // Clean Surfaces & Backgrounds
  background: '#F8FAFC',    // Slate 50 - Ultra clean light background
  cardBg: '#FFFFFF',        // Pure white for content cards
  cardHover: '#F1F5F9',     // Slate 100
  border: '#E2E8F0',        // Slate 200 - Subtle card border
  borderLight: '#F1F5F9',   // Slate 100

  // Modern Typography
  textPrimary: '#0F172A',   // Slate 900 - High contrast text
  textSecondary: '#475569', // Slate 600 - Secondary text
  textMuted: '#94A3B8',     // Slate 400 - Muted / hints
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

export const SHADOWS = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  floatingCard: {
    shadowColor: '#0A0F1D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  fab: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
};
