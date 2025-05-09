import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  getUserApi,
  updateUserApi,
  getOrdersApi,
  logoutApi
} from '@api';
import { TLoginData, TRegisterData } from '@api';
import { TOrder, TUser } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../../../utils/cookie';

// Тип состояния
type AccountState = {
  isAuthChecked: boolean;
  userData: TUser | null;
  userOrders: TOrder[];
  error: boolean | null;
  isLoading: boolean;
};

// Начальное состояние
const initialState: AccountState = {
  isAuthChecked: false,
  userData: null,
  userOrders: [],
  error: null,
  isLoading: false
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'account/loginUser',
  async (loginData: TLoginData) => {
    const data = await loginUserApi(loginData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const registerUser = createAsyncThunk(
  'account/registerUser',
  async (registerData: TRegisterData) => {
    const data = await registerUserApi(registerData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const forgotPassword = createAsyncThunk(
  'account/forgotPassword',
  async (data: { email: string }) => forgotPasswordApi(data)
);

export const resetPassword = createAsyncThunk(
  'account/resetPassword',
  async (data: { password: string; token: string }) => resetPasswordApi(data)
);

export const updateUser = createAsyncThunk(
  'account/updateUser',
  async (updateUserData: Partial<TRegisterData>) =>
    updateUserApi(updateUserData)
);

export const getUser = createAsyncThunk('account/getUser', async () =>
  getUserApi()
);

export const getUserOrders = createAsyncThunk(
  'account/getUserOrders',
  async () => getOrdersApi()
);

export const checkUserAuth = createAsyncThunk(
  'account/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      await dispatch(getUser());
    }
    dispatch(authChecked());
  }
);

export const logoutUser = createAsyncThunk(
  'account/logoutUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.clear();
      deleteCookie('accessToken');
      dispatch(userLogout());
    } catch (error: any) {
      return rejectWithValue({
        message: error?.message || 'Ошибка при выходе'
      });
    }
  }
);

// Slice
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    resetErrorMessage(state) {
      state.error = null;
    },
    authChecked(state) {
      state.isAuthChecked = true;
    },
    userLogout(state) {
      state.userData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload.orders;
      })

      // Обработка успешных forgot/reset password
      .addMatcher(
        isAnyOf(forgotPassword.fulfilled, resetPassword.fulfilled),
        (state) => {
          state.error = null;
        }
      )

      // Все pending экшены
      .addMatcher(
        isAnyOf(
          loginUser.pending,
          registerUser.pending,
          getUser.pending,
          updateUser.pending,
          getUserOrders.pending,
          forgotPassword.pending,
          resetPassword.pending
        ),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )

      // Все rejected экшены
      .addMatcher(
        isAnyOf(
          loginUser.rejected,
          registerUser.rejected,
          getUser.rejected,
          updateUser.rejected,
          getUserOrders.rejected,
          forgotPassword.rejected,
          resetPassword.rejected
        ),
        (state) => {
          state.isLoading = false;
          state.error = true;
        }
      )

      // Все fulfilled экшены
      .addMatcher(
        isAnyOf(
          loginUser.fulfilled,
          registerUser.fulfilled,
          getUser.fulfilled,
          updateUser.fulfilled,
          getUserOrders.fulfilled
        ),
        (state) => {
          state.isLoading = false;
          state.error = null;
        }
      );
  }
});

// Reducer & actions
export const accountReducer = accountSlice.reducer;

export const { resetErrorMessage, authChecked, userLogout } =
  accountSlice.actions;

// Selectors
export const selectUserData = (state: { account: AccountState }) =>
  state.account.userData;
export const selectIsAuthChecked = (state: { account: AccountState }) =>
  state.account.isAuthChecked;
export const selectUserOrders = (state: { account: AccountState }) =>
  state.account.userOrders;
export const selectIsLoading = (state: { account: AccountState }) =>
  state.account.isLoading;
export const selectError = (state: { account: AccountState }) =>
  state.account.error;
