import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import ResultBlock from './ResultBlock';
import { bmSizes } from './tokens';
import { useSlideTogether, usePulse } from '../../hooks/useAnimationPrimitives';
import { playSound } from '../../services/soundService';

type Props = {
  leftText: string;
  rightText: string;
  finalText: string;
  /** Starts the slide + snap when true. */
  merging: boolean;
  /** Keeps the merged answer pulsing (celebrate phase). */
  celebrating?: boolean;
  reducedMotion?: boolean;
  labels: { left: string; right: string; final: string };
  onMergeComplete?: () => void;
  testID?: string;
};

const TRAVEL = 40;

/** Slides the left and right result blocks together and snaps them into the final answer. */
const MergeBlocks: React.FC<Props> = ({
  leftText,
  rightText,
  finalText,
  merging,
  celebrating = false,
  reducedMotion = false,
  labels,
  onMergeComplete,
  testID,
}) => {
  const { progress, play, reset } = useSlideTogether(reducedMotion);
  const [snapped, setSnapped] = useState(false);
  const pulse = usePulse(celebrating, reducedMotion);

  useEffect(() => {
    if (!merging) {
      setSnapped(false);
      reset();
      return;
    }
    play(() => {
      setSnapped(true);
      playSound('chime');
      onMergeComplete?.();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merging]);

  if (snapped) {
    return (
      <Animated.View testID={testID} style={[styles.row, pulse.style]}>
        <ResultBlock side="final" value={finalText} accessibleLabel={labels.final} testID="bm-final-block" />
      </Animated.View>
    );
  }

  const slideIn = (direction: 1 | -1) => ({
    transform: [
      {
        translateX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [direction * TRAVEL, 0],
        }),
      },
    ],
  });

  return (
    <View testID={testID} style={styles.row}>
      <ResultBlock
        side="left"
        value={leftText}
        accessibleLabel={labels.left}
        style={slideIn(-1)}
        testID="bm-left-block"
      />
      <View style={styles.gap} />
      <ResultBlock
        side="right"
        value={rightText}
        accessibleLabel={labels.right}
        style={slideIn(1)}
        testID="bm-right-block"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gap: {
    width: bmSizes.gap,
  },
});

export default MergeBlocks;
