import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { orderBurger, resetConstructorItems } from '@slices';
import { AppDispatch, RootState } from '../store';

export const resetConstructorMiddleware: Middleware =
  (store: MiddlewareAPI<AppDispatch, RootState>) => (next) => (action) => {
    if (orderBurger.fulfilled.match(action)) {
      store.dispatch(resetConstructorItems());
    }

    return next(action);
  };
