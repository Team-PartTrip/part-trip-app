import React from 'react';
import type { ColorValue } from 'react-native';
import {
  BagIcon,
  BedIcon,
  CoffeeIcon,
  LandmarkIcon,
  PinIcon,
  TicketIcon,
  UtensilsIcon,
} from '../../shared/ui/icons';
import type { PlaceCategory } from './types';

const BY_CATEGORY = {
  RESTAURANT: UtensilsIcon,
  ATTRACTION: LandmarkIcon,
  ACCOMMODATION: BedIcon,
  CAFE: CoffeeIcon,
  ACTIVITY: TicketIcon,
  SHOPPING: BagIcon,
};

const CategoryIcon: React.FC<{
  category: PlaceCategory | null | undefined;
  size?: number;
  color: ColorValue;
}> = ({ category, size = 22, color }) => {
  const Icon = (category && BY_CATEGORY[category]) || PinIcon;
  return <Icon size={size} color={color} />;
};

export default CategoryIcon;
