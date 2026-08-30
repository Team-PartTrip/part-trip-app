// 인기 여행지는 서버가 준다 (API-008-11). 여기 남은 건 두 가지다.
//
// 1. 이모지 — 서버는 도시 이름과 나라 이름만 준다. 이모지 컬럼을 두면
//    도시가 늘 때마다 사람이 채워야 해서 앱이 들고 있는다.
// 2. 기본 목록 — 서버 조회가 실패하거나 아직 계획이 하나도 없을 때 쓴다.
//    첫 사용자에게 빈 화면을 보여주지 않으려는 것이다.
//
// 국가명은 country_info 표기를 따른다. 어긋나면 축제·관광지 조회가 빈 결과를 받는다.
// (예: '대한민국' 아니고 '한국')

import { PopularCity } from './types';

/** 도시 이름 → 이모지. 없는 도시는 DEFAULT_EMOJI 를 쓴다 */
const CITY_EMOJI: Record<string, string> = {
  오사카: '🏯',
  방콕: '🛕',
  다낭: '🏖️',
  타이베이: '🏙️',
  도쿄: '🗼',
  후쿠오카: '🍜',
  제주: '🍊',
  파리: '🥐',
  서울: '🗼',
  싱가포르: '🦁',
  홍콩: '🏙️',
  하노이: '🍲',
  세부: '🏝️',
  로마: '🏛️',
  런던: '☕',
  뉴욕: '🗽',
};

const DEFAULT_EMOJI = '📍';

export function emojiOf(cityName: string): string {
  return CITY_EMOJI[cityName] ?? DEFAULT_EMOJI;
}

/** 서버가 빈 목록을 주거나 조회가 실패했을 때 보여줄 기본 여행지 */
export const FALLBACK_CITIES: PopularCity[] = [
  { cityName: '오사카', countryName: '일본', emoji: '🏯' },
  { cityName: '방콕', countryName: '태국', emoji: '🛕' },
  { cityName: '다낭', countryName: '베트남', emoji: '🏖️' },
  { cityName: '타이베이', countryName: '대만', emoji: '🏙️' },
  { cityName: '도쿄', countryName: '일본', emoji: '🗼' },
  { cityName: '후쿠오카', countryName: '일본', emoji: '🍜' },
  { cityName: '제주', countryName: '한국', emoji: '🍊' },
  { cityName: '파리', countryName: '프랑스', emoji: '🥐' },
];
