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

/**
 * 서버 조회가 실패했을 때 보여줄 기본 여행지.
 *
 * 장소(tour_place)가 있는 도시만 넣는다. 없는 도시를 넣으면 고른 뒤
 * 바로 다음 화면인 장소 담기가 빈 채로 떠서, 고를 수 있는데 쓸 수 없는
 * 목적지가 된다. 서버 목록도 같은 기준으로 온다.
 */
// 이모지는 emojiOf 한 곳에서만 가져온다. 여기 따로 적어두면 CITY_EMOJI 를
// 고쳤을 때 기본 목록과 서버 목록의 이모지가 달라진다.
export const FALLBACK_CITIES: PopularCity[] = [
  { cityName: '오사카', countryName: '일본' },
  { cityName: '방콕', countryName: '태국' },
  { cityName: '다낭', countryName: '베트남' },
].map(city => ({ ...city, emoji: emojiOf(city.cityName) }));
