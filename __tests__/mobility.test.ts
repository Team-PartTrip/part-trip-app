import { mobilityAnswers, mobilityOf } from '../src/entities/profile/mobility';
import type { TravelPreference } from '../src/entities/profile/api';

// 저장된 값을 칩으로 채웠다가 그대로 두면 설정이 바뀌면 안 된다.
const base: TravelPreference = {
  preferredTransport: 'PUBLIC_TRANSIT',
  dailyScheduleCount: 3,
  canUseStairs: true,
};

test('아직 안 물었으면 비워 둔다', () => {
  expect(mobilityOf(base)).toBeNull();
});

test('괜찮다고 답했으면 빈 선택이다', () => {
  expect(
    mobilityOf({ ...base, usesWheelchair: false, limitedWalking: false }),
  ).toEqual([]);
});

test('채운 값을 그대로 저장하면 원래 설정과 같다', () => {
  const cases: TravelPreference[] = [
    {
      ...base,
      usesWheelchair: true,
      limitedWalking: false,
      canUseStairs: false,
    },
    {
      ...base,
      usesWheelchair: false,
      limitedWalking: true,
      canUseStairs: false,
    },
    {
      ...base,
      usesWheelchair: false,
      limitedWalking: false,
      canUseStairs: true,
    },
  ];
  for (const pref of cases) {
    const { usesWheelchair, limitedWalking, canUseStairs } = pref;
    expect(mobilityAnswers(mobilityOf(pref)!)).toEqual({
      usesWheelchair,
      limitedWalking,
      canUseStairs,
    });
  }
});
