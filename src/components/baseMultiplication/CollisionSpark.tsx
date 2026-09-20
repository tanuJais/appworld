import React, { useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { bmColors } from './tokens';
import { useCollisionSpark } from '../../hooks/useAnimationPrimitives';
import { playSound } from '../../services/soundService';

type Props = {
  active: boolean;
  reducedMotion?: boolean;
  onComplete?: () => void;
  testID?: string;
};

const RAYS = 8;

/** Spark burst played when the two deviation bubbles collide. */
const CollisionSpark: React.FC<Props> = ({ active, reducedMotion = false, onComplete, testID }) => {
  const { style, play, reset } = useCollisionSpark(reducedMotion);

  useEffect(() => {
    if (active) {
      playSound('spark');
      play(onComplete);
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <Animated.View
      testID={testID}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.layer, styles.noPointerEvents, style]}
    >
      <Svg width={80} height={80} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="14" fill={bmColors.spark} opacity={0.9} />
        {Array.from({ length: RAYS }, (_, i) => {
          const angle = (i / RAYS) * Math.PI * 2;
          return (
            <Line
              key={i}
              x1={50 + Math.cos(angle) * 20}
              y1={50 + Math.sin(angle) * 20}
              x2={50 + Math.cos(angle) * 42}
              y2={50 + Math.sin(angle) * 42}
              stroke={bmColors.spark}
              strokeWidth="6"
              strokeLinecap="round"
            />
          );
        })}
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
});

export default CollisionSpark;
