import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { recordMapStyles as s } from './RecordMapView.styles';
import {
  sampleSpotsOf,
  sampleTripCardOf,
} from '../../entities/record/sampleData';
import { formatShortDate, PhotoSpot } from '../../entities/record/types';

const GRID_ROWS = [70, 140, 210, 280, 350, 420, 490];
const GRID_COLS = [60, 130, 200, 270, 340];

interface Props {
  tripCardId: number;
  onBack?: () => void;
  /** 촬영 위치를 눌러 그 장소의 사진을 본다 (D3) */
  onOpenSpot?: (spot: PhotoSpot) => void;
  /** 해설 카메라. 피그마에는 없지만 카메라로 들어갈 입구가 여기밖에 없다 */
  onCamera?: () => void;
}

const RecordMapView: React.FC<Props> = ({
  tripCardId,
  onBack,
  onOpenSpot,
  onCamera,
}) => {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'map' | 'list'>('map');

  const trip = sampleTripCardOf(tripCardId);
  const spots = sampleSpotsOf(tripCardId);


  const list = (
    <>
      <View style={s.sheetHead}>
        <Text style={s.sheetTitle}>촬영 위치 {spots.length}곳</Text>
        <TouchableOpacity hitSlop={8} onPress={() => setMode('map')}>
          <Text style={[s.toggle, mode === 'map' ? s.toggleOn : s.toggleOff]}>
            지도
          </Text>
        </TouchableOpacity>
        <TouchableOpacity hitSlop={8} onPress={() => setMode('list')}>
          <Text style={[s.toggle, mode === 'list' ? s.toggleOn : s.toggleOff]}>
            목록
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
      >
        {spots.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>아직 남긴 사진이 없어요</Text>
            <Text style={s.emptyDesc}>
              해설 카메라로 찍으면 여기에 위치가 표시돼요.
            </Text>
          </View>
        ) : (
          spots.map(spot => (
            <TouchableOpacity
              key={spot.tripCardPlaceId}
              style={s.row}
              activeOpacity={0.85}
              onPress={() => onOpenSpot?.(spot)}
            >
              <View style={s.thumb}>
                <Text style={s.thumbIcon}>📍</Text>
              </View>
              <View style={s.rowBody}>
                <Text style={s.rowTitle}>{spot.placeName}</Text>
                <Text style={s.rowMeta}>
                  사진 {spot.photoCount}장 · {formatShortDate(spot.visitedDate)}
                </Text>
              </View>
              <Text style={s.chevron}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </>
  );

  if (mode === 'list') {
    return (
      <SafeAreaView edges={['top']} style={s.safeArea}>
        <View style={s.listHeader}>
          <TouchableOpacity
            style={s.circleBtn}
            activeOpacity={0.8}
            onPress={onBack}
          >
            <Text style={s.circleBtnText}>‹</Text>
          </TouchableOpacity>
          <View style={s.placePill}>
            <Text style={s.placePillText}>
              {trip.countryName} · {trip.cityName}
            </Text>
          </View>
        </View>
        <View style={[s.sheet, s.sheetFull]}>{list}</View>
      </SafeAreaView>
    );
  }

  return (
    <View style={s.safeArea}>
      <View style={s.map}>
        {GRID_ROWS.map(top => (
          <View
            key={`r${top}`}
            style={[s.gridLine, s.gridRow, { top }]}
          />
        ))}
        {GRID_COLS.map(left => (
          <View
            key={`c${left}`}
            style={[s.gridLine, s.gridCol, { left }]}
          />
        ))}
        <View style={s.landmass} />

        {spots.map(spot => (
          <TouchableOpacity
            key={spot.tripCardPlaceId}
            style={[
              s.pin,
              { left: `${spot.x * 100}%`, top: `${spot.y * 100}%` },
            ]}
            activeOpacity={0.85}
            onPress={() => onOpenSpot?.(spot)}
          >
            <Text style={s.pinText}>{spot.photoCount}</Text>
          </TouchableOpacity>
        ))}

        <View style={[s.topBar, { top: insets.top + 8 }]}>
          <TouchableOpacity
            style={s.circleBtn}
            activeOpacity={0.8}
            onPress={onBack}
          >
            <Text style={s.circleBtnText}>‹</Text>
          </TouchableOpacity>
          <View style={s.placePill}>
            <Text style={s.placePillText}>
              {trip.countryName} · {trip.cityName}
            </Text>
          </View>
          <View style={s.topBarSpacer} />
          <TouchableOpacity
            style={s.circleBtn}
            activeOpacity={0.8}
            onPress={onCamera}
          >
            <Text style={s.circleBtnText}>📷</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[s.sheet, s.sheetPeek]}>
        <View style={s.handle} />
        {list}
      </View>
    </View>
  );
};

export default RecordMapView;
