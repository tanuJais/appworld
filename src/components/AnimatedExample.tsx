import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, radii, shadow, spacing } from '../theme/theme';
import ChalkboardStep from './ChalkboardStep';
import VedicCrosswiseGrid from './VedicCrosswiseGrid';
import { detectVerticalCrosswise } from '../utils/parseStepVisual';

type AnimatedExampleProps = {
  index: number;
  problem: string;
  steps: string[];
  solution: string;
};

const STEP_STAGGER_MS = 900;
const STEP_DURATION_MS = 800;

// Reveals a worked example one step at a time so learners can follow the reasoning visually,
// instead of seeing the full solution at once.
const AnimatedExample: React.FC<AnimatedExampleProps> = ({ index, problem, steps, solution }) => {
  const problemAnim = useMemo(() => new Animated.Value(0), [problem]);
  const stepAnims = useMemo(() => steps.map(() => new Animated.Value(0)), [steps]);
  const solutionAnim = useMemo(() => new Animated.Value(0), [problem]);
  const [isPlaying, setIsPlaying] = useState(false);
  const crosswise = useMemo(() => detectVerticalCrosswise(problem, steps), [problem, steps]);

  const play = () => {
    setIsPlaying(true);
    problemAnim.setValue(0);
    stepAnims.forEach(a => a.setValue(0));
    solutionAnim.setValue(0);

    Animated.sequence([
      Animated.timing(problemAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.stagger(
        STEP_STAGGER_MS,
        stepAnims.map(a => Animated.timing(a, { toValue: 1, duration: STEP_DURATION_MS, useNativeDriver: true }))
      ),
      Animated.spring(solutionAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start(() => setIsPlaying(false));
  };

  useEffect(() => {
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.exampleNumber}>Example {index + 1}</Text>
        <TouchableOpacity onPress={play} disabled={isPlaying} style={styles.playButton} activeOpacity={0.7}>
          <Text style={styles.playButtonText}>{isPlaying ? '▶ Playing…' : '▶ Replay'}</Text>
        </TouchableOpacity>
      </View>

      {!crosswise && (
        <Animated.Text
          style={[
            styles.problem,
            {
              opacity: problemAnim,
              transform: [{ scale: problemAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
            },
          ]}
        >
          {problem}
        </Animated.Text>
      )}

      {crosswise ? (
        <VedicCrosswiseGrid a={crosswise.a} b={crosswise.b} captions={steps} anims={stepAnims} />
      ) : (
        <View style={styles.stepsContainer}>
          {steps.map((step, i) => (
            <Animated.View
              key={i}
              style={[
                styles.stepRow,
                {
                  opacity: stepAnims[i],
                  transform: [
                    { translateX: stepAnims[i].interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) },
                  ],
                },
              ]}
            >
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <ChalkboardStep step={step} anim={stepAnims[i]} />
            </Animated.View>
          ))}
        </View>
      )}

      <Animated.View
        style={[
          styles.solutionBox,
          {
            opacity: solutionAnim,
            transform: [{ scale: solutionAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
          },
        ]}
      >
        <Text style={styles.solutionLabel}>Answer:</Text>
        <Text style={styles.solution}>{solution}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exampleNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  playButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
  },
  playButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  problem: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 15,
  },
  stepsContainer: {
    marginVertical: 15,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: 'bold',
  },
  solutionBox: {
    backgroundColor: colors.successSurface,
    padding: 15,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solutionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.success,
    marginRight: 10,
  },
  solution: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.success,
  },
});

export default AnimatedExample;
