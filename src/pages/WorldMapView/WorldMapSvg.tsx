import React, { useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { geoMercator, geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import worldAtlas from 'world-atlas/countries-110m.json';
import colors from '../../shared/tokens/colors';
import { NUMERIC_BY_ALPHA2 } from '../../entities/worldmap/countryNumericCode';

/**
 * 실제 국가 경계로 그리는 세계지도.
 *
 * 예전에는 직사각형 여덟 개로 대륙을 흉내 냈다. 나라를 구분할 수 없어서
 * 방문한 곳을 칠할 방법이 없었다.
 *
 * 지도 데이터는 world-atlas 의 110m(가장 거친) 판이다. 108KB 로 셋 중
 * 가장 작고, 이 크기 화면에서는 더 정밀한 판과 차이가 안 보인다.
 */

interface CountryShape {
  /** 지도 데이터의 국가 id. 분쟁 지역 등 id 가 없는 도형도 있다 */
  id: string | null;
  d: string;
  feature: any;
}

/**
 * 경로를 화면 크기마다 다시 만들지 않게 뽑아둔다.
 *
 * 177개 나라를 매번 투영하면 화면을 열 때마다 눈에 띄게 멈춘다.
 * 1000×500 기준으로 한 번만 만들고, 표시할 때 viewBox 로 줄인다.
 */
const BASE_WIDTH = 1000;
const BASE_HEIGHT = 500;

const SHAPES: CountryShape[] = (() => {
  const collection: any = feature(
    worldAtlas as any,
    (worldAtlas as any).objects.countries,
  );
  const projection = geoNaturalEarth1().fitSize(
    [BASE_WIDTH, BASE_HEIGHT],
    collection,
  );
  const toPath = geoPath(projection);

  return collection.features
    .map((f: any) => ({
      id: f.id == null ? null : String(f.id),
      d: toPath(f) ?? '',
      feature: f,
    }))
    .filter((shape: CountryShape) => shape.d.length > 0);
})();

interface Props {
  /** 서버가 주는 alpha-2 코드들 (JP · VN …) */
  visitedCodes: string[];
  /** 화면에서 차지할 가로 길이. 세로는 비율로 따라간다 */
  width: number;
}

const WorldMapSvg: React.FC<Props> = ({ visitedCodes, width }) => {
  // 코드가 바뀔 때만 다시 만든다
  const visitedIds = useMemo(() => {
    const ids = new Set<string>();
    visitedCodes.forEach(code => {
      const numeric = NUMERIC_BY_ALPHA2[code?.toUpperCase()];
      if (numeric) {
        ids.add(numeric);
      }
    });
    return ids;
  }, [visitedCodes]);

  const height = (width * BASE_HEIGHT) / BASE_WIDTH;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${BASE_WIDTH} ${BASE_HEIGHT}`}
    >
      {SHAPES.map((shape, i) => {
        const visited = shape.id != null && visitedIds.has(shape.id);
        return (
          <Path
            // id 없는 도형이 셋 있어서 id 를 key 로 쓰면 겹친다
            key={i}
            d={shape.d}
            fill={visited ? colors.primary : colors.inputBg}
            stroke={colors.background}
            // 나라끼리 붙어 있어서 선이 없으면 한 덩어리로 보인다
            strokeWidth={0.5}
          />
        );
      })}
    </Svg>
  );
};

/**
 * 한 나라만 칸에 꽉 차게 그린다 (마이페이지 미리보기).
 *
 * 전체 지도에서 잘라 쓰면 나라마다 크기가 제각각이라 러시아는 칸을 넘고
 * 일본은 점이 된다. 그 나라만 따로 투영해서 칸에 맞춘다.
 */
export function CountryShapeSvg({
  countryCode,
  size,
}: {
  countryCode: string;
  size: number;
}) {
  const d = useMemo(() => {
    const numeric = NUMERIC_BY_ALPHA2[countryCode?.toUpperCase()];
    if (!numeric) {
      return null;
    }
    const target = SHAPES.find(shape => shape.id === numeric)?.feature;
    if (!target) {
      return null;
    }
    // 칸을 꽉 채우면 테두리가 잘린다. 조금 여유를 둔다
    const padded = size * 0.82;
    const projection = geoMercator().fitSize([padded, padded], target);
    return geoPath(projection)(target) ?? null;
  }, [countryCode, size]);

  if (!d) {
    return null;
  }
  const padded = size * 0.82;
  return (
    <Svg width={padded} height={padded}>
      <Path d={d} fill={colors.primary} />
    </Svg>
  );
}

export default WorldMapSvg;
