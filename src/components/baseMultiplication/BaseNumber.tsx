import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { bmColors, bmSizes } from './tokens';
import { useHopIn } from '../../hooks/useAnimationPrimitives';

type Props = {
  base: number;
  visible: boolean;
  reducedMotion?: boolean;
  accessibleLabel: string;
  onEntranceComplete?: () => void;
  testID?: string;
};

/** The anchor icon the learner measures both numbers against (100, 1000, ...). */
const BaseNumber: React.FC<Props> = ({
  base,
  visible,
  reducedMotion = false,
  accessibleLabel,
  onEntranceComplete,
  testID,
}) => {
  const { style, play, reset } = useHopIn(reducedMotion);

  useEffect(() => {
    if (visible) play(onEntranceComplete);
    else reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, base]);

  if (!visible) return null;

  const d = bmSizes.baseDiameter;

  return (
    <Animated.View
      testID={testID}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibleLabel}
      style={[styles.wrapper, style]}
    >
      <Svg width={d} height={d} viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
        <Circle cx="50" cy="50" r="46" fill={bmColors.baseFill} stroke={bmColors.baseStroke} strokeWidth="4" strokeDasharray="8 6" />
      </Svg>
      <Text allowFontScaling adjustsFontSizeToFit numberOfLines={1} style={styles.text}>
        {base}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: bmSizes.baseDiameter,
    height: bmSizes.baseDiameter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: bmSizes.baseFontSize,
    fontWeight: '800',
    color: bmColors.baseText,
  },
});

export default BaseNumber;
