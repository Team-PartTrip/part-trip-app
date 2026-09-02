import React from 'react';
import Svg, { Path } from 'react-native-svg';

/**
 * 홈 화면에서 쓰는 선 아이콘.
 *
 * 탭바는 피그마에서 뽑은 PNG 를 쓰는데 알림·캘린더는 내보낸 것이 없다.
 * react-native-svg 가 이미 들어와 있어 그려서 쓴다. 파일이 늘지 않고,
 * 파란 배경과 어두운 배경 양쪽에 색만 바꿔 쓸 수 있다.
 */

interface IconProps {
  size?: number;
  color?: string;
}

/** 알림 종 */
export const BellIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#ffffff',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8a6 6 0 1 0-12 0c0 6-3 7-3 7h18s-3-1-3-7Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.7 21a2 2 0 0 1-3.4 0"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** 축제 · 이벤트 캘린더 */
export const CalendarIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#ffffff',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5v-13Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Path
      d="M4 10h16M8 3v4M16 3v4"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    {/* 일정이 있는 날 표시 — 축제 캘린더의 점과 같은 뜻 */}
    <Path
      d="M8.5 14h.01M12 14h.01M15.5 14h.01M8.5 17.5h.01M12 17.5h.01"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </Svg>
);
