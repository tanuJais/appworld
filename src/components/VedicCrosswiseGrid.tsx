import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import { colors, radii, spacing } from '../theme/theme';

type VedicCrosswiseGridProps = {
  a: string; // e.g. "23"
  b: string; // e.g. "41"
  captions: string[]; // 4 step captions from the lesson data
  anims: Animated.Value[]; // 4 values (0 -> 1), one per step, staggered by the parent
};

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const CELL_W = 60;
const CELL_H = 54;
const GAP = 12;
const GRID_W = CELL_W * 2 + GAP;
const GRID_H = CELL_H * 2 + GAP;
const COL_X = [CELL_W / 2, CELL_W + GAP + CELL_W / 2];
const ROW_Y = [CELL_H / 2, CELL_H + GAP + CELL_H / 2];

// Renders the "vertically and crosswise" 2-digit multiplication as a stacked grid with
// colored overlay lines instead of prose, so the diagonals map directly onto the digits
// a student would see if working the problem on paper — and makes the carry a visible
// step rather than a number that silently disappears.
const VedicCrosswiseGrid: React.FC<VedicCrosswiseGridProps> = ({ a, b, captions, anims }) => {
  const [t1, u1] = a.split('').map(Number);
  const [t2, u2] = b.split('').map(Number);

  const unitsProduct = u1 * u2;
  const crossSum = t1 * u2 + u1 * t2;
  const tensProduct = t1 * t2;

  const carry1 = Math.floor(unitsProduct / 10);
  const unitsDigit = unitsProduct % 10;
  const middleTotal = crossSum + carry1;
  const carry2 = Math.floor(middleTotal / 10);
  const middleDigit = middleTotal % 10;
  const leadDigits = tensProduct + carry2;

  // Each line fades in with its step and then stays on screen — the final state shows all
  // three colored lines at once, exactly like the diagram a student would draw on paper.
  const rightLine = anims[0];
  const crossLine = anims[1];
  const leftLine = anims[2];
  const combine = anims[3];

  return (
    <View style={styles.wrap}>
      <View style={styles.gridRow}>
        <View style={styles.gridColumn}>
          <View style={styles.placeLabelRow}>
            <Text style={styles.placeLabel}>Tens</Text>
            <Text style={styles.placeLabel}>Ones</Text>
          </View>
          <View style={styles.gridArea}>
            <View style={[StyleSheet.absoluteFill, styles.noPointerEvents]}>
              <Svg width={GRID_W} height={GRID_H}>
                {/* Step 1: right vertical (units × units) */}
                <AnimatedLine
                  x1={COL_X[1]}
                  y1={4}
                  x2={COL_X[1]}
                  y2={GRID_H - 4}
                  stroke={colors.teal}
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={rightLine}
                />
                {/* Step 2: crosswise diagonals */}
                <AnimatedLine
                  x1={COL_X[0]}
                  y1={ROW_Y[0]}
                  x2={COL_X[1]}
                  y2={ROW_Y[1]}
                  stroke={colors.gold}
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={crossLine}
                />
                <AnimatedLine
                  x1={COL_X[1]}
                  y1={ROW_Y[0]}
                  x2={COL_X[0]}
                  y2={ROW_Y[1]}
                  stroke={colors.gold}
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={crossLine}
                />
                {/* Step 3: left vertical (tens × tens) */}
                <AnimatedLine
                  x1={COL_X[0]}
                  y1={4}
                  x2={COL_X[0]}
                  y2={GRID_H - 4}
                  stroke={colors.primary}
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={leftLine}
                />
              </Svg>
            </View>
            <View style={styles.digitRow}>
              <View style={styles.cell}>
                <View style={styles.digitBadge}>
                  <Text style={styles.digit}>{t1}</Text>
                </View>
              </View>
              <View style={styles.cell}>
                <View style={styles.digitBadge}>
                  <Text style={styles.digit}>{u1}</Text>
                </View>
              </View>
            </View>
            <View style={styles.digitRow}>
              <View style={styles.cell}>
                <View style={styles.digitBadge}>
                  <Text style={styles.digit}>{t2}</Text>
                </View>
              </View>
              <View style={styles.cell}>
                <View style={styles.digitBadge}>
                  <Text style={styles.digit}>{u2}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.partialsColumn}>
          <Animated.View style={[styles.partialRow, { opacity: anims[0] }]}>
            <View style={[styles.badge, { backgroundColor: colors.teal }]}>
              <Text style={[styles.badgeText, { color: colors.textInverse }]}>1</Text>
            </View>
            <Text style={styles.partialText}>
              {u1} × {u2} = <Text style={[styles.partialResult, { color: colors.teal }]}>{unitsProduct}</Text>
            </Text>
          </Animated.View>
          <Animated.View style={[styles.partialRow, { opacity: anims[1] }]}>
            <View style={[styles.badge, { backgroundColor: colors.gold }]}>
              <Text style={[styles.badgeText, { color: colors.primaryDark }]}>2</Text>
            </View>
            <Text style={styles.partialText}>
              ({t1}×{u2}) + ({u1}×{t2}) = <Text style={[styles.partialResult, { color: colors.warning }]}>{crossSum}</Text>
            </Text>
          </Animated.View>
          <Animated.View style={[styles.partialRow, { opacity: anims[2] }]}>
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.textInverse }]}>3</Text>
            </View>
            <Text style={styles.partialText}>
              {t1} × {t2} = <Text style={[styles.partialResult, { color: colors.primary }]}>{tensProduct}</Text>
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* Step 4: combine + carry */}
      <Animated.View style={[styles.combineBlock, { opacity: combine }]}>
        <View style={styles.combineRow}>
          <View style={[styles.combineChip, { borderColor: colors.primary }]}>
            <Text style={[styles.combineChipText, { color: colors.primary }]}>{tensProduct}</Text>
          </View>
          <Text style={styles.combineDivider}>|</Text>
          <View style={[styles.combineChip, { borderColor: colors.warning }]}>
            <Text style={[styles.combineChipText, { color: colors.warning }]}>{crossSum}</Text>
          </View>
          <Text style={styles.combineDivider}>|</Text>
          <View style={[styles.combineChip, { borderColor: colors.teal }]}>
            <Text style={[styles.combineChipText, { color: colors.teal }]}>{unitsProduct}</Text>
          </View>
        </View>

        {carry1 > 0 && (
          <View style={styles.carryRow}>
            <Svg width={70} height={30}>
              <AnimatedPath
                d="M15,4 C30,4 40,26 55,26"
                stroke={colors.teal}
                strokeWidth={3}
                fill="none"
                opacity={combine}
              />
            </Svg>
            <View style={[styles.carryBubble, { backgroundColor: colors.teal }]}>
              <Text style={styles.carryBubbleText}>+{carry1}</Text>
            </View>
            <Text style={styles.carryText}>
              {unitsProduct} → keep {unitsDigit}, carry {carry1} over to the next column
            </Text>
          </View>
        )}

        {carry2 > 0 && (
          <View style={styles.carryRow}>
            <Svg width={70} height={30}>
              <AnimatedPath
                d="M15,4 C30,4 40,26 55,26"
                stroke={colors.warning}
                strokeWidth={3}
                fill="none"
                opacity={combine}
              />
            </Svg>
            <View style={[styles.carryBubble, { backgroundColor: colors.warning }]}>
              <Text style={styles.carryBubbleText}>+{carry2}</Text>
            </View>
            <Text style={styles.carryText}>
              {middleTotal} → keep {middleDigit}, carry {carry2} over to make {leadDigits}
            </Text>
          </View>
        )}

        <View style={styles.combineRow}>
          <View style={[styles.answerChip, { borderColor: colors.primary }]}>
            <Text style={[styles.answerDigit, { color: colors.primary }]}>{leadDigits}</Text>
          </View>
          <View style={[styles.answerChip, { borderColor: colors.warning }]}>
            <Text style={[styles.answerDigit, { color: colors.warning }]}>{middleDigit}</Text>
          </View>
          <View style={[styles.answerChip, { borderColor: colors.teal }]}>
            <Text style={[styles.answerDigit, { color: colors.teal }]}>{unitsDigit}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 6,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.gold,
    padding: spacing.md,
    gap: spacing.md,
  },
  gridArea: {
    width: GRID_W,
    height: GRID_H,
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
  gridColumn: {
    alignItems: 'center',
  },
  placeLabelRow: {
    flexDirection: 'row',
    width: GRID_W,
    marginBottom: 4,
  },
  placeLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  digitRow: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_W,
    height: CELL_H,
    marginRight: GAP,
    marginBottom: GAP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  partialsColumn: {
    flex: 1,
    gap: 6,
  },
  partialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textInverse,
  },
  partialText: {
    fontSize: 13,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  partialResult: {
    fontWeight: '800',
  },
  combineBlock: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  combineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  combineChip: {
    borderWidth: 2,
    borderRadius: radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  combineChipText: {
    fontSize: 18,
    fontWeight: '800',
  },
  combineDivider: {
    fontSize: 18,
    color: colors.textMuted,
  },
  carryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  carryBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carryBubbleText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textInverse,
  },
  carryText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  answerChip: {
    borderWidth: 2,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  answerDigit: {
    fontSize: 24,
    fontWeight: '800',
  },
});

export default VedicCrosswiseGrid;
