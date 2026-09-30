// 카카오는 취소도 실패도 같은 코드('RNKakaoLogins')로 던진다. 메시지로만
// 구분되는데, 이걸 틀리면 로그인을 그만둔 사람에게 "실패" 경고창이 뜬다.

jest.mock('@react-native-seoul/kakao-login', () => ({
  login: jest.fn(),
}));

import { isKakaoCancelled } from '../src/shared/lib/kakaoSignin';

describe('isKakaoCancelled', () => {
  it('취소는 취소로 본다', () => {
    // iOS
    expect(
      isKakaoCancelled(
        new Error('ClientFailed(Cancelled): user cancelled login'),
      ),
    ).toBe(true);
    // 안드로이드 (카카오 SDK 메시지)
    expect(isKakaoCancelled(new Error('the user cancelled'))).toBe(true);
  });

  it('진짜 실패는 취소로 보지 않는다', () => {
    expect(
      isKakaoCancelled(
        new Error(
          'ClientFailed(MustInitAppKey): the Kakao SDK was never initialized.',
        ),
      ),
    ).toBe(false);
    expect(
      isKakaoCancelled(
        new Error('AUTHORIZATION_FAILED: invalid android_key_hash'),
      ),
    ).toBe(false);
  });

  it('메시지가 없어도 터지지 않는다', () => {
    expect(isKakaoCancelled(undefined)).toBe(false);
    expect(isKakaoCancelled(null)).toBe(false);
    expect(isKakaoCancelled({})).toBe(false);
    expect(isKakaoCancelled('취소')).toBe(false);
  });
});
