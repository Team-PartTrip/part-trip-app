import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { regionMapStyles as s } from './RegionMapView.styles';
import KoreaMapSvg, { mapHeight } from './KoreaMapSvg';
import ZoomableView from '../../shared/ui/ZoomableView';
import { getRegionMap, RegionMap } from '../../entities/region/api';
import { shortName } from '../../entities/region/regions';

interface Props {
  onBack?: () => void;
}

const RegionMapView: React.FC<Props> = ({ onBack }) => {
  const { width } = useWindowDimensions();
  const [map, setMap] = useState<RegionMap | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setLoading(true);
      setFailed(false);
      getRegionMap()
        .then(data => alive && setMap(data))
        .catch(() => {
          if (alive) {
            setMap(null);
            setFailed(true);
          }
        })
        .finally(() => alive && setLoading(false));
      return () => {
        alive = false;
      };
    }, []),
  );

  if (loading) {
    return (
      <View style={s.safeArea}>
        <ActivityIndicator style={s.loading} />
      </View>
    );
  }

  const visited = map?.visited ?? [];
  const total = map?.totalRegions ?? 17;
  // 누른 곳을 다시 누르면 푼다
  const toggle = (code: string) =>
    setSelected(prev => (prev === code ? null : code));

  return (
    <View style={s.safeArea}>
      <ScrollView
        scrollEnabled={!zoomed}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']} style={s.header}>
          <View style={s.headerRow}>
            <Text style={s.title}>내가 다녀온 곳</Text>
            <TouchableOpacity
              onPress={onBack}
              hitSlop={12}
              style={s.backBtn}
              accessibilityRole="button"
              accessibilityLabel="뒤로"
            >
              <Text style={s.back}>‹</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={s.map}>
          <ZoomableView
            width={width - 48}
            height={mapHeight(width - 48)}
            onZoomedChange={setZoomed}
          >
            {zoom => (
              <KoreaMapSvg
                visitedCodes={visited.map(v => v.regionCode)}
                width={width - 48}
                selectedCode={selected}
                onPressRegion={toggle}
                zoom={zoom}
              />
            )}
          </ZoomableView>
        </View>

        <View style={s.legend}>
          <View style={s.legendItem}>
            <View style={[s.legendDot, s.legendDotVisited]} />
            <Text style={s.legendText}>
              다녀온 곳 {visited.length} / {total}
            </Text>
          </View>
          <View style={s.legendItem}>
            <View style={[s.legendDot, s.legendDotIdle]} />
            <Text style={s.legendText}>아직 안 가본 곳</Text>
          </View>
        </View>

        <View style={s.section}>
          <View style={s.sectionHead}>
            <Text style={s.sectionTitle}>다녀온 시·도</Text>
          </View>

          {visited.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>
                {failed
                  ? '지도를 불러오지 못했어요'
                  : '아직 다녀온 곳이 없어요'}
              </Text>
              <Text style={s.emptyDesc}>
                {failed
                  ? '잠시 후 다시 시도해주세요.'
                  : '여행 일정을 확정하면 지도에 그 지역이 칠해져요.'}
              </Text>
            </View>
          ) : (
            [...visited]
              .sort((a, b) => b.tripCount - a.tripCount)
              .map(region => (
                <TouchableOpacity
                  key={region.regionCode}
                  style={[
                    s.regionRow,
                    selected === region.regionCode && s.regionRowOn,
                  ]}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: selected === region.regionCode,
                  }}
                  onPress={() => toggle(region.regionCode)}
                >
                  <View style={s.regionBadge}>
                    <Text style={s.regionBadgeText}>
                      {shortName(region.regionName)}
                    </Text>
                  </View>
                  <View style={s.regionBody}>
                    <Text style={s.regionName}>{region.regionName}</Text>
                    <Text style={s.regionMeta}>여행 {region.tripCount}번</Text>
                  </View>
                </TouchableOpacity>
              ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default RegionMapView;
