import React from 'react';
import { Animated, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { bmColors, bmSizes } from './tokens';

type Props = {
  value: string | number;
  side: 'left' | 'right' | 'final';
  caption?: string;
  accessibleLabel: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** A rounded slab holding one half of the answer (or the merged final answer). */
const ResultBlock: React.FC<Props> = ({ value, side, caption, accessibleLabel, style, testID }) => {
  const isFinal = side === 'final';
  return (
    <Animated.View
      testID={testID}
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibleLabel}
      style={[
        styles.block,
        {
          backgroundColor: isFinal
            ? bmColors.finalFill
            : side === 'left'
              ? bmColors.blockLeftFill
              : bmColors.blockRightFill,
        },
        style,
      ]}
    >
      <Text
        allowFontScaling
        adjustsFontSizeToFit
        numberOfLines={1}
        style={[
          styles.value,
          isFinal && styles.finalValue,
          { color: isFinal ? bmColors.finalText : bmColors.blockText },
        ]}
      >
        {value}
      </Text>
      {caption ? (
        <Text allowFontScaling style={[styles.caption, { color: isFinal ? bmColors.finalText : bmColors.blockText }]}>
          {caption}
        </Text>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  block: {
    minWidth: 96,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: bmSizes.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: bmSizes.blockFontSize,
    fontWeight: '800',
    letterSpacing: 1,
  },
  finalValue: {
    fontSize: bmSizes.finalFontSize,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    opacity: 0.85,
  },
});

export default ResultBlock;
