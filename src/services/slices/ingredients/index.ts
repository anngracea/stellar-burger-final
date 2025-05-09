import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { RootState } from '../../store';

const FETCH_ERROR_MESSAGE = 'Не удалось загрузить ингредиенты';

type IngredientCatalogState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: IngredientCatalogState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredientCatalog/fetchIngredients',
  async () => await getIngredientsApi()
);

const ingredientCatalogSlice = createSlice({
  name: 'ingredientCatalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || FETCH_ERROR_MESSAGE;
      });
  }
});

export const ingredientCatalogReducer = ingredientCatalogSlice.reducer;

// Selectors
export const selectAllIngredients = (state: RootState) =>
  state.ingredientCatalog.ingredients;

export const selectIsIngredientsLoading = (state: RootState) =>
  state.ingredientCatalog.isLoading;

export const selectIngredientsError = (state: RootState) =>
  state.ingredientCatalog.error;
