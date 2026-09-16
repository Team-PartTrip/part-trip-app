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

  /// 카카오톡에서 돌아온 URL. 자세한 설명은 KakaoURLHandler 에 있다.
  private func handle(_ contexts: Set<UIOpenURLContext>) {
    for context in contexts {
      _ = KakaoURLHandler.handle(context.url, from: "scene")
    }
  }
}
