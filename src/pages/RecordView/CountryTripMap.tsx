import React, { useMemo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import worldAtlas from 'world-atlas/countries-110m.json';
import colors from '../../shared/tokens/colors';
import { ALPHA2_BY_KOREAN } from '../../entities/worldmap/countryCodeByName';
import { NUMERIC_BY_ALPHA2 } from '../../entities/worldmap/countryNumericCode';

/**
 * 여행한 나라 지도와 그 위에 찍은 방문 장소.
 *
 * 나라 도형과 장소를 같은 투영으로 그려야 위치가 맞는다. 도형에 맞춰
 * 투영을 잡고, 장소의 위·경도를 그 투영에 그대로 통과시킨다.
 *
 * 나라 전체를 보여주므로 한 도시 안의 장소들은 거의 한 점에 모인다.
 * 그게 실제 위치라서 그대로 둔다.
 */

export interface MapPoint {
  key: string;
  latitude: number;
  longitude: number;
  /** 목록에서 몇 번째인지. 핀 옆 번호와 목록을 맞추는 데 쓴다 */
  index: number;
}

interface Props {
  /** 여행 카드가 주는 한글 나라 이름 (일본 · 베트남 …) */
  countryName: string | null | undefined;
  points: MapPoint[];
  width: number;
  height: number;
  onPressPoint?: (key: string) => void;
}

const CountryTripMap: React.FC<Props> = ({
  countryName,
  points,
  width,
  height,
  onPressPoint,
}) => {
  const drawing = useMemo(() => {
    const alpha2 = countryName ? ALPHA2_BY_KOREAN[countryName] : undefined;
    const numeric = alpha2 ? NUMERIC_BY_ALPHA2[alpha2] : undefined;
    if (!numeric) {
      return null;
    }
    const collection: any = feature(
      worldAtlas as any,
      (worldAtlas as any).objects.countries,
    );
    const target = collection.features.find(
      (f: any) => f.id != null && String(f.id) === numeric,
    );
    if (!target) {
      return null;
    }
    // 가장자리에 붙지 않게 안쪽으로 조금 줄여서 맞춘다
    const projection = geoMercator().fitSize(
      [width * 0.8, height * 0.8],
      target,
    );
    projection.translate([
      projection.translate()[0] + width * 0.1,
      projection.translate()[1] + height * 0.1,
    ]);
    return {
      d: geoPath(projection)(target) ?? '',
      pins: points
        .map(p => {
          const xy = projection([p.longitude, p.latitude]);
          return xy ? { ...p, x: xy[0], y: xy[1] } : null;
        })
        .filter((p): p is MapPoint & { x: number; y: number } => p !== null),
    };
  }, [countryName, points, width, height]);

  if (!drawing) {
    return null;
  }

  return (
    <Svg width={width} height={height}>
      <Path
        d={drawing.d}
        fill={colors.surfaceAlt}
        stroke={colors.border}
        strokeWidth={1}
      />
      {drawing.pins.map(pin => (
        <Circle
          key={pin.key}
          cx={pin.x}
          cy={pin.y}
          r={7}
          fill={colors.primary}
          onPress={() => onPressPoint?.(pin.key)}
        />
      ))}
    </Svg>
  );
};

export default CountryTripMap;
