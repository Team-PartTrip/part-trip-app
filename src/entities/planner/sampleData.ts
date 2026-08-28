// 플래너 화면은 모두 서버 API 를 쓴다. 여기 남은 건 아직 전용 API 가 없는
// "인기 여행지" 목록 하나뿐이다.
//
// 국가명은 country_info 표기를 따른다. 어긋나면 축제·관광지 조회가 빈 결과를 받는다.
// (예: '대한민국' 아니고 '한국')

import { PopularCity } from './types';

export const POPULAR_CITIES: PopularCity[] = [
  { cityName: '오사카', countryName: '일본', emoji: '🏯' },
  { cityName: '방콕', countryName: '태국', emoji: '🛕' },
  { cityName: '다낭', countryName: '베트남', emoji: '🏖️' },
  { cityName: '타이베이', countryName: '대만', emoji: '🏙️' },
  { cityName: '도쿄', countryName: '일본', emoji: '🗼' },
  { cityName: '후쿠오카', countryName: '일본', emoji: '🍜' },
  { cityName: '제주', countryName: '한국', emoji: '🍊' },
  { cityName: '파리', countryName: '프랑스', emoji: '🥐' },
];
