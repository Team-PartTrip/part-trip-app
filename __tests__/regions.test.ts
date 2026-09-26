import {
  isSameRegion,
  codeOfMapCode,
  REGIONS,
  regionOf,
  shortName,
} from '../src/entities/region/regions';
import { placeOf } from '../src/entities/record/api';

test('17곳이고 서버 코드 · 지도 코드가 겹치지 않는다', () => {
  expect(REGIONS).toHaveLength(17);
  expect(new Set(REGIONS.map(r => r.code)).size).toBe(17);
  expect(new Set(REGIONS.map(r => r.mapCode)).size).toBe(17);
});

test('같은 숫자라도 서버와 지도에서 다른 곳이다 (26 = 부산 / 울산)', () => {
  expect(regionOf('26')?.name).toBe('부산광역시');
  expect(regionOf(codeOfMapCode('26'))?.name).toBe('울산광역시');
});

test('강원 · 전북은 서버가 옛 코드(42 · 45)를 쓴다', () => {
  expect(regionOf('42')?.name).toBe('강원특별자치도');
  expect(regionOf('45')?.name).toBe('전북특별자치도');
});

test('짧은 이름', () => {
  expect(shortName('서울특별시')).toBe('서울');
  expect(shortName('세종특별자치시')).toBe('세종');
  expect(shortName('강원특별자치도')).toBe('강원');
  expect(shortName('경상북도')).toBe('경북');
  expect(shortName('경기도')).toBe('경기');
});

test('여행카드 장소 이름. 시·도를 모르는 옛 카드는 도시만', () => {
  expect(placeOf({ regionName: '강원특별자치도', cityName: '강릉' })).toBe(
    '강원 강릉',
  );
  expect(placeOf({ regionName: null, cityName: '오사카' })).toBe('오사카');
});

test('지도 파일의 시·도 17개가 모두 서버 코드로 이어지고, 이름도 맞다', () => {
  const topo = require('../src/shared/assets/maps/skorea-provinces-topo.json');
  const geometries = topo.objects[Object.keys(topo.objects)[0]].geometries;
  expect(geometries).toHaveLength(17);
  for (const g of geometries) {
    const region = regionOf(codeOfMapCode(String(g.properties.code)));
    expect(region).toBeDefined();
    expect(g.properties.name.slice(0, 1)).toBe(region!.name.slice(0, 1));
  }
});

test('구글 시·도 이름을 옛 이름까지 맞춘다', () => {
  expect(isSameRegion('경상북도', '47')).toBe(true);
  expect(isSameRegion('강원도', '42')).toBe(true);
  expect(isSameRegion('전라북도', '45')).toBe(true);
  expect(isSameRegion('경기도', '47')).toBe(false);
  expect(isSameRegion('광주광역시', '41')).toBe(false);
});
