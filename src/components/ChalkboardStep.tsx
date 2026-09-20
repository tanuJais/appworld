import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, radii, spacing } from '../theme/theme';
import { parseStepVisual } from '../utils/parseStepVisual';

type ChalkboardStepProps = {
  step: string;
  anim: Animated.Value; // 0 -> 1, drives the whole reveal for this step
};

// Renders a step as a small "slate" worked-equation (numbers appearing/crossing out live)
// when the text contains a clear rounding or arithmetic pattern, so students watch the
// numbers change instead of only reading a description — like a teacher working it out on a board.
const ChalkboardStep: React.FC<ChalkboardStepProps> = ({ step, anim }) => {
  const visual = parseStepVisual(step);

  if (visual.type === 'round') {
    const strikeWidth = anim.interpolate({
      inputRange: [0, 0.3, 0.55, 1],
      outputRange: ['0%', '0%', '100%', '100%'],
    });
    const arrowOpacity = anim.interpolate({ inputRange: [0, 0.45, 0.65, 1], outputRange: [0, 0, 1, 1] });
    const toOpacity = anim.interpolate({ inputRange: [0, 0.65, 1], outputRange: [0, 0, 1] });
    const toScale = anim.interpolate({ inputRange: [0, 0.65, 0.85, 1], outputRange: [0.5, 0.5, 1.15, 1] });

    return (
      <View style={styles.container}>
        <View style={styles.board}>
          <View style={styles.numberWrap}>
            <Text style={styles.boardNumber}>{visual.from}</Text>
            <Animated.View style={[styles.strike, { width: strikeWidth }]} />
          </View>
          <Animated.View style={[styles.arrowRow, { opacity: arrowOpacity }]}>
            <Text style={styles.badge}>{visual.delta}</Text>
            <Text style={styles.arrow}>→</Text>
          </Animated.View>
          <Animated.Text
            style={[styles.boardNumber, styles.boardResult, { opacity: toOpacity, transform: [{ scale: toScale }] }]}
          >
            {visual.to}
          </Animated.Text>
        </View>
        <Text style={styles.caption}>{visual.caption}</Text>
      </View>
    );
  }

  if (visual.type === 'cross') {
    const pair1Opacity = anim.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 1, 1] });
    const product1Opacity = anim.interpolate({ inputRange: [0, 0.25, 0.4, 1], outputRange: [0, 0, 1, 1] });
    const product1Scale = anim.interpolate({ inputRange: [0, 0.25, 0.4, 1], outputRange: [0.5, 0.5, 1.15, 1] });
    const pair2Opacity = anim.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0, 1, 1] });
    const product2Opacity = anim.interpolate({ inputRange: [0, 0.6, 0.75, 1], outputRange: [0, 0, 1, 1] });
    const product2Scale = anim.interpolate({ inputRange: [0, 0.6, 0.75, 1], outputRange: [0.5, 0.5, 1.15, 1] });
    const sumOpacity = anim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0, 0, 1] });
    const resultScale = anim.interpolate({ inputRange: [0, 0.8, 0.95, 1], outputRange: [0.5, 0.5, 1.15, 1] });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.crossRow, { opacity: pair1Opacity }]}>
          <Text style={styles.boardNumber}>{visual.a1}</Text>
          <Text style={styles.crossArrow}>↘</Text>
          <Text style={styles.boardNumber}>{visual.a2}</Text>
          <Text style={styles.operator}>=</Text>
          <Animated.Text
            style={[styles.boardNumber, styles.boardResult, { opacity: product1Opacity, transform: [{ scale: product1Scale }] }]}
          >
            {visual.aProduct}
          </Animated.Text>
        </Animated.View>
        <Animated.View style={[styles.crossRow, { opacity: pair2Opacity }]}>
          <Text style={styles.boardNumber}>{visual.b1}</Text>
          <Text style={styles.crossArrow}>↙</Text>
          <Text style={styles.boardNumber}>{visual.b2}</Text>
          <Text style={styles.operator}>=</Text>
          <Animated.Text
            style={[styles.boardNumber, styles.boardResult, { opacity: product2Opacity, transform: [{ scale: product2Scale }] }]}
          >
            {visual.bProduct}
          </Animated.Text>
        </Animated.View>
        <Animated.View style={[styles.crossRow, styles.crossSumRow, { opacity: sumOpacity }]}>
          <Text style={styles.boardNumber}>{visual.aProduct}</Text>
          <Text style={styles.operator}>+</Text>
          <Text style={styles.boardNumber}>{visual.bProduct}</Text>
          <Text style={styles.operator}>=</Text>
          <Animated.Text style={[styles.boardNumber, styles.boardResult, { transform: [{ scale: resultScale }] }]}>
            {visual.result}
          </Animated.Text>
        </Animated.View>
        <Text style={styles.caption}>{visual.caption}</Text>
      </View>
    );
  }

  if (visual.type === 'combine') {
    const partsOpacity = anim.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 1, 1] });
    const resultOpacity = anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0, 1] });
    const resultScale = anim.interpolate({ inputRange: [0, 0.6, 0.8, 1], outputRange: [0.5, 0.5, 1.15, 1] });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.board, { opacity: partsOpacity }]}>
          {visual.parts.map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Text style={styles.operator}>|</Text>}
              <Text style={styles.boardNumber}>{part}</Text>
            </React.Fragment>
          ))}
          <Text style={styles.arrow}>→</Text>
          <Animated.Text
            style={[
              styles.boardNumber,
              styles.boardResult,
              { opacity: resultOpacity, transform: [{ scale: resultScale }] },
            ]}
          >
            {visual.result}
          </Animated.Text>
        </Animated.View>
        <Text style={styles.caption}>{visual.caption}</Text>
      </View>
    );
  }

  if (visual.type === 'square') {
    const baseOpacity = anim.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 1, 1] });
    const resultOpacity = anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0, 1] });
    const resultScale = anim.interpolate({ inputRange: [0, 0.6, 0.8, 1], outputRange: [0.5, 0.5, 1.15, 1] });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.board, { opacity: baseOpacity }]}>
          <Text style={styles.boardNumber}>{visual.base}²</Text>
          <Text style={styles.operator}>=</Text>
          <Animated.Text
            style={[
              styles.boardNumber,
              styles.boardResult,
              { opacity: resultOpacity, transform: [{ scale: resultScale }] },
            ]}
          >
            {visual.result}
          </Animated.Text>
        </Animated.View>
        <Text style={styles.caption}>{visual.caption}</Text>
      </View>
    );
  }

  if (visual.type === 'equation') {
    const partsOpacity = anim.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 1] });
    const resultOpacity = anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0, 1] });
    const resultScale = anim.interpolate({ inputRange: [0, 0.6, 0.8, 1], outputRange: [0.5, 0.5, 1.15, 1] });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.board, { opacity: partsOpacity }]}>
          <Text style={styles.boardNumber}>{visual.left}</Text>
          <Text style={styles.operator}>{visual.operator}</Text>
          <Text style={styles.boardNumber}>{visual.right}</Text>
          <Text style={styles.operator}>=</Text>
          <Animated.Text
            style={[
              styles.boardNumber,
              styles.boardResult,
              { opacity: resultOpacity, transform: [{ scale: resultScale }] },
            ]}
          >
            {visual.result}
          </Animated.Text>
        </Animated.View>
        <Text style={styles.caption}>{visual.caption}</Text>
      </View>
    );
  }

  return <Text style={styles.plainText}>{visual.caption}</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.gold,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
    gap: 8,
  },
  numberWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  boardResult: {
    color: colors.primary,
  },
  strike: {
    position: 'absolute',
    top: '48%',
    height: 2,
    backgroundColor: colors.error,
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  crossRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.gold,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 6,
    gap: 8,
  },
  crossSumRow: {
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  crossArrow: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    backgroundColor: colors.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.pill,
    marginRight: 2,
    overflow: 'hidden',
  },
  arrow: {
    fontSize: 20,
    color: colors.primary,
  },
  operator: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginHorizontal: 2,
  },
  caption: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  plainText: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    paddingTop: 3,
  },
});

export default ChalkboardStep;
