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
  }

  /// 카카오톡에서 로그인을 마치고 돌아온 URL 을 카카오 SDK 에 넘긴다.
  ///
  /// 이 앱은 UIScene 생명주기라 열린 URL 이 AppDelegate 가 아니라 여기로 온다.
  /// 안 넘기면 카카오톡으로 간 로그인이 끝나지 않고 화면만 돌아온다.
  ///
  /// `import kakao_login` 으로 부르지 않고 런타임으로 찾는다. 그 pod 의
  /// umbrella 헤더가 <React/RCTBridgeModule.h> 를 함께 끌고 들어와서,
  /// 들여오는 순간 이 타깃의 `import React` 가 깨진다
  /// ("cannot find type 'RCTBridge' in scope").
  ///
  /// 카카오 URL 이 아닌 경우는 SDK 가 스스로 걸러 내므로 미리 확인하지 않는다.
  ///
  /// ponytail: 클래스 이름을 문자열로 찾는다. 라이브러리가 이름을 바꾸면
  /// 카카오톡으로 간 로그인만 조용히 안 돌아온다(웹 로그인은 그대로 된다).
  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url,
          let kakao = NSClassFromString("RNKakaoLogins") else { return }
    let selector = NSSelectorFromString("handleOpenUrl:")
    if kakao.responds(to: selector) {
      _ = (kakao as AnyObject).perform(selector, with: url)
    }
  }
}
