import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../tokens/colors';

export const MIN_SCALE = 1;
export const MAX_SCALE = 4;
const STEP = 1.6;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export function clampPan(
  scale: number,
  width: number,
  height: number,
  x: number,
  y: number,
) {
  const maxX = ((scale - 1) * width) / 2;
  const maxY = ((scale - 1) * height) / 2;
  return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
}

const distance = (e: GestureResponderEvent) => {
  const [a, b] = e.nativeEvent.touches;
  return Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
};

const ZoomableView: React.FC<{
  width: number;
  height: number;
  /** 함수로 주면 현재 배율을 받는다. 핀처럼 커지면 안 되는 것을 줄일 때 쓴다 */
  children: React.ReactNode | ((scale: number) => React.ReactNode);
  controlsStyle?: StyleProp<ViewStyle>;
  onZoomedChange?: (zoomed: boolean) => void;
}> = ({ width, height, children, controlsStyle, onZoomedChange }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  // 제스처 중 계산에 쓰는 현재 값. Animated 값은 바로 읽을 수 없다
  const now = useRef({ scale: 1, x: 0, y: 0 });
  const start = useRef({ scale: 1, x: 0, y: 0, dist: 0 });
  const [zoomed, setZoomed] = useState(false);
  const [liveScale, setLiveScale] = useState(1);
  const frame = useRef<number | null>(null);
  const wantsScale = typeof children === 'function';

  const apply = (next: { scale: number; x: number; y: number }) => {
    const s = clamp(next.scale, MIN_SCALE, MAX_SCALE);
    const p = clampPan(s, width, height, next.x, next.y);
    now.current = { scale: s, ...p };
    scale.setValue(s);
    pan.setValue(p);
    // 한 프레임에 한 번만 다시 그린다
    if (wantsScale && frame.current === null) {
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        setLiveScale(now.current.scale);
      });
    }
  };
  const settle = () => {
    const isZoomed = now.current.scale > 1.02;
    if (!isZoomed) {
      apply({ scale: 1, x: 0, y: 0 });
    }
    if (isZoomed !== zoomed) {
      setZoomed(isZoomed);
      onZoomedChange?.(isZoomed);
    }
  };

  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (e, g) =>
          e.nativeEvent.touches.length >= 2 ||
          (now.current.scale > 1 && Math.hypot(g.dx, g.dy) > 6),
        onPanResponderGrant: e => {
          start.current = {
            ...now.current,
            dist: e.nativeEvent.touches.length >= 2 ? distance(e) : 0,
          };
        },
        onPanResponderMove: (e, g) => {
          const base = start.current;
          let nextScale = base.scale;
          if (e.nativeEvent.touches.length >= 2) {
            // 한 손가락으로 시작해 두 번째 손가락이 늦게 닿을 때
            if (!base.dist) {
              start.current = { ...now.current, dist: distance(e) };
              return;
            }
            nextScale = (base.scale * distance(e)) / base.dist;
          }
          apply({ scale: nextScale, x: base.x + g.dx, y: base.y + g.dy });
        },
        onPanResponderRelease: settle,
        onPanResponderTerminate: settle,
        // 지도를 움직이는 중에 바깥 스크롤이 가져가지 않게 한다
        onPanResponderTerminationRequest: () => false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, height, zoomed],
  );

  const zoomBy = (factor: number) => {
    apply({
      scale: now.current.scale * factor,
      x: now.current.x * factor,
      y: now.current.y * factor,
    });
    settle();
  };

  return (
    <View style={[controls.frame, { width, height }]}>
      <Animated.View
        {...responder.panHandlers}
        style={{
          width,
          height,
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }],
        }}
      >
        {typeof children === 'function' ? children(liveScale) : children}
      </Animated.View>
      <View style={[controls.box, controlsStyle]}>
        <TouchableOpacity
          style={controls.btn}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="지도 크게"
          onPress={() => zoomBy(STEP)}
        >
          <Text style={controls.text}>+</Text>
        </TouchableOpacity>
        <View style={controls.line} />
        <TouchableOpacity
          style={controls.btn}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="지도 작게"
          disabled={!zoomed}
          onPress={() => zoomBy(1 / STEP)}
        >
          <Text style={[controls.text, !zoomed && controls.off]}>−</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const controls = StyleSheet.create({
  frame: { overflow: 'hidden' },
  box: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  btn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: { height: 1, backgroundColor: colors.border },
  text: { fontSize: 24, fontWeight: '600', color: colors.text },
  off: { color: colors.textTertiary },
});

export default ZoomableView;
