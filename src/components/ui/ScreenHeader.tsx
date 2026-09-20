import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, spacing, typography, motifs } from '../../theme/theme';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  motif?: string;
  children?: React.ReactNode; // optional stats row / extra content
  compact?: boolean;
};

// Shared gradient header with a gold divider and small cultural motif,
// used across top-level screens for a consistent Gurukul identity.
const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, motif = motifs.diya, children, compact }) => {
  return (
    <LinearGradient colors={gradients.header} style={[styles.header, compact && styles.compact]}>
      <Text style={styles.title}>
        {motif} {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
      <View style={styles.goldRule} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.xxl,
    paddingTop: spacing.xxxl,
  },
  compact: {
    paddingTop: spacing.xxl,
  },
  title: {
    ...typography.display,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.goldSurface,
    marginBottom: spacing.md,
  },
  goldRule: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.gold,
    opacity: 0.7,
  },
});

export default ScreenHeader;
