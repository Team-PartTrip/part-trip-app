// DB 에 장소가 없는 도시를 고르면 목록이 0곳이다. 그러면 스크롤할 것이
// 없어 onEndReached 가 안 걸리고, 구글에서 받아오는 경로를 아무도 부르지
// 않는다. 그래서 빈 목록일 때 한 번 직접 부른다.
//
// 조건이 틀리면 구글 API 를 끝없이 부른다. 요금이 나가는 자리다.

import { shouldAutoFetch } from '../src/pages/PlannerScreen/PlaceVoteView';

const base = {
  loading: false,
  busy: false,
  failed: false,
  count: 0,
  exhausted: false,
  generation: 1,
  fetchedGeneration: 0,
};

describe('shouldAutoFetch', () => {
  it('목록이 비었고 아직 안 받아봤으면 받아온다', () => {
    expect(shouldAutoFetch(base)).toBe(true);
  });

  it('한 세대에 한 번만 받아온다', () => {
    // 이걸 안 막으면 빈 응답이 올 때마다 다시 불러 무한히 돈다
    expect(shouldAutoFetch({ ...base, fetchedGeneration: 1 })).toBe(false);
  });

  it('카테고리나 도시가 바뀌면 다시 받아온다', () => {
    expect(
      shouldAutoFetch({ ...base, generation: 2, fetchedGeneration: 1 }),
    ).toBe(true);
  });

  it('받는 중이면 기다린다', () => {
    expect(shouldAutoFetch({ ...base, loading: true })).toBe(false);
  });

  it('다른 요청이 돌고 있으면 기다린다', () => {
    expect(shouldAutoFetch({ ...base, busy: true })).toBe(false);
  });

  it('장소가 이미 있으면 부르지 않는다', () => {
    expect(shouldAutoFetch({ ...base, count: 1 })).toBe(false);
  });

  it('구글도 줄 게 없으면 부르지 않는다', () => {
    // 이걸 안 막으면 빈 도시에서 계속 물어본다
    expect(shouldAutoFetch({ ...base, exhausted: true })).toBe(false);
  });

  it('조회가 실패한 것과 장소가 없는 것은 다르다', () => {
    // 서버가 죽었을 때 구글 호출로 덮지 않는다
    expect(shouldAutoFetch({ ...base, failed: true })).toBe(false);
  });
});
