import { authRequest } from '../../shared/api/http';

export interface VisitedRegion {
  regionCode: string;
  regionName: string;
  tripCount: number;
}

export interface RegionTrip {
  tripCardId: number;
  regionCode: string;
  cityName: string | null;
  points: [number, number][];
}

export interface RegionMap {
  totalRegions: number;
  visited: VisitedRegion[];
  trips?: RegionTrip[];
}

export function getRegionMap(): Promise<RegionMap> {
  return authRequest<RegionMap>('/api/region-map', { method: 'GET' });
}
