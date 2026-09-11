// 도시의 장소 목록에 투표 현황을 얹는 계산만 본다.
//
// 투표 후보는 누군가 처음 투표할 때 서버가 만든다. 그래서 0표 장소는
// 후보가 없고 장소 목록에만 있다. 여기가 틀리면 투표한 곳이 0표로 보이거나,
// 표가 살아 있는 후보가 목록에서 사라진다.
import { toVoteRows } from '../src/pages/PlannerScreen/PlaceVoteView';

const place = (tourPlaceId: number, placeName: string) =>
  ({
    tourPlaceId,
    placeName,
    category: '맛집',
    description: null,
    address: '도톤보리',
    rating: 4.6,
    imageUrl: null,
    latitude: 0,
    longitude: 0,
  } as any);

const option = (
  optionId: number,
  tourPlaceId: number | null,
  voteCount: number,
  selectedByMe = false,
) => ({
  optionId,
  tourPlaceId,
  placeName: `후보 ${optionId}`,
  imageUrl: null,
  address: null,
  rating: null,
  addedByUserId: 'u',
  voteCount,
  selectedByMe,
  confirmed: false,
});

const vote = (options: ReturnType<typeof option>[]) =>
  ({
    voteId: 1,
    plannerId: 1,
    category: 'RESTAURANT',
    categoryLabel: '맛집',
    status: 'OPEN',
    deadline: null,
    deadlinePassed: false,
    eligibleMemberCount: 4,
    votedMemberCount: 2,
    confirmedOptionId: null,
    options,
  } as any);

test('투표가 없는 카테고리는 장소가 전부 0표로 나오고 누를 수 있다', () => {
  const rows = toVoteRows([place(1, '이치란'), place(2, '다루마')], undefined);

  expect(rows.map(r => [r.placeName, r.voteCount, r.votable])).toEqual([
    ['이치란', 0, true],
    ['다루마', 0, true],
  ]);
});

test('장소에 표 수와 내 표를 얹는다. 순서는 장소 목록 그대로다', () => {
  const rows = toVoteRows(
    [place(1, '이치란'), place(2, '다루마'), place(3, '하리주')],
    vote([option(10, 2, 3, true), option(11, 3, 1)]),
  );

  // 3표인 다루마가 위로 올라가지 않는다 — 누르는 순간 줄이 튀면 안 된다
  expect(rows.map(r => [r.placeName, r.voteCount, r.mine])).toEqual([
    ['이치란', 0, false],
    ['다루마', 3, true],
    ['하리주', 1, false],
  ]);
});

test('장소 목록에 없는 후보도 표가 살아 있으면 끝에 붙고, 누를 수는 없다', () => {
  const rows = toVoteRows(
    [place(1, '이치란')],
    vote([
      // 이름만 올렸던 후보
      option(20, null, 2),
      // 관광지를 다시 받아와 id 가 바뀐 후보
      option(21, 999, 1),
    ]),
  );

  expect(rows.map(r => [r.placeName, r.voteCount, r.votable])).toEqual([
    ['이치란', 0, true],
    ['후보 20', 2, false],
    ['후보 21', 1, false],
  ]);
});

// ── 목록 끝에서 더 받은 장소 이어 붙이기 ──
import { mergePlaces } from '../src/pages/PlannerScreen/PlaceVoteView';

test('더 받은 장소는 뒤에 붙고, 이미 있는 id 는 다시 들어가지 않는다', () => {
  const merged = mergePlaces(
    [place(1, '이치란'), place(2, '다루마')],
    [place(2, '다루마'), place(3, '하리주'), place(3, '하리주')],
  );

  // 같은 id 가 두 번 들어가면 목록 key 가 겹쳐 줄이 사라진다
  expect(merged.map(p => p.tourPlaceId)).toEqual([1, 2, 3]);
});

test('새로 온 게 없으면 원래 배열을 그대로 돌려준다 - 괜히 다시 그리지 않게', () => {
  const prev = [place(1, '이치란')];
  expect(mergePlaces(prev, [place(1, '이치란')])).toBe(prev);
});
