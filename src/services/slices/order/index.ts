import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { TConstructorItems } from '../constructor/slice';
import { RootState } from '../../store';
import { formatOrderData } from '../../../utils/formatOrderData';

const ORDER_ERROR_MESSAGES = {
  feeds: 'Ошибка при получении фидов',
  order: 'Ошибка при получении заказа',
  create: 'Ошибка при оформлении заказа'
};

type OrderFeedState = {
  error: string | null;
  feeds: {
    orders: TOrder[];
    total: number;
    totalToday: number;
  };
  orderByNumber: TOrder[];
  orderRequest: boolean;
  orderResponse: {
    order: TOrder | null;
  };
};

const initialState: OrderFeedState = {
  error: null,
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  orderByNumber: [],
  orderRequest: false,
  orderResponse: {
    order: null
  }
};

// --- async actions ---
export const getAllFeeds = createAsyncThunk('feeds/getAllFeeds', getFeedsApi);

export const getOrderByNumber = createAsyncThunk(
  'feeds/getOrderByNumber',
  getOrderByNumberApi
);

export const orderBurger = createAsyncThunk(
  'orders/orderBurger',
  async (items: TConstructorItems) => {
    const orderData = formatOrderData(items);

    const response = await orderBurgerApi(orderData);
    return response.order;
  }
);

// --- slice ---
const orderFeedSlice = createSlice({
  name: 'orderFeed',
  initialState,
  reducers: {
    resetOrderResponse: (state) => {
      state.orderResponse.order = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllFeeds.pending, (state) => {
        state.error = null;
      })
      .addCase(getAllFeeds.fulfilled, (state, action) => {
        state.feeds = action.payload;
        state.error = null;
      })
      .addCase(getAllFeeds.rejected, (state, action) => {
        state.error = action.error.message || ORDER_ERROR_MESSAGES.feeds;
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumber = action.payload.orders;
        state.orderResponse.order = action.payload.orders[0] || null;
        state.orderRequest = false;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message || ORDER_ERROR_MESSAGES.order;
        state.orderRequest = false;
      })

      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderResponse.order = action.payload;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || ORDER_ERROR_MESSAGES.create;
      });
  }
});

// --- export ---
export const orderFeedReducer = orderFeedSlice.reducer;

export const getAllOrdersSelector = (state: RootState) =>
  state.orderFeed.feeds.orders;

export const getFeedsSelector = (state: RootState) => state.orderFeed.feeds;

export const getOrderSelector = (state: RootState) =>
  state.orderFeed.orderByNumber[0] || null;

export const getOrderResponseSelector = (state: RootState) =>
  state.orderFeed.orderResponse.order;

export const getOrderRequestSelector = (state: RootState) =>
  state.orderFeed.orderRequest;

export const { resetOrderResponse } = orderFeedSlice.actions;
