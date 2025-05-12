import {
  createSlice,
  createEntityAdapter,
  PayloadAction
} from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { TIngredient } from '@utils-types';

// --- Типы ---
export type TConstructorIngredient = TIngredient & { id: string };

export type TConstructorItems = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  fillings: ReturnType<typeof fillingsAdapter.getInitialState>;
};

// --- Adapter ---
const fillingsAdapter = createEntityAdapter<TConstructorIngredient, string>({
  selectId: (ingredient) => ingredient.id
});

// --- Initial State ---
const initialState: TBurgerConstructorState = {
  bun: null,
  fillings: fillingsAdapter.getInitialState()
};

// --- Slice ---
const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        ingredient.type === 'bun'
          ? (state.bun = ingredient)
          : fillingsAdapter.addOne(state.fillings, ingredient);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      fillingsAdapter.removeOne(state.fillings, action.payload);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ids = state.fillings.ids as string[];

      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= ids.length ||
        toIndex >= ids.length
      ) {
        return;
      }

      const updated = [...ids];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      state.fillings.ids = updated;
    },
    resetConstructorItems: (state) => {
      state.bun = null;
      fillingsAdapter.removeAll(state.fillings);
    }
  }
});

// --- Exports ---
export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructorItems
} = burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;

export const { selectAll: selectFillings, selectById: selectFillingById } =
  fillingsAdapter.getSelectors(
    (state: { burgerConstructor: TBurgerConstructorState }) =>
      state.burgerConstructor.fillings
  );

export const selectBun = (state: {
  burgerConstructor: TBurgerConstructorState;
}) => state.burgerConstructor.bun;
