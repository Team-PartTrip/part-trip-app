#!/usr/bin/env bash
# 시뮬레이터에 빌드·설치·실행한다.
#
# `react-native run-ios` 를 쓰지 않는 이유:
# RN CLI 는 시뮬레이터 창을 띄우려고 "$(xcode-select -p)/Applications/Simulator.app" 을
# 하드코딩해서 여는데, Xcode 27 은 Simulator.app 을 DeviceHub.app 으로 바꿨다.
# 그래서 그 한 줄에서 죽는다. 여기서는 GUI 를 직접 찾아 열고 나머지는 simctl 로 한다.
#
#   ./scripts/ios-sim.sh                 기본 기기로 빌드 후 실행
#   ./scripts/ios-sim.sh "iPhone 17 Pro" 기기 지정
#   ./scripts/ios-sim.sh --no-build      네이티브 빌드 없이 설치·실행만 (JS 수정은 이걸로 충분)

set -euo pipefail

cd "$(dirname "$0")/.."

SCHEME="PartTrip"
WORKSPACE="ios/PartTrip.xcworkspace"
DERIVED="ios/build/dd"
APP_PATH="$DERIVED/Build/Products/Debug-iphonesimulator/$SCHEME.app"

DEVICE="iPhone 17"
BUILD=1
for arg in "$@"; do
  case "$arg" in
    --no-build) BUILD=0 ;;
    *) DEVICE="$arg" ;;
  esac
done

# ── 기기 찾기 ────────────────────────────────────────────────
UDID=$(xcrun simctl list devices available \
  | grep -F "$DEVICE (" \
  | head -1 \
  | sed -E 's/.*\(([0-9A-F-]{36})\).*/\1/')

if [ -z "$UDID" ]; then
  echo "시뮬레이터를 찾을 수 없습니다: $DEVICE"
  echo "사용 가능한 기기:"
  xcrun simctl list devices available | grep -E '^\s+iPhone'
  exit 1
fi
echo "기기: $DEVICE ($UDID)"

# ── 부팅 ─────────────────────────────────────────────────────
if ! xcrun simctl list devices booted | grep -q "$UDID"; then
  echo "부팅 중..."
  xcrun simctl boot "$UDID"
fi

# ── 화면 띄우기 (Xcode 버전에 따라 이름이 다르다) ─────────────
DEV_DIR=$(xcode-select -p)
XCODE_APP="${DEV_DIR%/Contents/Developer}"
for gui in \
  "$DEV_DIR/Applications/Simulator.app" \
  "$XCODE_APP/Contents/Applications/DeviceHub.app"
do
  if [ -d "$gui" ]; then
    open -a "$gui" --args -CurrentDeviceUDID "$UDID" || true
    break
  fi
done

# ── 빌드 ─────────────────────────────────────────────────────
if [ "$BUILD" = "1" ]; then
  echo "빌드 중... (JS 만 고쳤다면 --no-build 로 건너뛸 수 있습니다)"
  xcodebuild \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -configuration Debug \
    -destination "id=$UDID" \
    -derivedDataPath "$DERIVED" \
    build
fi

if [ ! -d "$APP_PATH" ]; then
  echo "빌드 산출물이 없습니다: $APP_PATH"
  echo "--no-build 없이 한 번 실행해 주세요."
  exit 1
fi

# ── 설치 · 실행 ──────────────────────────────────────────────
BUNDLE_ID=$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$APP_PATH/Info.plist")
xcrun simctl install "$UDID" "$APP_PATH"
xcrun simctl launch "$UDID" "$BUNDLE_ID"
echo "실행됨: $BUNDLE_ID"
