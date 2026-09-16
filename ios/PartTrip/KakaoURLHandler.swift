import Foundation

/**
 카카오톡에서 돌아온 URL 을 카카오 SDK 에 넘긴다.

 넘기지 않으면 `loginWithKakaoTalk` 이 끝나지 않고 실패로 떨어진다. 그러면
 라이브러리가 웹 로그인으로 다시 시도하는데, 카카오톡에서 막 돌아오는 중이라
 그 세션이 이렇게 터진다.

   ClientFailed(Unknown): An error occurred on executing authentication session

 이 메시지는 원인이 아니라 두 번째 시도의 결과다. 카카오톡 쪽 실패 사유
 (예: 콘솔에 등록된 iOS 번들 ID 가 달라 나는 KOE009)가 여기에 덮여 안 보인다.
 같은 메시지를 다시 보면 Xcode 콘솔에서 kauth.kakao.com/oauth/token 응답을
 먼저 확인할 것.

 열린 URL 은 UIScene 을 쓰면 SceneDelegate 로 온다. AppDelegate 로 오는
 구성도 있어 양쪽에서 부른다. 두 번 불려도 SDK 가 한 번만 처리한다.
 */
enum KakaoURLHandler {

  static func handle(_ url: URL) -> Bool {
    guard RNKakaoLogins.isKakaoTalkLoginUrl(url) else { return false }
    return RNKakaoLogins.handleOpen(url)
  }
}
