import { feature, merge } from 'topojson-client';
import { geoBounds, geoContains } from 'd3-geo';
import municipalitiesTopo from '../../shared/assets/maps/skorea-municipalities-topo.json';
import { codeOfMapCode, isMetro } from '../../entities/region/regions';
import { RegionTrip } from '../../entities/region/api';

export interface District {
  id: string;
  name: string;
  regionCode: string;
  feature: any;
  bounds: [[number, number], [number, number]];
}

const TOPO: any = municipalitiesTopo;
const OBJECT = TOPO.objects[Object.keys(TOPO.objects)[0]];

export const DISTRICTS: District[] = (() => {
  const groups = new Map<string, { name: string; regionCode: string; geometries: any[] }>();
  for (const g of OBJECT.geometries) {
    const regionCode = codeOfMapCode(String(g.properties.code).slice(0, 2));
    if (!regionCode) {
      continue;
    }
    const name = String(g.properties.name).replace(/^(.+시).+구$/, '$1');
    const id = `${regionCode}-${name}`;
    const group = groups.get(id) ?? { name, regionCode, geometries: [] };
    group.geometries.push(g);
    groups.set(id, group);
  }
  return [...groups].map(([id, group]) => {
    const f: any =
      group.geometries.length === 1
        ? feature(TOPO, group.geometries[0])
        : { type: 'Feature', properties: {}, geometry: merge(TOPO, group.geometries) };
    return { id, name: group.name, regionCode: group.regionCode, feature: f, bounds: geoBounds(f) as District['bounds'] };
  });
})();

const bare = (name: string) => name.trim().replace(/(시|군)$/, '');

function containing(districts: District[], lat: number, lng: number) {
  return districts.find(
    d =>
      lng >= d.bounds[0][0] &&
      lng <= d.bounds[1][0] &&
      lat >= d.bounds[0][1] &&
      lat <= d.bounds[1][1] &&
      geoContains(d.feature, [lng, lat]),
  );
}

export function visitedDistricts(trips: RegionTrip[]): Set<string> {
  const visited = new Set<string>();
  for (const trip of trips) {
    const inRegion = DISTRICTS.filter(d => d.regionCode === trip.regionCode);
    let found = false;
    for (const [lat, lng] of trip.points ?? []) {
      const d = containing(inRegion, lat, lng);
      if (d) {
        visited.add(d.id);
        found = true;
      }
    }
    if (found) {
      continue;
    }
    const byName =
      isMetro(trip.regionCode)
        ? inRegion.length === 1 ? inRegion[0] : undefined
        : inRegion.find(d => bare(d.name) === bare(trip.cityName ?? ''));
    if (byName) {
      visited.add(byName.id);
    }
  }
  return visited;
}
