import React, { useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import provincesTopo from '../../shared/assets/maps/skorea-provinces-topo.json';
import colors from '../../shared/tokens/colors';
import { codeOfMapCode } from '../../entities/region/regions';
import { visibleBox, Zoom } from '../../shared/ui/ZoomableView';

interface RegionShape {
  code: string;
  d: string;
  feature: any;
}

const BASE_WIDTH = 600;
const BASE_HEIGHT = 720;
const MAP_PADDING = 20;

export const mapHeight = (width: number) => (width * BASE_HEIGHT) / BASE_WIDTH;

const COLLECTION: any = feature(
  provincesTopo as any,
  (provincesTopo as any).objects[
    Object.keys((provincesTopo as any).objects)[0]
  ],
);

const SHAPES: RegionShape[] = (() => {
  // 울릉도 · 독도가 오른쪽 끝에 닿아 테두리가 잘린다. 안쪽 여백을 둔다
  const projection = geoMercator().fitExtent(
    [
      [MAP_PADDING, MAP_PADDING],
      [BASE_WIDTH - MAP_PADDING, BASE_HEIGHT - MAP_PADDING],
    ],
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
  zoom?: Zoom;
}

const KoreaMapSvg: React.FC<Props> = ({
  visitedCodes,
  width,
  selectedCode,
  onPressRegion,
  zoom = { scale: 1, x: 0, y: 0 },
}) => {
  const visited = useMemo(() => new Set(visitedCodes), [visitedCodes]);
  const height = mapHeight(width);
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
      viewBox={(() => {
        const b = visibleBox(zoom, width, height, BASE_WIDTH, BASE_HEIGHT);
        return `${b.x} ${b.y} ${b.width} ${b.height}`;
      })()}
    >
      {ordered.map(shape => (
        <Path
          key={shape.code}
          d={shape.d}
          fill={visited.has(shape.code) ? colors.primary : colors.mapLand}
          stroke={shape.code === selectedCode ? colors.text : colors.background}
          strokeWidth={shape.code === selectedCode ? 2 : 0.6}
          vectorEffect="non-scaling-stroke"
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

export default KoreaMapSvg;
