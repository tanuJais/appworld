import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { bmColors, bmSizes } from './tokens';
import { useBubbleTransfer, useFloatUp } from '../../hooks/useAnimationPrimitives';
import { formatDeviation } from '../../utils/baseMultiplication';

type Props = {
  deviation: number;
  visible: boolean;
  /** When set, the bubble travels this many px horizontally (right -> left transfer). */
  transferDistance?: number;
  transferring?: boolean;
  reducedMotion?: boolean;
  accessibleLabel: string;
  onFloatComplete?: () => void;
  onTransferComplete?: () => void;
  testID?: string;
};

/** Floating bubble showing how far a number sits from the base (e.g. -2, -3, +4). */
const StepBubble: React.FC<Props> = ({
  deviation,
  visible,
  transferDistance = 0,
  transferring = false,
  reducedMotion = false,
  accessibleLabel,
  onFloatComplete,
  onTransferComplete,
  testID,
}) => {
  const float = useFloatUp(reducedMotion);
  const transfer = useBubbleTransfer(transferDistance, reducedMotion);

  useEffect(() => {
    if (visible) float.play(onFloatComplete);
    else float.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (transferring) transfer.play(onTransferComplete);
    else transfer.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferring]);

  if (!visible) return null;

  const positive = deviation > 0;

  return (
    <Animated.View
      testID={testID}
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibleLabel}
      style={[
        styles.bubble,
        { backgroundColor: positive ? bmColors.bubblePositive : bmColors.bubbleNegative },
        float.style,
        transfer.style,
      ]}
    >
      <Text
        allowFontScaling
        adjustsFontSizeToFit
        numberOfLines={1}
        style={[styles.text, { color: positive ? bmColors.bubblePositiveText : bmColors.bubbleNegativeText }]}
      >
        {formatDeviation(deviation)}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    minWidth: bmSizes.bubbleDiameter,
    height: bmSizes.bubbleDiameter,
    paddingHorizontal: 10,
    borderRadius: bmSizes.bubbleDiameter / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: bmSizes.bubbleFontSize,
    fontWeight: '800',
  },
});

export default StepBubble;
