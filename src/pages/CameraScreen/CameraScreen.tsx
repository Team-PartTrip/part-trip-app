import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { cameraStyles as styles } from './CameraScreen.styles';
import CameraCapture from '../../shared/ui/CameraCapture';
import { uploadGuideCameraPhoto } from '../../entities/guide-camera/api';
import { getCurrentLocation } from '../../shared/lib/getCurrentLocation';

interface CameraScreenProps {
  onOpenNearby?: () => void;
  onOpenMissions?: () => void;
  onCaptured?: (imageId: number, photoUri: string) => void;
}

const CameraScreen: React.FC<CameraScreenProps> = ({
  onOpenNearby,
  onOpenMissions,
  onCaptured,
}) => {
  const [capturing, setCapturing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleCapture = async (uri: string) => {
    setCapturing(false);
    if (!uri) return;

    try {
      setAnalyzing(true);
      const { latitude, longitude } = await getCurrentLocation();
      const result = await uploadGuideCameraPhoto(
        uri,
        `guide-${Date.now()}.jpg`,
        'image/jpeg',
        latitude,
        longitude,
      );
      onCaptured?.(result.imageId, uri);
    } catch (e: any) {
      Alert.alert(
        '분석 실패',
        e?.message ?? '사진 분석 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.banner}
          activeOpacity={0.85}
          onPress={onOpenNearby}
        >
          <View style={styles.bannerOverlay} />
          <Text style={styles.bannerTitle}>근처 명소 추천</Text>
          <Text style={styles.bannerSub}>현 위치 기준으로 추천받으러 가기</Text>
        </TouchableOpacity>

        <View style={styles.cameraCard}>
          <View style={styles.cameraCircle}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
          <Text style={styles.cameraTitle}>해설 카메라</Text>
          <Text style={styles.cameraDesc}>
            여행지의 숨은 이야기를 AI 카메라 해설로{'\n'}들어보세요.
          </Text>
          <TouchableOpacity
            style={styles.shootBtn}
            activeOpacity={0.85}
            onPress={() => setCapturing(true)}
          >
            <Text style={styles.shootBtnText}>여행지 촬영하기</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.missionRow}
          activeOpacity={0.85}
          onPress={onOpenMissions}
        >
          <View style={styles.missionTextWrap}>
            <Text style={styles.missionTitle}>미션 추가 목록</Text>
            <Text style={styles.missionDesc}>
              해설 카메라 미션 추가 목록 확인하러 가기
            </Text>
          </View>
          <Text style={styles.missionArrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={capturing}
        animationType="slide"
        onRequestClose={() => setCapturing(false)}
      >
        <CameraCapture
          title="해설 카메라"
          onClose={() => setCapturing(false)}
          onCapture={handleCapture}
        />
      </Modal>

      <Modal visible={analyzing} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: '#fff', marginTop: 16, fontSize: 15 }}>
            AI가 사진을 분석하고 있어요...
          </Text>
        </View>
      </Modal>
    </View>
  );
};

export default CameraScreen;
