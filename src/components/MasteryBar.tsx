import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii } from '../theme/theme';

type MasteryBarProps = {
  percentage: number;
  showLabel?: boolean;
  label?: string;
};

const MasteryBar: React.FC<MasteryBarProps> = ({ percentage, showLabel = true, label = 'Mastery Progress' }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: percentage,
      useNativeDriver: false,
      friction: 5,
    }).start();
  }, [percentage]);

  const width = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const getColor = (): readonly [string, string] => {
    if (percentage < 30) return gradients.danger;
    if (percentage < 70) return gradients.gold;
    return gradients.success;
  };

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
        </View>
      )}
      <View style={styles.barContainer}>
        <Animated.View style={[styles.bar, { width }]}>
          <LinearGradient
            colors={getColor()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  barContainer: {
    height: 20,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bar: {
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
});

export default MasteryBar;
