import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

const RATIO = 156 / 104;

const DandiWordmark: React.FC<{
  height: number;
  color: string;
  accessibilityLabel?: string;
}> = ({ height, color, accessibilityLabel = '단디' }) => (
  <Svg
    width={height * RATIO}
    height={height}
    viewBox="4 -2 156 104"
    accessibilityRole="image"
    accessibilityLabel={accessibilityLabel}
  >
    <G
      fill="none"
      stroke={color}
      strokeWidth={15}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M46 12 H16 V44 H46" />
      <Path d="M62 6 V52" />
      <Path d="M62 29 H75" />
      <Path d="M16 66 V88 H74" />
      <Path d="M127 12 H98 V88 H127" />
      <Path d="M146 6 V94" />
    </G>
  </Svg>
);

export default DandiWordmark;
