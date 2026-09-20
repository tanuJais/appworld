import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/theme';
import { playSound } from '../../services/soundService';

type Props = {
  onNext: () => void;
  onReplay: () => void;
  onToggleAutoPlay: () => void;
  isAutoPlaying: boolean;
  isFinished: boolean;
  labels: {
    next: string;
    replay: string;
    autoPlayOn: string;
    autoPlayOff: string;
    nextHint: string;
    replayHint: string;
    autoPlayHint: string;
  };
};

const ControlBar: React.FC<Props> = ({
  onNext,
  onReplay,
  onToggleAutoPlay,
  isAutoPlaying,
  isFinished,
  labels,
}) => {
  const tap = (fn: () => void) => () => {
    playSound('click');
    fn();
  };

  return (
    <View style={styles.bar}>
      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={tap(onReplay)}
        accessibilityRole="button"
        accessibilityLabel={labels.replay}
        accessibilityHint={labels.replayHint}
        testID="bm-replay"
      >
        <Text style={[styles.label, styles.secondaryLabel]}>{labels.replay}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={tap(onToggleAutoPlay)}
        accessibilityRole="switch"
        accessibilityState={{ checked: isAutoPlaying }}
        accessibilityLabel={isAutoPlaying ? labels.autoPlayOn : labels.autoPlayOff}
        accessibilityHint={labels.autoPlayHint}
        testID="bm-autoplay"
      >
        <Text style={[styles.label, styles.secondaryLabel]}>
          {isAutoPlaying ? labels.autoPlayOn : labels.autoPlayOff}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.primary, isFinished && styles.disabled]}
        onPress={tap(onNext)}
        disabled={isFinished}
        accessibilityRole="button"
        accessibilityState={{ disabled: isFinished }}
        accessibilityLabel={labels.next}
        accessibilityHint={labels.nextHint}
        testID="bm-next"
      >
        <Text style={[styles.label, styles.primaryLabel]}>{labels.next}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  button: {
    minHeight: 48,
    minWidth: 96,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    ...typography.label,
    fontSize: 15,
  },
  primaryLabel: {
    color: colors.textInverse,
  },
  secondaryLabel: {
    color: colors.textPrimary,
  },
});

export default ControlBar;
