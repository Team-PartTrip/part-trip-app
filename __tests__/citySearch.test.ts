// getCities 가 만드는 주소만 본다. 나라를 안 주면 파라미터가 아예 빠져야
// 서버가 전 세계에서 찾는다. 인자 순서가 바뀌면 여기서 걸린다.
const mockAuthRequest = jest.fn(() => Promise.resolve([]));
jest.mock('../src/shared/api/http', () => ({
  authRequest: (...a: any[]) => mockAuthRequest(...(a as [])),
}));

import { getCities } from '../src/entities/main/api';

beforeEach(() => mockAuthRequest.mockClear());

const urlOf = () => (mockAuthRequest.mock.calls[0] as unknown as string[])[0];

test('나라를 주면 countryName 이 붙는다', async () => {
  await getCities('오사', '일본');
  expect(urlOf()).toContain('keyword=%EC%98%A4%EC%82%AC');
  expect(urlOf()).toContain('countryName=%EC%9D%BC%EB%B3%B8');
});

test('나라를 안 주면 countryName 이 빠진다', async () => {
  await getCities('오사카');
  expect(urlOf()).not.toContain('countryName');
});
