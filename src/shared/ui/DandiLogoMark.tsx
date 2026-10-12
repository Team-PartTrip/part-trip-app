import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const DandiLogoMark: React.FC<{ size: number }> = ({ size }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 240 240"
    accessibilityRole="image"
    accessibilityLabel="단디"
  >
    <Rect width={240} height={240} rx={53.688} fill="#0D47A1" />
    <Path
      d="M160 68 H85 V172 H160"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth={34.56}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M138 152 C135.36 143 116 128.7 116 110 C116 97.85 125.85 88 138 88 C150.15 88 160 97.85 160 110 C160 128.7 140.64 143 138 152 Z"
      fill="#FFC107"
    />
    <Path
      d="M146.5 110 A8.5 8.5 0 1 1 129.5 110 A8.5 8.5 0 1 1 146.5 110 Z"
      fill="#0D47A1"
    />
  </Svg>
);

export default DandiLogoMark;
