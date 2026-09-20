import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadow, spacing, typography } from '../../theme/theme';
import { PHASE_ORDER, Phase } from '../../utils/baseMultiplication';
import { getStrings } from '../../i18n/baseMultiplicationStrings';
import useBaseMultiplicationMachine from '../../hooks/useBaseMultiplicationMachine';
import { useReducedMotion } from '../../hooks/useAnimationPrimitives';
import NumberCharacter from './NumberCharacter';
import BaseNumber from './BaseNumber';
import StepBubble from './StepBubble';
import ResultBlock from './ResultBlock';
import MergeBlocks from './MergeBlocks';
import CollisionSpark from './CollisionSpark';
import Confetti from './Confetti';
import ControlBar from './ControlBar';
import { playSound } from '../../services/soundService';

type Props = {
  leftValue: number;
  rightValue: number;
  base: number;
  /** Hidden when the host screen already explains the sutra. */
  showSutraCard?: boolean;
};

const TRANSFER_DISTANCE = -168;

const atLeast = (phase: Phase, target: Phase) =>
  PHASE_ORDER.indexOf(phase) >= PHASE_ORDER.indexOf(target);

/** Animated walkthrough of the Nikhilam (base) multiplication sutra, e.g. 98 x 97. */
const BaseMultiplicationLesson: React.FC<Props> = ({
  leftValue,
  rightValue,
  base,
  showSutraCard = true,
}) => {
  const reducedMotion = useReducedMotion();
  const strings = useMemo(() => getStrings('en'), []);

  const machine = useBaseMultiplicationMachine({ leftValue, rightValue, base });
  const { state, next, back, replay, toggleAutoPlay, isAutoPlaying, isFinished, onPhaseAnimationComplete } = machine;
  const { phase } = state;

  useEffect(() => {
    if (phase === 'enter') playSound('hop');
  }, [phase]);

  const complete = useCallback((p: Phase) => () => onPhaseAnimationComplete(p), [onPhaseAnimationComplete]);

  const showBase = atLeast(phase, 'deviations');
  const showBubbles = atLeast(phase, 'deviations') && !atLeast(phase, 'multiply');
  const transferring = phase === 'crossAdd';
  const showSpark = phase === 'multiply';
  const showBlocks = atLeast(phase, 'merge');
  const celebrating = phase === 'celebrate';

  const leftCharacterValue = atLeast(phase, 'crossAdd') ? state.crossResult : state.leftValue;

  return (
    <View>
      {showSutraCard && (
        <View style={styles.sutraCard}>
          <Text style={styles.sutraMeaning}>{strings.sutraMeaning}</Text>
        </View>
      )}

      <View
        style={styles.phaseCard}
        accessible
        accessibilityRole="text"
        accessibilityLabel={strings.phaseAnnouncement(state)}
        accessibilityLiveRegion="polite"
      >
        <Text style={styles.phaseStep}>
          Step {machine.phaseIndex + 1} / {machine.totalPhases}
        </Text>
        <Text style={styles.phaseTitle}>{strings.phaseTitle[phase]}</Text>
        <Text style={styles.phaseText}>{strings.phaseAnnouncement(state)}</Text>
        <View style={styles.equationChip}>
          <Text style={styles.equationText}>{strings.phaseEquation(state)}</Text>
        </View>
        <Text style={styles.tipLabel}>{strings.whatWeDo}</Text>
        <Text style={styles.tipText}>{strings.phaseTip[phase]}</Text>
      </View>

      <View style={styles.stage}>
        <Confetti active={celebrating} reducedMotion={reducedMotion} onComplete={complete('celebrate')} testID="bm-confetti" />

        {showBubbles && <Text style={styles.stageCaption}>{strings.bubblesCaption}</Text>}

        <View style={styles.bubbleRow}>
          <StepBubble
            deviation={state.leftDev}
            visible={showBubbles}
            reducedMotion={reducedMotion}
            accessibleLabel={strings.deviationBubble(state.leftValue, state.leftDev, state.base)}
            onFloatComplete={complete('deviations')}
            testID="bm-left-bubble"
          />
          <StepBubble
            deviation={state.rightDev}
            visible={showBubbles}
            transferDistance={TRANSFER_DISTANCE}
            transferring={transferring}
            reducedMotion={reducedMotion}
            accessibleLabel={strings.deviationBubble(state.rightValue, state.rightDev, state.base)}
            onTransferComplete={complete('crossAdd')}
            testID="bm-right-bubble"
          />
        </View>

        {phase === 'crossAdd' && (
          <View style={styles.morphBanner}>
            <Text style={styles.morphText}>
              {strings.morphBanner(state.leftValue, state.rightDev, state.crossResult)}
            </Text>
          </View>
        )}

        <View style={styles.characterRow}>
          <NumberCharacter
            value={leftCharacterValue}
            entranceKey={leftCharacterValue}
            mood={celebrating ? 'cheer' : phase === 'crossAdd' ? 'surprised' : 'idle'}
            caption={atLeast(phase, 'crossAdd') ? strings.leftPartCaption : strings.leftCaption}
            note={atLeast(phase, 'crossAdd') ? strings.wasNote(state.leftValue) : undefined}
            highlight={atLeast(phase, 'crossAdd')}
            reducedMotion={reducedMotion}
            accessibleLabel={strings.numberCharacter(leftCharacterValue)}
            onEntranceComplete={phase === 'enter' ? complete('enter') : undefined}
            testID="bm-left-character"
          />
          <Text style={styles.operator}>×</Text>
          <NumberCharacter
            value={state.rightValue}
            entranceKey={state.rightValue}
            mood={celebrating ? 'cheer' : 'idle'}
            caption={strings.rightCaption}
            reducedMotion={reducedMotion}
            accessibleLabel={strings.numberCharacter(state.rightValue)}
            testID="bm-right-character"
          />
        </View>

        <View style={styles.baseRow}>
          <BaseNumber
            base={state.base}
            visible={showBase}
            reducedMotion={reducedMotion}
            accessibleLabel={strings.baseLabel(state.base)}
            testID="bm-base"
          />
          <CollisionSpark active={showSpark} reducedMotion={reducedMotion} onComplete={complete('multiply')} testID="bm-spark" />
        </View>
        {showBase && <Text style={styles.stageCaption}>{strings.baseCaption}</Text>}

        {showSpark && (
          <ResultBlock
            side="right"
            value={state.devProductPadded}
            caption={`${Math.abs(state.leftDev)} × ${Math.abs(state.rightDev)}`}
            accessibleLabel={strings.rightBlock(state.devProductPadded)}
            testID="bm-dev-product"
          />
        )}

        {showBlocks && (
          <MergeBlocks
            leftText={String(state.crossResult)}
            rightText={state.devProductPadded}
            finalText={state.finalResult}
            merging={showBlocks}
            celebrating={celebrating}
            reducedMotion={reducedMotion}
            labels={{
              left: strings.leftBlock(state.crossResult),
              right: strings.rightBlock(state.devProductPadded),
              final: strings.finalAnnouncement(state),
            }}
            onMergeComplete={complete('merge')}
            testID="bm-merge"
          />
        )}
      </View>

      <ControlBar
        onNext={next}
        onReplay={replay}
        onToggleAutoPlay={toggleAutoPlay}
        isAutoPlaying={isAutoPlaying}
        isFinished={isFinished}
        labels={{
          next: strings.next,
          replay: strings.replay,
          autoPlayOn: strings.autoPlayOn,
          autoPlayOff: strings.autoPlayOff,
          nextHint: strings.nextHint,
          replayHint: strings.replayHint,
          autoPlayHint: strings.autoPlayHint,
        }}
      />
      {machine.phaseIndex > 0 && (
        <Text
          style={styles.backLink}
          accessibilityRole="button"
          accessibilityLabel="Previous step"
          onPress={back}
        >
          ← Previous step
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sutraCard: {
    backgroundColor: colors.goldSurface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sutraMeaning: {
    ...typography.body,
    color: colors.textPrimary,
  },
  phaseCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadow.card,
  },
  phaseStep: {
    ...typography.caption,
    color: colors.textMuted,
  },
  phaseTitle: {
    ...typography.heading,
    color: colors.primary,
    marginTop: 2,
  },
  phaseText: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  equationChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  equationText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  tipLabel: {
    ...typography.caption,
    color: colors.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.md,
  },
  tipText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stageCaption: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  morphBanner: {
    backgroundColor: colors.goldSurface,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.gold,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  morphText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  stage: {
    minHeight: 340,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.xl,
    overflow: 'hidden',
    ...shadow.card,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 120,
    minHeight: 56,
  },
  characterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  operator: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  baseRow: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  backLink: {
    ...typography.label,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});

export default BaseMultiplicationLesson;
