import React, { useMemo } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types';
import { colors, gradients, spacing, typography } from '../theme/theme';
import { getStrings } from '../i18n/baseMultiplicationStrings';
import BaseMultiplicationLesson from '../components/baseMultiplication/BaseMultiplicationLesson';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'BaseMultiplication'>;
  route: RouteProp<RootStackParamList, 'BaseMultiplication'>;
};

const DEFAULT_EXAMPLE = { leftValue: 98, rightValue: 97, base: 100 };

/** Full-screen host for the animated Nikhilam walkthrough. */
const BaseMultiplicationScreen: React.FC<Props> = ({ route }) => {
  const { leftValue, rightValue, base } = { ...DEFAULT_EXAMPLE, ...(route.params ?? {}) };
  const strings = useMemo(() => getStrings('en'), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={gradients.header} style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            🪔 {strings.screenTitle}
          </Text>
          <Text style={styles.subtitle}>
            {leftValue} × {rightValue}
          </Text>
          <Text style={styles.sutra}>{strings.sutraName}</Text>
        </LinearGradient>

        <View style={styles.content}>
          <BaseMultiplicationLesson leftValue={leftValue} rightValue={rightValue} base={base} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    ...Platform.select({ web: { maxHeight: '100vh' as unknown as number } }),
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  header: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    color: colors.textInverse,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.heading,
    color: colors.textInverse,
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  sutra: {
    ...typography.caption,
    color: colors.goldLight,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  content: {
    padding: spacing.xl,
  },
});

export default BaseMultiplicationScreen;
