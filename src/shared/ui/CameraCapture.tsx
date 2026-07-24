import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  type CameraRef,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import colors from '../tokens/colors';

interface Props {
  title?: string;
  onClose?: () => void;
  /** 촬영 완료 시 사진 경로(file://...) 전달. 촬영 실패해도 호출되어 다음 단계로 진행 */
  onCapture?: (uri: string) => void;
}

const CameraCapture: React.FC<Props> = ({
  title = '카메라',
  onClose,
  onCapture,
}) => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  // iOS 기본값(native)은 HEIC로 저장되어 서버 업로드(jpg/png/webp만 허용)에 실패하므로
  // 플랫폼과 무관하게 항상 JPEG로 저장되도록 강제
  const photoOutput = usePhotoOutput({ containerFormat: 'jpeg' });
  const cameraRef = useRef<CameraRef>(null);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const takePhoto = async () => {
    let uri = '';
    try {
      const file = await photoOutput.capturePhotoToFile({}, {});
      if (file?.filePath) uri = `file://${file.filePath}`;
    } catch {
      // 촬영 실패해도 다음 단계로 넘어감
    }
    onCapture?.(uri);
  };

  return (
    <View style={s.root}>
      {/* 카메라 미리보기 */}
      {hasPermission && device ? (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          outputs={[photoOutput]}
          isActive
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, s.center]}>
          {!hasPermission ? (
            <>
              <Text style={s.hint}>카메라 권한이 필요합니다.</Text>
              <TouchableOpacity onPress={() => Linking.openSettings()}>
                <Text style={s.settings}>설정에서 권한 허용</Text>
              </TouchableOpacity>
            </>
          ) : (
            <ActivityIndicator color="#fff" />
          )}
        </View>
      )}

      {/* 3x3 그리드 */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[s.v, { left: '33.33%' }]} />
        <View style={[s.v, { left: '66.66%' }]} />
        <View style={[s.h, { top: '33.33%' }]} />
        <View style={[s.h, { top: '66.66%' }]} />
      </View>

      {/* 상단 타이틀 */}
      <SafeAreaView edges={['top']} style={s.headerWrap}>
        <View style={s.header}>
          <Text style={s.title}>{title}</Text>
        </View>
      </SafeAreaView>

      {/* 하단: 뒤로가기(왼쪽) + 셔터(가운데) */}
      <SafeAreaView edges={['bottom']} style={s.bottomWrap}>
        <View style={s.bottom}>
          <TouchableOpacity
            style={s.sideBtn}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={s.back}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.shutter}
            activeOpacity={0.8}
            onPress={takePhoto}
          >
            <View style={s.shutterIn} />
          </TouchableOpacity>

          {/* 셔터 가운데 정렬용 빈 영역 */}
          <View style={s.sideBtn} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  center: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  hint: { color: '#fff', fontSize: 15 },
  settings: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  headerWrap: { position: 'absolute', top: 0, left: 0, right: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 48,
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
  v: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  h: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  bottomWrap: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  sideBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: { color: '#fff', fontSize: 34, lineHeight: 36 },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterIn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
});

export default CameraCapture;
