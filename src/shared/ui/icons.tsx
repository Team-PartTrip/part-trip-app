import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { ColorValue } from 'react-native';

/**
 * 홈 화면에서 쓰는 선 아이콘.
 *
 * 탭바는 피그마에서 뽑은 PNG 를 쓰는데 알림·캘린더는 내보낸 것이 없다.
 * react-native-svg 가 이미 들어와 있어 그려서 쓴다. 파일이 늘지 않고,
 * 파란 배경과 어두운 배경 양쪽에 색만 바꿔 쓸 수 있다.
 */

interface IconProps {
  size?: number;
  /** 토큰 색을 그대로 넘길 수 있게 ColorValue 로 받는다 */
  color?: ColorValue;
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

/** 여행카드 — 카드 두 장이 겹친 모양 */
export const CardIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#ffffff',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8.5 7.5A1.5 1.5 0 0 1 10 6h9a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 18h-9a1.5 1.5 0 0 1-1.5-1.5v-9Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Path
      d="M5.5 15.5A1.5 1.5 0 0 1 4 14V6a1.5 1.5 0 0 1 1.5-1.5H14"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function lineIcon(
  paths: string[],
  { strokeWidth = 1.8, filled = false } = {},
): React.FC<IconProps> {
  return ({ size = 20, color = '#ffffff' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {paths.map(d => (
        <Path
          key={d}
          d={d}
          stroke={color}
          fill={filled ? color : 'none'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}

export const PinIcon = lineIcon([
  'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z',
  'M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
]);

export const StarIcon = lineIcon(
  [
    'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z',
  ],
  { strokeWidth: 1.2, filled: true },
);

export const CheckIcon = lineIcon(['M5 12.5l4.5 4.5L19 7.5'], {
  strokeWidth: 2.6,
});

export const CheckCircleIcon = lineIcon([
  'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  'M8 12.3l2.7 2.7L16 9.7',
]);

export const UserIcon = lineIcon([
  'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  'M4.5 21a7.5 7.5 0 0 1 15 0',
]);

export const UsersIcon = lineIcon([
  'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  'M2.5 20.5a6.5 6.5 0 0 1 13 0',
  'M16 4.3a3.5 3.5 0 0 1 0 6.4',
  'M18 14.2a6.5 6.5 0 0 1 3.5 6.3',
]);

export const UtensilsIcon = lineIcon([
  'M4 3v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3',
  'M7 3v18',
  'M20 15V3a5 5 0 0 0-5 5v5a2 2 0 0 0 2 2h3Zm0 0v6',
]);

export const LandmarkIcon = lineIcon([
  'M3 21h18',
  'M6 17v-6M10 17v-6M14 17v-6M18 17v-6',
  'M12 3l8 5H4l8-5Z',
]);

export const BedIcon = lineIcon([
  'M3 5v15',
  'M3 9h16a2 2 0 0 1 2 2v9',
  'M3 16h18',
  'M7 9v7',
]);

export const CoffeeIcon = lineIcon([
  'M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z',
  'M16 9h1.5a2.5 2.5 0 0 1 0 5H16',
  'M8 2.5v2.5M12 2.5v2.5',
]);

export const TicketIcon = lineIcon([
  'M3 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2Z',
  'M14 5v2M14 11v2M14 17v2',
]);

export const BagIcon = lineIcon([
  'M6 3L3.5 7v12a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V7L18 3H6Z',
  'M3.5 7h17',
  'M16 11a4 4 0 0 1-8 0',
]);

export const ChevronLeftIcon = lineIcon(['M15 5l-7 7 7 7'], {
  strokeWidth: 2.2,
});
export const ChevronRightIcon = lineIcon(['M9 5l7 7-7 7'], {
  strokeWidth: 2.2,
});
export const ChevronDownIcon = lineIcon(['M5 9l7 7 7-7'], { strokeWidth: 2.2 });
export const ChevronUpIcon = lineIcon(['M5 15l7-7 7 7'], { strokeWidth: 2.2 });
export const PlusIcon = lineIcon(['M12 5v14M5 12h14'], { strokeWidth: 2.2 });
export const MinusIcon = lineIcon(['M5 12h14'], { strokeWidth: 2.2 });
export const GripIcon = lineIcon(['M5 8h14M5 12h14M5 16h14'], {
  strokeWidth: 2,
});
export const MoreIcon = lineIcon(['M6 12h.01M12 12h.01M18 12h.01'], {
  strokeWidth: 3.2,
});
