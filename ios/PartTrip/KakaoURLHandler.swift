import Foundation

/**
 카카오톡에서 돌아온 URL 을 카카오 SDK 에 넘긴다.

 넘기지 않으면 `loginWithKakaoTalk` 이 끝나지 않고 실패로 떨어진다. 그러면
 라이브러리가 웹 로그인으로 다시 시도하고, 카카오톡에서 막 돌아온 직후라
 그 세션이 이렇게 터진다.

   ClientFailed(Unknown): An error occurred on executing authentication session

 실기기에서 본 그 오류다. **원래 오류가 이 두 번째 시도에 덮여서 보이지
 않는다** — 그래서 원인을 찾기 어려웠다.

 열린 URL 이 어디로 들어오는지는 iOS 버전과 앱 구성에 따라 다르다. UIScene
 을 쓰면 SceneDelegate 로 오지만, AppDelegate 로 오는 구성도 있다. 그래서
 양쪽에서 이 함수를 부른다. 두 번 불려도 SDK 가 알아서 한 번만 처리한다.
 */
enum KakaoURLHandler {

  static func handle(_ url: URL, from source: String) -> Bool {
    let matched = RNKakaoLogins.isKakaoTalkLoginUrl(url)
    let handled = matched ? RNKakaoLogins.handleOpen(url) : false

    #if DEBUG
    // 진단용. 카카오톡 로그인이 안 돌아오는 원인을 찾는 동안만 둔다.
    // Xcode 콘솔에서 "[PartTrip][Kakao]" 로 검색하면 된다.
    NSLog(
      "[PartTrip][Kakao] source=%@ url=%@ isKakaoTalkLoginUrl=%@ handleOpen=%@",
      source,
      url.absoluteString,
      matched ? "true" : "false",
      handled ? "true" : "false"
    )
    #endif

    return handled
  }
}
