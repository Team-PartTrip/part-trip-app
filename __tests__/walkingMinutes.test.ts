import { walkingMinutesOf } from '../src/entities/profile/api';
import { mobilityAnswers } from '../src/entities/profile/mobility';
import type { TravelPreference } from '../src/entities/profile/api';

const base: TravelPreference = {
  preferredTransport: 'PUBLIC_TRANSIT',
  dailyScheduleCount: 3,
  canUseStairs: true,
};

test('분이 있으면 그 값, 없으면 예전 오래 걷기 값으로 읽는다', () => {
  expect(walkingMinutesOf({ ...base, maxWalkingMinutes: 10 })).toBe(10);
  expect(walkingMinutesOf({ ...base, limitedWalking: true })).toBe(30);
  expect(walkingMinutesOf({ ...base, limitedWalking: false })).toBe(60);
  expect(walkingMinutesOf(base)).toBeNull();
});

test('오래 걷기가 어렵다고 하면 고른 시간(1시간 미만)을 두고, 없으면 30분', () => {
  expect(
    mobilityAnswers(['WALKING'], { ...base, maxWalkingMinutes: 10 })
      .maxWalkingMinutes,
  ).toBe(10);
  expect(mobilityAnswers(['WALKING'], base).maxWalkingMinutes).toBe(30);
  // 예전에 1시간 이상이라고 했다면 어렵다고 바꾸는 순간 30분
  expect(
    mobilityAnswers(['WALKING'], { ...base, maxWalkingMinutes: 60 })
      .maxWalkingMinutes,
  ).toBe(30);
});

test('어렵지 않다고 하면 시간도 1시간 이상으로 맞춘다', () => {
  const answers = mobilityAnswers([], { ...base, maxWalkingMinutes: 10 });
  expect(answers.limitedWalking).toBe(false);
  expect(answers.maxWalkingMinutes).toBe(60);
});
