import { pickRecommendations } from '../src/pages/MainView/MainView';

const place = (id: number, rating: number | null, category: string) =>
  ({ tourPlaceId: id, placeName: `p${id}`, rating, category } as any);

test('별점 4.0 이상에서 카테고리를 골고루 뽑는다', () => {
  const places = [
    place(1, 4.9, '맛집'),
    place(2, 4.8, '맛집'),
    place(3, 4.5, '카페'),
    place(4, 4.1, '명소'),
    place(5, 3.9, '쇼핑'),
    place(6, 4.2, '액티비티'),
  ];
  const picked = pickRecommendations(places, 4);
  expect(picked).toHaveLength(4);
  expect(picked.every(p => (p.rating ?? 0) >= 4)).toBe(true);
  expect(new Set(picked.map(p => p.category)).size).toBe(4);
});

test('4.0 이상이 모자라면 나머지로 채운다', () => {
  const places = [
    place(1, 4.5, '맛집'),
    place(2, 3.2, '카페'),
    place(3, null, '명소'),
  ];
  expect(pickRecommendations(places, 4).map(p => p.tourPlaceId)).toEqual([
    1, 2, 3,
  ]);
});
