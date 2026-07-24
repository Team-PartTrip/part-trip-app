import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../shared/ui/ScreenHeader';
import { recordMapStyles as s } from './RecordMapView.styles';

interface RouteItem {
  id: string;
  order: number;
  title: string;
  desc: string;
  time: string;
  date: string;
}

const ROUTES: RouteItem[] = [
  {
    id: 'r1',
    order: 1,
    title: '싱가포르의 라이트쇼',
    desc: '멋있는 싱가포르의 라이트쇼를 보았다.',
    time: '오후 19:40',
    date: '2024.05.12',
  },
];

interface Props {
  onBack?: () => void;
  onToggleList?: () => void;
  onOpenRecord?: (id: string) => void;
}

const RecordMapView: React.FC<Props> = ({
  onBack,
  onToggleList,
  onOpenRecord,
}) => (
  <SafeAreaView style={s.safe} edges={['top']}>
    <ScreenHeader title="2026 여름의 싱가포르 🇸🇬" onBack={onBack} />
    <View style={s.map}>
      <View style={s.mapHint}>
        <Text style={s.mapHintText}>여행 경로</Text>
      </View>
      <View style={[s.marker, { top: '30%', left: '28%' }]}>
        <Text style={s.markerPin}>📍</Text>
      </View>
      <View style={[s.marker, { top: '52%', left: '58%' }]}>
        <Text style={s.markerPin}>📍</Text>
      </View>
      <View style={[s.fabCol, { bottom: 24 }]}>
        <TouchableOpacity
          style={s.fab}
          activeOpacity={0.85}
          onPress={onToggleList}
        >
          <Text style={s.fabIcon}>🗒️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.fab} activeOpacity={0.85}>
          <Text style={s.fabIcon}>📍</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={s.sheet}>
      <View style={s.handle} />
      <Text style={s.sheetTitle}>최근 방문지</Text>
      {ROUTES.map(r => (
        <TouchableOpacity
          key={r.id}
          style={s.routeCard}
          activeOpacity={0.9}
          onPress={() => onOpenRecord?.(r.id)}
        >
          <View style={s.routeThumb} />
          <View style={s.routeBody}>
            <View style={s.routeBadge}>
              <Text style={s.routeBadgeText}>경로 {r.order}</Text>
            </View>
            <Text style={s.routeTitle}>{r.title}</Text>
            <Text style={s.routeDesc} numberOfLines={1}>
              {r.desc}
            </Text>
            <Text style={s.routeMeta}>
              {r.time} · {r.date}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </SafeAreaView>
);

export default RecordMapView;
