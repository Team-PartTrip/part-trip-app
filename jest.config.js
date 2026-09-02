module.exports = {
  preset: '@react-native/jest-preset',

  setupFiles: ['<rootDir>/jest.setup.js'],

  // 프리셋 기본값은 @react-native 와 @react-native-community 만 변환한다.
  // 그런데 이 앱이 쓰는 @react-native-async-storage · @react-native-google-signin ·
  // @react-navigation · react-native-* 들이 ESM(export 문)으로 배포된다.
  // 변환을 안 하면 "SyntaxError: Unexpected token 'export'" 로 죽는다.
  //
  // @react-native[^/]* 로 스코프 전체를 잡는다. 라이브러리를 하나 더 깔 때마다
  // 여기에 이름을 덧붙이지 않으려는 것이다.
  //
  // 세계지도가 쓰는 d3-* 와 topojson-client 도 ESM 으로만 배포된다.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native[^/]*|@react-navigation|react-native-.*|d3-.*|topojson-client|internmap|delaunator|robust-predicates)/)',
  ],
};
