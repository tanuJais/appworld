import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/theme';

type Variant = 'primary' | 'secondary' | 'gold' | 'muted' | 'danger';

type ButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: Variant;
  size?: 'md' | 'lg';
};

const VARIANT_STYLES: Record<Variant, { bg: string; text: string }> = {
  primary: { bg: colors.primary, text: colors.textInverse },
  secondary: { bg: colors.teal, text: colors.textInverse },
  gold: { bg: colors.gold, text: colors.primaryDark },
  muted: { bg: colors.surfaceMuted, text: colors.textSecondary },
  danger: { bg: colors.error, text: colors.textInverse },
};

const Button: React.FC<ButtonProps> = ({ label, variant = 'primary', size = 'md', style, ...rest }) => {
  const v = VARIANT_STYLES[variant];
  return (
    <TouchableOpacity
      style={[styles.base, { backgroundColor: v.bg }, size === 'lg' && styles.lg, style]}
      activeOpacity={0.8}
      {...rest}
    >
      <Text style={[styles.label, { color: v.text }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lg: {
    paddingVertical: spacing.xl,
  },
  label: {
    ...typography.heading,
  },
});

export default Button;
