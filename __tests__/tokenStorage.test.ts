// 저장(setMany)과 삭제(removeMany)는 각각 별개의 네이티브 작업이라
// 부른 순서대로 끝난다는 보장이 없다. tokenStorage 가 둘을 한 줄로
// 세우는지, 그리고 세션이 바뀐 뒤 늦게 도착한 갱신을 버리는지 본다.

// 모듈을 새로 부르면 mock 도 새로 만들어진다. 그래서 여기서 붙잡지 않고
// beforeEach 에서 그때의 것을 받아 쓴다.
let store: { setMany: jest.Mock; removeMany: jest.Mock };

let saveTokens: typeof import('../src/shared/api/tokenStorage').saveTokens;
let clearTokens: typeof import('../src/shared/api/tokenStorage').clearTokens;
let getSessionGeneration: typeof import('../src/shared/api/tokenStorage').getSessionGeneration;

// 호출 순서를 남겨 두 작업이 겹쳤는지 본다
let calls: string[] = [];

beforeEach(() => {
  jest.resetModules();
  calls = [];
  store = require('@react-native-async-storage/async-storage');
  // 저장은 느리고 삭제는 빠른 최악의 순서를 만든다
  store.setMany.mockImplementation(
    () =>
      new Promise(resolve =>
        setTimeout(() => {
          calls.push('set');
          resolve(undefined);
        }, 20),
      ),
  );
  store.removeMany.mockImplementation(() => {
    calls.push('remove');
    return Promise.resolve();
  });
  ({
    saveTokens,
    clearTokens,
    getSessionGeneration,
  } = require('../src/shared/api/tokenStorage'));
});

const tokens = { accessToken: 'a', refreshToken: 'r' };

test('로그아웃이 저장을 앞지르지 못한다', async () => {
  const saving = saveTokens(tokens);
  const clearing = clearTokens();
  await Promise.all([saving, clearing]);

  // 삭제가 저장보다 먼저 끝나면 지운 자리에 토큰이 되살아난다
  expect(calls).toEqual(['set', 'remove']);
});

test('세션이 바뀐 뒤 도착한 갱신은 버린다', async () => {
  const generation = getSessionGeneration();
  await clearTokens(); // 로그아웃 — 세대가 올라간다

  await saveTokens(tokens, { newSession: false, generation });

  expect(store.setMany).not.toHaveBeenCalled();
});

test('로그인 저장은 세대를 올린다', async () => {
  const before = getSessionGeneration();
  await saveTokens(tokens);

  expect(getSessionGeneration()).toBe(before + 1);
  expect(store.setMany).toHaveBeenCalledTimes(1);
});
