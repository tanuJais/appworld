import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, radii, shadow, spacing } from '../../theme/theme';

type CardProps = ViewProps & {
  raised?: boolean;
  accent?: boolean; // adds a gold left accent border, used for "featured" cards
};

const Card: React.FC<CardProps> = ({ style, raised, accent, children, ...rest }) => {
  return (
    <View
      style={[
        styles.base,
        raised ? shadow.raised : shadow.card,
        accent && styles.accent,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  accent: {
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
  },
});

export default Card;
