import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Concept } from '../types';
import { colors, radii, spacing } from '../theme/theme';

type PrerequisiteHintProps = {
  concepts: Concept[];
  prerequisiteIds?: string[];
  onOpenLesson: (conceptId: string) => void;
};

const PrerequisiteHint: React.FC<PrerequisiteHintProps> = ({ concepts, prerequisiteIds, onOpenLesson }) => {
  const prerequisite = prerequisiteIds
    ?.map(id => concepts.find(concept => concept.id === id))
    .find(Boolean);

  if (!prerequisite) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice this lesson will help</Text>
      <Text style={styles.description}>
        Review {prerequisite.name} for the ideas behind this practice.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => onOpenLesson(prerequisite.id)}>
        <Text style={styles.buttonText}>Review {prerequisite.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginTop: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
  },
  title: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gold,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonText: {
    color: colors.primaryDark,
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default PrerequisiteHint;