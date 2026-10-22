import { walkingMinutesOf } from './api';
import type { TravelPreference } from './api';

export type Mobility = 'WHEELCHAIR' | 'WALKING' | 'STAIRS';

export const MOBILITY: { value: Mobility; label: string }[] = [
  { value: 'WHEELCHAIR', label: '휠체어를 써요' },
  { value: 'WALKING', label: '오래 걷기 어려워요' },
  { value: 'STAIRS', label: '계단이 어려워요' },
];

/** 저장된 설정을 칩 선택으로. 아직 안 물었으면 null */
export function mobilityOf(pref: TravelPreference): Mobility[] | null {
  if (
    pref.usesWheelchair == null &&
    pref.limitedWalking == null &&
    pref.canUseStairs
  ) {
    return null;
  }
  const list: Mobility[] = [];
  if (pref.usesWheelchair) {
    list.push('WHEELCHAIR');
  }
  if (pref.limitedWalking) {
    list.push('WALKING');
  }
  // 휠체어면 계단은 이미 빠진다. 칩을 둘 다 켜 보이지 않게 한다
  if (!pref.canUseStairs && !pref.usesWheelchair) {
    list.push('STAIRS');
  }
  return list;
}

/** 칩 선택을 저장할 값으로 */
export function mobilityAnswers(
  mobility: Mobility[],
  pref: TravelPreference,
): Pick<
  TravelPreference,
  'usesWheelchair' | 'limitedWalking' | 'canUseStairs' | 'maxWalkingMinutes'
> {
  const wheelchair = mobility.includes('WHEELCHAIR');
  const stairsShown = !!mobilityOf(pref)?.includes('STAIRS');
  const walking = mobility.includes('WALKING');
  const current = walkingMinutesOf(pref);
  return {
    usesWheelchair: wheelchair,
    limitedWalking: walking,
    maxWalkingMinutes: walking
      ? current != null && current < 60
        ? current
        : 30
      : 60,
    canUseStairs:
      wheelchair || mobility.includes('STAIRS')
        ? false
        : stairsShown || pref.canUseStairs || !!pref.usesWheelchair,
  };
}
