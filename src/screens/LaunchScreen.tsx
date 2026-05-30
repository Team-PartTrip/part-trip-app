import React, { useEffect, useRef } from 'react';
import colors from '../assets/constants/colors';

import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ─── 타이밍 상수 (ms) ────────────────────────────────────────────
const LOGO_FADE_DURATION   = 700;   // 로고 페이드인 시간
const SLOGAN_DELAY         = 400;   // 슬로건 등장 딜레이
const SLOGAN_DURATION      = 500;   // 슬로건 애니메이션 시간
const SHIMMER_START_DELAY  = 800;   // shimmer 시작 딜레이
const TOTAL_DISPLAY_TIME   = 2000;  // 런치스크린 총 표시 시간
const FADE_OUT_DURATION    = 400;   // 화면 전환 페이드아웃 시간
// ─────────────────────────────────────────────────────────────────

interface LaunchScreenProps {
  onFinish?: () => void; // 완료 시 메인뷰로 전환 콜백
}

const PartTripLogo: React.FC<{ animValue: Animated.Value }> = ({ animValue }) => {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoRow}>
        <Text style={[styles.logoText, styles.logoPart]}>Part</Text>
        <View style={styles.tripWrapper}>
          <Text style={[styles.logoText, styles.logoTrip]}>Trip</Text>
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [
                  {
                    translateX: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-120, 120],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </View>
      <Text style={[styles.slogan, { color: colors.text }]}>여행의 모든 순간, 함께</Text>
    </View>
  );
};

const LaunchScreen: React.FC<LaunchScreenProps> = ({ onFinish }) => {
  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const scaleAnim   = useRef(new Animated.Value(0.85)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const sloganFade  = useRef(new Animated.Value(0)).current;
  const sloganSlide = useRef(new Animated.Value(12)).current;
  const screenFade  = useRef(new Animated.Value(1)).current; // 전체 화면 페이드아웃용

  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1) 로고 등장
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: LOGO_FADE_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    // 2) 슬로건 딜레이 등장
    const sloganTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(sloganFade, {
          toValue: 1,
          duration: SLOGAN_DURATION,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sloganSlide, {
          toValue: 0,
          duration: SLOGAN_DURATION,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }, SLOGAN_DELAY);

    // 3) Shimmer 루프
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const shimmerTimer = setTimeout(() => shimmerLoop.start(), SHIMMER_START_DELAY);

    // 4) 하단 점 펄스
    const dotLoop = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 900,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );

    dotLoop(dot1, 0).start();
    dotLoop(dot2, 300).start();
    dotLoop(dot3, 600).start();

    // 5) TOTAL_DISPLAY_TIME 후 페이드아웃 → onFinish 호출
    const finishTimer = setTimeout(() => {
      shimmerLoop.stop();
      Animated.timing(screenFade, {
        toValue: 0,
        duration: FADE_OUT_DURATION,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onFinish?.();
      });
    }, TOTAL_DISPLAY_TIME);

    return () => {
      clearTimeout(sloganTimer);
      clearTimeout(shimmerTimer);
      clearTimeout(finishTimer);
      shimmerLoop.stop();
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenFade }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.View
        style={[
          styles.centerContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <PartTripLogo animValue={shimmerAnim} />

        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: sloganFade,
              transform: [{ translateY: sloganSlide }],
            },
          ]}
        >
        </Animated.Text>
      </Animated.View>

      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
      </View>
    </Animated.View>
  );
};

const BRAND_BLUE      = '#1a7fd4';
const BRAND_BLUE_DARK = '#155fa0';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#e8f4fd',
    top: -width * 0.5,
    right: -width * 0.4,
    opacity: 0.6,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#deeefa',
    bottom: -width * 0.2,
    left: -width * 0.2,
    opacity: 0.5,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 52,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: -1,
  },
  logoPart: {
    color: BRAND_BLUE,
  },
  tripWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  logoTrip: {
    color: BRAND_BLUE_DARK,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 40,
    backgroundColor: 'rgba(255,255,255,0.38)',
    transform: [{ skewX: '-20deg' }],
  },
  slogan: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#2c5f8a',
    letterSpacing: 0.5,
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
    color: '#7aadce',
    letterSpacing: 1.2,
    fontWeight: '400',
  },
  dotsRow: {
    position: 'absolute',
    bottom: height * 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: BRAND_BLUE,
  },
});

export default LaunchScreen;