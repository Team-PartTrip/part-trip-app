import { extractInviteCode } from '../src/pages/PlannerScreen/PlannerScreen';

// 사람들이 주고받는 것은 코드가 아니라 링크다. 여기서 못 뽑아내면
// 링크를 붙여넣은 사용자는 "유효하지 않은 초대 코드" 만 보게 된다.

test('링크에서 코드만 꺼낸다', () => {
  expect(
    extractInviteCode('http://localhost:5173/planner/group?inviteCode=OSK-4821'),
  ).toBe('OSK-4821');
});

test('코드를 그대로 넣어도 된다', () => {
  expect(extractInviteCode('OSK-4821')).toBe('OSK-4821');
});

test('앞뒤 공백을 떼어낸다', () => {
  // 붙여넣기에는 줄바꿈이 딸려오는 경우가 많다
  expect(extractInviteCode('  OSK-4821\n')).toBe('OSK-4821');
});

test('뒤에 다른 파라미터가 붙어도 코드만 가져온다', () => {
  expect(
    extractInviteCode('https://x/planner/group?inviteCode=ABC&from=kakao'),
  ).toBe('ABC');
});

test('인코딩된 코드를 되돌린다', () => {
  expect(extractInviteCode('https://x/g?inviteCode=A%2DB')).toBe('A-B');
});

test('inviteCode 가 첫 파라미터가 아니어도 찾는다', () => {
  expect(extractInviteCode('https://x/g?from=kakao&inviteCode=ABC')).toBe('ABC');
});

test('코드가 없는 링크는 그대로 둔다', () => {
  // 서버가 "유효하지 않은 초대 코드입니다" 로 알려주게 둔다.
  // 여기서 빈 값으로 만들면 버튼이 눌리지 않아 이유를 알 수 없다.
  expect(extractInviteCode('https://x/planner/group')).toBe(
    'https://x/planner/group',
  );
});
