import type { SelectedDestination } from './DestinationPickerView';

let callback: ((d: SelectedDestination) => void) | null = null;

/** PostCreateView가 여행지 선택 화면으로 이동하기 직전에 자신의 상태 업데이트 함수를 등록 */
export function setDestinationCallback(
  cb: (d: SelectedDestination) => void,
): void {
  callback = cb;
}

/** DestinationPickerView가 선택 완료 시 등록된 콜백을 호출 */
export function consumeDestinationCallback(d: SelectedDestination): void {
  callback?.(d);
  callback = null;
}
