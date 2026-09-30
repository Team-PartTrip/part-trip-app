// 서버가 status 를 주기 전과 후 모두 동작해야 한다. 여기가 틀리면 첫
// 화면이 여행이 있는데도 "다음 여행이 아직 없어요" 를 띄운다.

import { hasTrip } from '../src/pages/MainView/MainView';
import type { DdayInfo, TripPhase } from '../src/entities/main/api';

function dday(over: Partial<DdayInfo>): DdayInfo {
  return {
    regionName: '일본',
    cityName: '오사카',
    startDate: '2026-10-01',
    endDate: '2026-10-05',
    headcount: 4,
    dday: 'D - 3',
    ...over,
  };
}

describe('hasTrip', () => {
  it('여행 전·중이면 보여준다', () => {
    for (const status of ['BEFORE', 'DURING'] as TripPhase[]) {
      expect(hasTrip(dday({ status }))).toBe(true);
    }
  });

  it('여행이 없거나 끝났으면 안 보여준다', () => {
    for (const status of ['NO_TRIP', 'ENDED'] as TripPhase[]) {
      expect(hasTrip(dday({ status }))).toBe(false);
    }
  });

  it('status 를 안 주는 옛 서버면 날짜로 판단한다', () => {
    expect(hasTrip(dday({ status: undefined }))).toBe(true);
    expect(hasTrip(dday({ status: undefined, startDate: null }))).toBe(false);
  });

  it('날짜가 없으면 status 가 뭐든 안 보여준다', () => {
    // D-day 와 박수를 날짜로 계산한다. 날짜가 없으면 그릴 수 없다.
    expect(hasTrip(dday({ status: 'BEFORE', startDate: null }))).toBe(false);
    expect(hasTrip(dday({ status: 'DURING', endDate: null }))).toBe(false);
  });

  it('응답 자체가 없으면 안 보여준다', () => {
    expect(hasTrip(null)).toBe(false);
  });
});

test('오늘 갈 곳에는 장소를 정한 칸만 순서대로 나온다', () => {
  const { todayPlaces } = require('../src/pages/MainView/MainView');
  const place = {
    tourPlaceId: 1,
    name: '경포대',
    category: null,
    categoryLabel: null,
    imageUrl: null,
    address: null,
    rating: null,
    latitude: null,
    longitude: null,
  };
  expect(
    todayPlaces([
      { slotId: 2, order: 1, place },
      { slotId: 3, order: 2, place: null },
    ]).map((slot: { slotId: number }) => slot.slotId),
  ).toEqual([2]);
  // 예전 서버는 todaySchedule 을 안 준다
  expect(todayPlaces(undefined)).toEqual([]);
});
