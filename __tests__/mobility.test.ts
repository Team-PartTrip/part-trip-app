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
    expect(mobilityAnswers(mobilityOf(pref)!, pref)).toEqual({
      usesWheelchair,
      limitedWalking,
      maxWalkingMinutes: limitedWalking ? 30 : 60,
      canUseStairs,
    });
  }
});

test('계단만 어렵다고 해 둔 사람이 오래 걷기만 골라도 계단 설정은 그대로다', () => {
  const pref = { ...base, canUseStairs: false };
  expect(mobilityOf(pref)).toEqual(['STAIRS']);
  expect(mobilityAnswers(['STAIRS', 'WALKING'], pref).canUseStairs).toBe(false);
});

test('계단만 어렵다고 해 둔 사람이 괜찮아요를 고르면 계단 괜찮음으로 바뀐다', () => {
  const pref = { ...base, canUseStairs: false };
  expect(mobilityAnswers([], pref).canUseStairs).toBe(true);
});

test('미리 켜져 있던 계단 칩을 끄면 계단 괜찮음으로 바뀐다', () => {
  const pref = {
    ...base,
    usesWheelchair: false,
    limitedWalking: false,
    canUseStairs: false,
  };
  expect(mobilityOf(pref)).toEqual(['STAIRS']);
  expect(mobilityAnswers([], pref).canUseStairs).toBe(true);
});

test('휠체어 칩을 끄면 휠체어 때문에 꺼 둔 계단 제한도 풀린다', () => {
  const pref = {
    ...base,
    usesWheelchair: true,
    limitedWalking: false,
    canUseStairs: false,
  };
  expect(mobilityOf(pref)).toEqual(['WHEELCHAIR']);
  expect(mobilityAnswers([], pref)).toEqual({
    usesWheelchair: false,
    limitedWalking: false,
    maxWalkingMinutes: 60,
    canUseStairs: true,
  });
  expect(mobilityAnswers(['STAIRS'], pref).canUseStairs).toBe(false);
});
