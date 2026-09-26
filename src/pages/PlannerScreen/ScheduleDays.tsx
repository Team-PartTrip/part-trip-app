import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Animated,
} from 'react-native';
import { planStatusStyles as s } from './PlanStatusView.styles';
import { touch48 } from '../../shared/ui/hitSlop';
import type { PlannerSchedule, ScheduleSlot } from '../../entities/planner/api';
import { dayLabel } from '../../entities/planner/types';
import CategoryIcon from '../../entities/planner/CategoryIcon';
import colors from '../../shared/tokens/colors';
import { GripIcon } from '../../shared/ui/icons';

/** 리더가 카드를 고칠 때만 넘긴다 (명세 Func-011-03). 없으면 보기 전용이다 */
export interface ScheduleEditHandlers {
  /** 저장 중에는 막는다. 저장 결과가 오기 전에 또 고치면 id 가 어긋난다 */
  disabled: boolean;
  /** 다른 카드와 바꿀 카드를 고르는 중이면 그 칸 id */
  swapping: number | null;
  onPick: (slot: ScheduleSlot, date: string) => void;
  onMenu: (
    slot: ScheduleSlot,
    date: string,
    index: number,
    count: number,
  ) => void;
  onMove: (date: string, from: number, to: number) => void;
  onSwapTarget: (slot: ScheduleSlot) => void;
  onAdd: (date: string) => void;
  /** 끄는 동안 바깥 스크롤을 멈춘다. 안 그러면 끌다가 화면이 같이 움직인다 */
  onDragging: (dragging: boolean) => void;
}

export function dropIndex(from: number, dy: number, heights: number[]): number {
  let to = from;
  let left = dy;
  while (left > 0 && to < heights.length - 1 && left > heights[to + 1] / 2) {
    left -= heights[to + 1];
    to += 1;
  }
  while (left < 0 && to > 0 && -left > heights[to - 1] / 2) {
    left += heights[to - 1];
    to -= 1;
  }
  return to;
}

const DayCards: React.FC<{
  date: string;
  slots: ScheduleSlot[];
  edit?: ScheduleEditHandlers;
}> = ({ date, slots, edit }) => {
  const heights = useRef<number[]>([]);
  const dy = useRef(new Animated.Value(0)).current;
  const [dragging, setDragging] = useState<number | null>(null);

  // ponytail: 칸마다 렌더 때 새로 만든다. 칸 수가 하루 10개 안쪽이라 문제없다
  const handle = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => !edit?.disabled,
      onMoveShouldSetPanResponder: () => !edit?.disabled,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        dy.setValue(0);
        setDragging(index);
        edit?.onDragging(true);
      },
      onPanResponderMove: (_, g) => dy.setValue(g.dy),
      onPanResponderRelease: (_, g) => {
        const to = dropIndex(index, g.dy, heights.current);
        setDragging(null);
        dy.setValue(0);
        edit?.onDragging(false);
        // 거의 안 움직였으면 끈 게 아니라 누른 것이다 — 메뉴를 연다
        if (Math.abs(g.dy) < 6) {
          edit?.onMenu(slots[index], date, index, slots.length);
        } else if (to !== index) {
          edit?.onMove(date, index, to);
        }
      },
      onPanResponderTerminate: () => {
        setDragging(null);
        dy.setValue(0);
        edit?.onDragging(false);
      },
    }).panHandlers;

  return (
    <>
      {slots.map((slot, index) => {
        const swapSource = edit?.swapping === slot.slotId;
        const choosingTarget = edit?.swapping != null && !swapSource;
        const body = slot.place ? (
          <>
            <View style={s.thumb}>
              <CategoryIcon
                category={slot.place.category}
                color={colors.primary}
              />
            </View>
            <View style={s.rowBody}>
              <Text style={s.rowSub}>
                {slot.order}번째
                {slot.place.categoryLabel
                  ? ` · ${slot.place.categoryLabel}`
                  : ''}
              </Text>
              <Text style={s.rowTitle} numberOfLines={1}>
                {slot.place.name}
              </Text>
            </View>
          </>
        ) : (
          <Text style={[s.rowBody, s.emptySlotText]}>
            {slot.order}번째 · {edit ? '+ 장소 고르기' : '비어 있는 칸'}
          </Text>
        );

        return (
          <Animated.View
            key={slot.slotId}
            onLayout={e => {
              heights.current[index] = e.nativeEvent.layout.height;
            }}
            style={[
              dragging === index && { transform: [{ translateY: dy }] },
              dragging === index && s.dragging,
            ]}
          >
            <TouchableOpacity
              style={[
                slot.place ? s.row : s.emptySlot,
                s.editRow,
                swapSource && s.swapSource,
              ]}
              activeOpacity={edit ? 0.8 : 1}
              disabled={
                !edit || edit.disabled || (!!slot.place && !choosingTarget)
              }
              accessibilityRole={edit ? 'button' : undefined}
              accessibilityLabel={
                choosingTarget
                  ? `${slot.order}번째 칸과 바꾸기`
                  : !slot.place && edit
                  ? `${slot.order}번째 칸에 장소 고르기`
                  : undefined
              }
              onPress={() =>
                choosingTarget
                  ? edit?.onSwapTarget(slot)
                  : edit?.onPick(slot, date)
              }
            >
              {body}
              {edit && !choosingTarget && (
                <View
                  {...handle(index)}
                  hitSlop={touch48(32)}
                  style={s.handle}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`${slot.order}번째 칸 옮기기 · 바꾸기 메뉴`}
                  onAccessibilityTap={() =>
                    edit.onMenu(slot, date, index, slots.length)
                  }
                >
                  <View style={s.handleText}>
                    <GripIcon size={24} color={colors.textSecondary} />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        );
      })}
      {edit && (
        <TouchableOpacity
          style={s.addSlot}
          activeOpacity={0.8}
          disabled={edit.disabled}
          accessibilityRole="button"
          onPress={() => edit.onAdd(date)}
        >
          <Text style={s.addSlotText}>+ 칸 추가</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const ScheduleDays: React.FC<{
  schedule: PlannerSchedule;
  edit?: ScheduleEditHandlers;
}> = ({ schedule, edit }) => (
  <>
    {schedule.days.map(day => (
      <View key={day.date}>
        <Text style={s.dayTitle}>{dayLabel(schedule.startDate, day.date)}</Text>
        <DayCards date={day.date} slots={day.slots} edit={edit} />
      </View>
    ))}
  </>
);

export default ScheduleDays;
