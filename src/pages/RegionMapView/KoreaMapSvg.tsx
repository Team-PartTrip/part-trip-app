import React, { useMemo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import provincesTopo from '../../shared/assets/maps/skorea-provinces-topo.json';
import colors from '../../shared/tokens/colors';
import { codeOfMapCode } from '../../entities/region/regions';

interface RegionShape {
  code: string;
  d: string;
  feature: any;
}

const BASE_WIDTH = 600;
const BASE_HEIGHT = 720;

const COLLECTION: any = feature(
  provincesTopo as any,
  (provincesTopo as any).objects[
    Object.keys((provincesTopo as any).objects)[0]
  ],
);

const SHAPES: RegionShape[] = (() => {
  const projection = geoMercator().fitSize(
    [BASE_WIDTH, BASE_HEIGHT],
    COLLECTION,
  );
  const toPath = geoPath(projection);
  return COLLECTION.features
    .map((f: any) => ({
      code: codeOfMapCode(String(f.properties?.code)) ?? '',
      d: toPath(f) ?? '',
      feature: f,
    }))
    .filter((shape: RegionShape) => shape.code && shape.d);
})();

interface Props {
  visitedCodes: string[];
  width: number;
  selectedCode?: string | null;
  onPressRegion?: (code: string) => void;
}

const KoreaMapSvg: React.FC<Props> = ({
  visitedCodes,
  width,
  selectedCode,
  onPressRegion,
}) => {
  const visited = useMemo(() => new Set(visitedCodes), [visitedCodes]);
  const height = (width * BASE_HEIGHT) / BASE_WIDTH;
  const ordered = useMemo(
    () =>
      [...SHAPES].sort(
        (a, b) =>
          Number(a.code === selectedCode) - Number(b.code === selectedCode),
      ),
    [selectedCode],
  );

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${BASE_WIDTH} ${BASE_HEIGHT}`}
    >
      {ordered.map(shape => (
        <Path
          key={shape.code}
          d={shape.d}
          fill={visited.has(shape.code) ? colors.primary : colors.mapLand}
          stroke={shape.code === selectedCode ? colors.text : colors.background}
          strokeWidth={shape.code === selectedCode ? 3 : 1}
          onPress={onPressRegion ? () => onPressRegion(shape.code) : undefined}
        />
      ))}
    </Svg>
  );
};

export function RegionShapeSvg({ code, size }: { code: string; size: number }) {
  const d = useMemo(() => {
    const target = SHAPES.find(shape => shape.code === code)?.feature;
    if (!target) {
      return null;
    }
    const padded = size * 0.82;
    return (
      geoPath(geoMercator().fitSize([padded, padded], target))(target) ?? null
    );
  }, [code, size]);

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

export interface MapPoint {
  key: string;
  latitude: number;
  longitude: number;
  index: number;
}

export function TripRegionMap({
  regionCode,
  points,
  width,
  height,
  onPressPoint,
}: {
  regionCode: string | null | undefined;
  points: MapPoint[];
  width: number;
  height: number;
  onPressPoint?: (key: string) => void;
}) {
  const drawing = useMemo(() => {
    const target =
      SHAPES.find(shape => shape.code === regionCode)?.feature ?? COLLECTION;
    const projection = geoMercator().fitExtent(
      [
        [width * 0.1, height * 0.1],
        [width * 0.9, height * 0.9],
      ],
      target,
    );
    return {
      d: geoPath(projection)(target) ?? '',
      pins: points
        .map(p => {
          const xy = projection([p.longitude, p.latitude]);
          return xy ? { ...p, x: xy[0], y: xy[1] } : null;
        })
        .filter((p): p is MapPoint & { x: number; y: number } => p !== null),
    };
  }, [regionCode, points, width, height]);

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
}

export default KoreaMapSvg;
