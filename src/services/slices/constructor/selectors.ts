import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { selectBun, selectFillings } from './slice';

export const selectConstructorItems = createSelector(
  [
    (state: RootState) => selectBun(state),
    (state: RootState) => selectFillings(state)
  ],
  (bun, fillings) => ({
    bun,
    ingredients: fillings
  })
);
