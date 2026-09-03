import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../shared/ui/ScreenHeader';
import { placeDetailStyles as s } from './PlaceDetailView.styles';
import { TourPlace } from '../../entities/main/api';
import { toImageUrl } from '../../shared/api/image';

interface Props {
  place: TourPlace;
  onBack?: () => void;
}

/**
 * 지도 앱으로 넘긴다.
 *
 * 앱 안에 지도를 넣지 않았다. 세계지도·기록 지도는 나라 모양만 그리는
 * SVG 라 길찾기를 못 한다. 좌표를 넘겨 기기의 지도 앱에 맡긴다.
 */
function openMap(place: TourPlace) {
  const label = encodeURIComponent(place.placeName);
  const url = Platform.select({
    ios: `maps://?q=${label}&ll=${place.latitude},${place.longitude}`,
    default: `geo:${place.latitude},${place.longitude}?q=${label}`,
  });
  Linking.openURL(url).catch(() =>
    Alert.alert('알림', '지도 앱을 열 수 없어요.'),
  );
}

const PlaceDetailView: React.FC<Props> = ({ place, onBack }) => (
  <View style={s.safeArea}>
    <SafeAreaView edges={['top']}>
      <ScreenHeader title="장소" onBack={onBack} />
    </SafeAreaView>

    <ScrollView
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {place.imageUrl ? (
        <Image
          source={{ uri: toImageUrl(place.imageUrl) }}
          style={s.cover}
          resizeMode="cover"
        />
      ) : (
        // 사진 없는 장소가 많다. 빈 상자 대신 자리만 잡는다.
        <View style={[s.cover, s.coverEmpty]} />
      )}

      <Text style={s.name}>{place.placeName}</Text>

      <View style={s.metaRow}>
        {!!place.category && (
          <View style={s.chip}>
            <Text style={s.chipText}>{place.category}</Text>
          </View>
        )}
        {place.rating !== null && (
          <Text style={s.rating}>★ {place.rating.toFixed(1)}</Text>
        )}
      </View>

      {!!place.address && <Text style={s.address}>{place.address}</Text>}

      {!!place.description && (
        <Text style={s.description}>{place.description}</Text>
      )}
    </ScrollView>

    <SafeAreaView edges={['bottom']} style={s.footer}>
      <TouchableOpacity
        style={s.primaryBtn}
        activeOpacity={0.85}
        onPress={() => openMap(place)}
      >
        <Text style={s.primaryText}>지도에서 보기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  </View>
);

export default PlaceDetailView;
