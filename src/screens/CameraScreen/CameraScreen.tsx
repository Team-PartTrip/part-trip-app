import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { cameraStyles as styles } from './CameraScreen.styles';
import CameraCapture from '../../component/CameraCapture';

interface CameraScreenProps {
  onOpenNearby?: () => void;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ onOpenNearby }) => {
  const [capturing, setCapturing] = useState(false);

  const handleCapture = (uri: string) => {
    setCapturing(false);
    // TODO: 촬영한 사진(uri)을 해설 카메라 분석 API로 전송
    console.log('촬영 완료:', uri);
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

        <TouchableOpacity style={styles.missionRow} activeOpacity={0.85}>
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
    </View>
  );
};

export default CameraScreen;
