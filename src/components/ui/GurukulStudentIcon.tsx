import React from 'react';
import Svg, { Circle, Path, Rect, Ellipse } from 'react-native-svg';
import { colors } from '../../theme/theme';

type GurukulStudentIconProps = {
  size?: number;
  variant?: 'boy' | 'girl';
};

// Flat-style icon of a Gurukul student seated cross-legged reading a palm-leaf manuscript,
// used in place of generic graduation-cap emoji for a culturally authentic learner avatar.
const GurukulStudentIcon: React.FC<GurukulStudentIconProps> = ({ size = 32, variant = 'boy' }) => {
  const isGirl = variant === 'girl';

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* seated robe */}
      <Path
        d="M50 40 C34 40 20 54 16 74 C15 78 17 82 21 82 L79 82 C83 82 85 78 84 74 C80 54 66 40 50 40 Z"
        fill={isGirl ? colors.teal : colors.primary}
      />
      {/* robe trim */}
      <Path
        d="M22 78 C28 58 38 46 50 46 C62 46 72 58 78 78"
        stroke={colors.gold}
        strokeWidth={2.5}
        fill="none"
      />
      {/* crossed legs base */}
      <Ellipse cx={50} cy={80} rx={30} ry={7} fill={isGirl ? colors.tealSurface : colors.surfaceAlt} opacity={0.5} />

      {/* neck */}
      <Rect x={45} y={32} width={10} height={10} rx={4} fill="#E8B584" />

      {/* head */}
      <Circle cx={50} cy={24} r={15} fill="#E8B584" />

      {/* hair */}
      {isGirl ? (
        <>
          <Path d="M35 20 C35 8 65 8 65 20 C65 14 35 14 35 20 Z" fill="#3B2417" />
          <Path d="M33 20 C31 30 31 40 35 46" stroke="#3B2417" strokeWidth={5} fill="none" strokeLinecap="round" />
          <Path d="M67 20 C69 30 69 40 65 46" stroke="#3B2417" strokeWidth={5} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <Path d="M35 18 C35 8 65 8 65 18 C65 12 35 12 35 18 Z" fill="#3B2417" />
          <Path d="M46 8 C48 3 52 3 54 8" stroke="#3B2417" strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      )}

      {/* tilak mark */}
      <Path d="M50 16 L50 22" stroke={colors.gold} strokeWidth={2} strokeLinecap="round" />

      {/* manuscript / book */}
      <Path d="M32 66 L50 62 L68 66 L68 74 L50 70 L32 74 Z" fill={colors.goldSurface} stroke={colors.primaryDark} strokeWidth={1.5} />
      <Path d="M50 62 L50 70" stroke={colors.primaryDark} strokeWidth={1} />
    </Svg>
  );
};

export default GurukulStudentIcon;
