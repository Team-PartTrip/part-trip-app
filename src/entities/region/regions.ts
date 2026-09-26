export const KOREA = '대한민국';

export interface Region {
  code: string;
  name: string;
  mapCode: string;
}

export const REGIONS: Region[] = [
  { code: '11', name: '서울특별시', mapCode: '11' },
  { code: '26', name: '부산광역시', mapCode: '21' },
  { code: '27', name: '대구광역시', mapCode: '22' },
  { code: '28', name: '인천광역시', mapCode: '23' },
  { code: '29', name: '광주광역시', mapCode: '24' },
  { code: '30', name: '대전광역시', mapCode: '25' },
  { code: '31', name: '울산광역시', mapCode: '26' },
  { code: '36', name: '세종특별자치시', mapCode: '29' },
  { code: '41', name: '경기도', mapCode: '31' },
  { code: '42', name: '강원특별자치도', mapCode: '32' },
  { code: '43', name: '충청북도', mapCode: '33' },
  { code: '44', name: '충청남도', mapCode: '34' },
  { code: '45', name: '전북특별자치도', mapCode: '35' },
  { code: '46', name: '전라남도', mapCode: '36' },
  { code: '47', name: '경상북도', mapCode: '37' },
  { code: '48', name: '경상남도', mapCode: '38' },
  { code: '50', name: '제주특별자치도', mapCode: '39' },
];

export function shortName(name: string): string {
  return (
    name
      .replace(/특별자치시$|특별시$|광역시$/, '')
      .replace(/특별자치도$/, '')
      .replace(/^(충|경|전)[청상라]([북남])도$/, '$1$2')
      .replace(/도$/, '')
  );
}

export function isSameRegion(name: string, code: string): boolean {
  const region = regionOf(code);
  return !!region && shortName(name) === shortName(region.name);
}

export function regionOf(code: string | null | undefined): Region | undefined {
  return REGIONS.find(region => region.code === code);
}

export function codeOfMapCode(mapCode: string): string | undefined {
  return REGIONS.find(region => region.mapCode === mapCode)?.code;
}

const METRO = ['11', '26', '27', '28', '29', '30', '31', '36'];

export function isMetro(code: string): boolean {
  return METRO.includes(code);
}

export const SUGGESTED_CITIES: Record<string, string[]> = {
  '41': ['수원', '가평', '양평', '파주'],
  '42': ['강릉', '속초', '춘천', '평창', '정선'],
  '43': ['단양', '청주', '제천'],
  '44': ['태안', '공주', '부여', '보령'],
  '45': ['전주', '군산', '남원'],
  '46': ['여수', '순천', '담양', '보성', '목포'],
  '47': ['경주', '안동', '포항', '울릉'],
  '48': ['통영', '남해', '거제', '김해', '진주'],
  '50': ['제주', '서귀포'],
};
