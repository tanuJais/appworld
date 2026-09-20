import React from 'react';
import { Text, Image, StyleSheet } from 'react-native';
import { gurukulAvatars } from '../../theme/theme';

// Re-exported for convenience so screens only need to import from this module.
export const GURUKUL_AVATARS = gurukulAvatars;

const gurukulStudentImage = require('../../../assets/avatars/gurukul-student.png');
const gurukulGirlImage = require('../../../assets/avatars/gurukul-girl.png');

type AvatarProps = {
  avatar: string;
  size?: number;
};

const Avatar: React.FC<AvatarProps> = ({ avatar, size = 32 }) => {
  if (avatar === GURUKUL_AVATARS.boy || avatar === GURUKUL_AVATARS.girl) {
    return (
      <Image
        source={avatar === GURUKUL_AVATARS.girl ? gurukulGirlImage : gurukulStudentImage}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        resizeMode="cover"
      />
    );
  }
  return <Text style={{ fontSize: size * 0.9 }}>{avatar}</Text>;
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#FDF0D5',
  },
});

export default Avatar;
