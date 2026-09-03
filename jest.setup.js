// 테스트에는 네이티브 바이너리가 없다. 네이티브를 직접 부르는 모듈만 대신 세운다.
// 화면 렌더가 목적이라 반환값은 최소한으로 둔다.

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({ data: null }),
    signOut: jest.fn().mockResolvedValue(undefined),
  },
  statusCodes: {},
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  // tokenStorage 가 쓰는 배치 API (async-storage 3.x)
  setMany: jest.fn().mockResolvedValue(undefined),
  removeMany: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn().mockResolvedValue({ didCancel: true }),
  launchCamera: jest.fn().mockResolvedValue({ didCancel: true }),
}));
