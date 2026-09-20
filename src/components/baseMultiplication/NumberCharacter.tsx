import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { bmColors, bmSizes } from './tokens';
import { useHopIn, usePulse } from '../../hooks/useAnimationPrimitives';

export type Mood = 'idle' | 'surprised' | 'cheer';

type Props = {
  value: number | string;
  /** Re-runs the entrance animation whenever this changes. */
  entranceKey?: unknown;
  mood?: Mood;
  /** Small caption under the character, e.g. "First number". */
  caption?: string;
  /** Small chip above the character, e.g. "was 98". */
  note?: string;
  /** Draws a gold ring to show this character just changed. */
  highlight?: boolean;
  reducedMotion?: boolean;
  accessibleLabel: string;
  onEntranceComplete?: () => void;
  testID?: string;
};

/** The numeral itself is the cartoon: googly eyes sit on the digits, with a smile and little feet. */
const NumberCharacter: React.FC<Props> = ({
  value,
  entranceKey,
  mood = 'idle',
  caption,
  note,
  highlight = false,
  reducedMotion = false,
  accessibleLabel,
  onEntranceComplete,
  testID,
}) => {
  const { style: hopStyle, play } = useHopIn(reducedMotion);
  const { style: pulseStyle } = usePulse(mood === 'cheer', reducedMotion);

  useEffect(() => {
    play(onEntranceComplete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entranceKey, value]);

  const eyeRadiusY = mood === 'surprised' ? 5.5 : 4.5;
  const mouth =
    mood === 'cheer'
      ? 'M6 4 q18 20 36 0 q-18 8 -36 0'
      : mood === 'surprised'
        ? 'M17 6 q7 -6 14 0 q-7 7 -14 0'
        : 'M8 4 q16 14 32 0';

  return (
    <Animated.View
      testID={testID}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibleLabel}
      style={[styles.wrapper, highlight && styles.highlight, hopStyle, pulseStyle]}
    >
      {note ? (
        <View style={styles.note}>
          <Text style={styles.noteText}>{note}</Text>
        </View>
      ) : null}

      <View style={[styles.eyes, styles.noPointerEvents]}>
        <Svg width={78} height={30} viewBox="0 0 78 30">
          <Circle cx="22" cy="15" r="13" fill="#FFFFFF" stroke={bmColors.characterStroke} strokeWidth="3" />
          <Circle cx="56" cy="15" r="13" fill="#FFFFFF" stroke={bmColors.characterStroke} strokeWidth="3" />
          <Ellipse cx="23" cy="17" rx="4.5" ry={eyeRadiusY} fill={bmColors.characterStroke} />
          <Ellipse cx="57" cy="17" rx="4.5" ry={eyeRadiusY} fill={bmColors.characterStroke} />
        </Svg>
      </View>

      <Text allowFontScaling adjustsFontSizeToFit numberOfLines={1} style={styles.numeral}>
        {value}
      </Text>

      <View style={[styles.mouth, styles.noPointerEvents]}>
        <Svg width={48} height={20} viewBox="0 0 48 20">
          <Path d={mouth} stroke={bmColors.characterStroke} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </Svg>
      </View>

      <View style={[styles.feet, styles.noPointerEvents]}>
        <View style={styles.foot} />
        <View style={styles.foot} />
      </View>

      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  highlight: {
    borderColor: bmColors.highlightRing,
    backgroundColor: bmColors.highlightFill,
  },
  note: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: bmColors.noteFill,
    marginBottom: 2,
  },
  noteText: {
    fontSize: 11,
    fontWeight: '700',
    color: bmColors.captionText,
  },
  eyes: {
    marginBottom: -12,
    zIndex: 2,
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
  numeral: {
    fontSize: bmSizes.numeralFontSize,
    lineHeight: bmSizes.numeralFontSize * 1.05,
    fontWeight: '900',
    letterSpacing: 1,
    color: bmColors.characterText,
  },
  mouth: {
    marginTop: -6,
  },
  feet: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 2,
  },
  foot: {
    width: 18,
    height: 8,
    borderRadius: 8,
    backgroundColor: bmColors.characterStroke,
  },
  caption: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: bmColors.captionText,
  },
});

export default NumberCharacter;
