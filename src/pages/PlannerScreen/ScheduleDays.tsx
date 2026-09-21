import React from 'react';
import { View, Text } from 'react-native';
import { planStatusStyles as s } from './PlanStatusView.styles';
import type { PlannerSchedule } from '../../entities/planner/api';
import { CATEGORY_EMOJI, dayLabel } from '../../entities/planner/types';

const ScheduleDays: React.FC<{ schedule: PlannerSchedule }> = ({
  schedule,
}) => (
  <>
    {schedule.days.map(day => (
      <View key={day.date}>
        <Text style={s.dayTitle}>{dayLabel(schedule.startDate, day.date)}</Text>
        {day.slots.map(slot =>
          slot.place ? (
            <View key={slot.slotId} style={s.row}>
              <View style={s.thumb}>
                <Text style={s.thumbEmoji}>
                  {slot.place.category
                    ? CATEGORY_EMOJI[slot.place.category]
                    : '📍'}
                </Text>
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
            </View>
          ) : (
            // 장소를 고르는 + 는 서버 #131 이 들어오면 붙인다
            <View key={slot.slotId} style={s.emptySlot}>
              <Text style={s.emptySlotText}>
                {slot.order}번째 · 비어 있는 칸
              </Text>
            </View>
          ),
        )}
      </View>
    ))}
  </>
);

export default ScheduleDays;
