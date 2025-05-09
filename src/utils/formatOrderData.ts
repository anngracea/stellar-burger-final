import { TConstructorItems } from '@slices';

export const formatOrderData = (items: TConstructorItems): string[] => {
  if (!items.bun || items.ingredients.length === 0) return [];
  return [items.bun._id, ...items.ingredients.map((i) => i._id), items.bun._id];
};
