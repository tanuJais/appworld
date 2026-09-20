import { Platform } from 'react-native';

// Central design system for the "Gurukul" visual identity —
// warm terracotta + turmeric gold palette inspired by traditional Indian learning spaces.

export const colors = {
  // Brand — terracotta / kumkum red (deepened from the original brand color)
  primary: '#8A2B0C',
  primaryDark: '#5C1A0A',
  primaryLight: '#C2410C',

  // Accent — turmeric / marigold gold, used for highlights, streaks, mastery
  gold: '#D4A017',
  goldLight: '#F4C430',
  goldSurface: '#FDF0D5',

  // Accent — peacock teal, used sparingly for secondary actions
  teal: '#0F766E',
  tealSurface: '#E6F5F3',

  // Surfaces
  background: '#FFF8F0', // sandalwood cream
  surface: '#FFFFFF',
  surfaceAlt: '#FFF1E0', // light cream card fill
  surfaceMuted: '#FBEAD9',
  border: '#EADFC8',

  // Text
  textPrimary: '#2B1810',
  textSecondary: '#6B4F3F',
  textMuted: '#9B8577',
  textInverse: '#FFFFFF',

  // Semantic
  success: '#0F8A5F',
  successSurface: '#D9F3E4',
  error: '#C0392B',
  errorSurface: '#FBE1DE',
  warning: '#B45309',
  warningSurface: '#FDECC8',

  // Difficulty scale
  easy: '#0F8A5F',
  easySurface: '#D9F3E4',
  medium: '#B45309',
  mediumSurface: '#FDECC8',
  hard: '#C2410C',
  hardSurface: '#FBDCC4',
  expert: '#9D174D',
  expertSurface: '#FADCE8',
};

export const gradients = {
  header: ['#5C1A0A', '#8A2B0C', '#C2410C'] as const,
  gold: ['#F4C430', '#D4A017'] as const,
  teal: ['#14B8A6', '#0F766E'] as const,
  success: ['#34D399', '#0F8A5F'] as const,
  danger: ['#EF4444', '#C0392B'] as const,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const shadow = {
  card: Platform.select({
    web: { boxShadow: '0px 3px 8px rgba(58, 31, 15, 0.08)' },
    default: {
      shadowColor: '#3A1F0F',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
  }),
  raised: Platform.select({
    web: { boxShadow: '0px 6px 14px rgba(58, 31, 15, 0.14)' },
    default: {
      shadowColor: '#3A1F0F',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 14,
      elevation: 6,
    },
  }),
};

export const typography = {
  display: { fontSize: 28, fontWeight: '800' as const, letterSpacing: 0.2 },
  title: { fontSize: 22, fontWeight: '800' as const },
  heading: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  label: { fontSize: 13, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
};

// Small decorative motifs used across headers/cards to reinforce the gurukul theme
export const motifs = {
  om: '🕉️',
  diya: '🪔',
  lotus: '🌸',
  trophy: '🏆',
};

// Special avatar tokens rendered as the custom Gurukul student icon instead of an emoji
export const gurukulAvatars = {
  boy: 'gurukul_boy',
  girl: 'gurukul_girl',
} as const;

const theme = { colors, gradients, radii, spacing, shadow, typography, motifs, gurukulAvatars };

export default theme;
