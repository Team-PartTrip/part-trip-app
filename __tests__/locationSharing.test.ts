// 여행 중 위치 공유. 조건이 하나라도 빠졌는데 보내면 동의 없이 위치가 나간다.

import { shouldSend } from '../src/shared/lib/locationSharing';

const ok = {
  consent: 'yes' as const,
  phase: 'DURING' as const,
  guardianCount: 1,
  appActive: true,
};

test('여행 중 · 동의 · 보호자 있음 · 앱 켜짐이면 보낸다', () => {
  expect(shouldSend(ok)).toBe(true);
});

test('하나라도 빠지면 보내지 않는다', () => {
  expect(shouldSend({ ...ok, consent: null })).toBe(false);
  expect(shouldSend({ ...ok, consent: 'no' })).toBe(false);
  expect(shouldSend({ ...ok, phase: 'BEFORE' })).toBe(false);
  expect(shouldSend({ ...ok, phase: 'ENDED' })).toBe(false);
  expect(shouldSend({ ...ok, guardianCount: 0 })).toBe(false);
  expect(shouldSend({ ...ok, appActive: false })).toBe(false);
});
