import { configureStore } from '@reduxjs/toolkit';
import {
  burgerConstructorReducer,
  orderFeedReducer,
  ingredientCatalogReducer,
  accountReducer
} from '@slices';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { resetConstructorMiddleware } from '../middleware';

const store = configureStore({
  reducer: {
    ingredientCatalog: ingredientCatalogReducer,
    burgerConstructor: burgerConstructorReducer,
    orderFeed: orderFeedReducer,
    account: accountReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(resetConstructorMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
