// 가족 연결. 코드를 받은 사람이 어디에 넣는지 알아야 하고, 만료 시각이 읽혀야 한다.

jest.mock('@react-navigation/native', () => ({ useFocusEffect: jest.fn() }));
jest.mock('react-native-safe-area-context', () => ({ SafeAreaView: 'View' }));

import {
  formatUntil,
  inviteMessage,
} from '../src/pages/GuardianView/GuardianView';

test('만료 시각을 오전 · 오후로 읽기 쉽게 쓴다', () => {
  expect(formatUntil('2026-09-22T18:10:00')).toBe('9월 22일 오후 6:10');
  expect(formatUntil('2026-09-22T00:05:00')).toBe('9월 22일 오전 12:05');
  expect(formatUntil('엉망')).toBe('');
});

test('보내는 메시지에 코드와 넣을 곳이 같이 있다', () => {
  const message = inviteMessage('K7PX3M');
  expect(message).toContain('K7PX3M');
  expect(message).toContain('가족 연결');
});
