import UIKit
import React

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else { return }
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate,
          let factory = appDelegate.reactNativeFactory else { return }

    let window = UIWindow(windowScene: windowScene)
    self.window = window

    factory.startReactNative(
      withModuleName: "PartTrip",
      in: window,
      launchOptions: nil
    )

    // 앱이 꺼져 있다가 URL 로 깨어난 경우. 이때는 openURLContexts 가 아니라
    // 여기로 들어온다.
    handle(connectionOptions.urlContexts)
  }

  /// 앱이 살아 있는 동안 열린 URL. 카카오톡에서 돌아오는 정상 경로다.
  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    handle(URLContexts)
  }

  /**
   카카오톡에서 로그인을 마치고 돌아온 URL 을 카카오 SDK 에 넘긴다.

   이 앱은 UIScene 생명주기라 열린 URL 이 AppDelegate 가 아니라 여기로 온다.
   이걸 안 넘기면 `loginWithKakaoTalk` 이 끝나지 않고 실패로 떨어진다. 그러면
   라이브러리가 웹 로그인으로 다시 시도하는데, 그 세션이
   "ClientFailed(Unknown): An error occurred on executing authentication session"
   으로 터진다. 실기기에서 본 그 오류다.

   RNKakaoLogins 는 브리징 헤더로 들여온다. `import kakao_login` 으로 모듈
   전체를 들여오면 그 umbrella 헤더가 <React/RCTBridgeModule.h> 를 함께 끌고
   들어와 이 타깃의 `import React` 가 깨진다.

   카카오 URL 인지는 SDK 가 판단한다. 우리가 스킴을 다시 확인하면 앱 키가
   바뀔 때 두 곳을 고쳐야 한다.
   */
  private func handle(_ contexts: Set<UIOpenURLContext>) {
    for context in contexts where RNKakaoLogins.isKakaoTalkLoginUrl(context.url) {
      _ = RNKakaoLogins.handleOpen(context.url)
    }
  }
}
