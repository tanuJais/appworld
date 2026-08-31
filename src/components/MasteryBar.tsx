import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type MasteryBarProps = {
  percentage: number;
  showLabel?: boolean;
};

const MasteryBar: React.FC<MasteryBarProps> = ({ percentage, showLabel = true }) => {
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

  const getColor = () => {
    if (percentage < 30) return ['#EF4444', '#DC2626'];
    if (percentage < 70) return ['#F59E0B', '#D97706'];
    return ['#10B981', '#059669'];
  };

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Mastery Progress</Text>
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
    color: '#374151',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4C1D95',
  },
  barContainer: {
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
});

export default MasteryBar;
