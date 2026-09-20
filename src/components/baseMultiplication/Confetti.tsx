import React, { useEffect, useMemo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { bmColors } from './tokens';
import { useConfettiBurst } from '../../hooks/useAnimationPrimitives';

type Props = {
  active: boolean;
  reducedMotion?: boolean;
  pieceCount?: number;
  onComplete?: () => void;
  testID?: string;
};

type Piece = { x: number; drift: number; rotate: number; color: string; delay: number; size: number };

function buildPieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    x: (i / count) * 320 - 160,
    drift: (i % 2 === 0 ? 1 : -1) * (20 + (i * 7) % 60),
    rotate: (i % 2 === 0 ? 1 : -1) * (180 + (i * 23) % 180),
    color: bmColors.confetti[i % bmColors.confetti.length],
    delay: (i % 5) * 0.06,
    size: 8 + (i % 3) * 4,
  }));
}

/** Lightweight confetti burst — falls back to a handful of pieces when motion is reduced. */
const Confetti: React.FC<Props> = ({ active, reducedMotion = false, pieceCount = 24, onComplete, testID }) => {
  const { progress, play, reset } = useConfettiBurst(reducedMotion);
  const count = reducedMotion ? Math.min(6, pieceCount) : pieceCount;
  const pieces = useMemo(() => buildPieces(count), [count]);

  useEffect(() => {
    if (active) play(onComplete);
    else reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <View testID={testID} style={[styles.layer, styles.noPointerEvents]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {pieces.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.piece,
            {
              width: p.size,
              height: p.size * 1.6,
              backgroundColor: p.color,
              opacity: progress.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
              transform: [
                { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [p.x, p.x + p.drift] }) },
                { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 260] }) },
                { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.rotate}deg`] }) },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
  piece: {
    position: 'absolute',
    top: 0,
    borderRadius: 2,
  },
});

export default Confetti;
