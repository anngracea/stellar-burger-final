import { Routes, Route, useLocation, Outlet } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal, OrderInfo, IngredientDetails } from '@components';
import { ProtectedRoute } from '@components';
import { MainLayout } from '../../layouts';

export const AppRoutes = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<ConstructorPage />} />

          <Route
            path='ingredients/:id'
            element={
              <Modal title='Детали ингредиента'>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route path='feed'>
            <Route index element={<Feed />} />
            <Route path=':number' element={<OrderInfo />} />
          </Route>

          <Route
            path='login'
            element={<ProtectedRoute onlyUnAuth element={<Login />} />}
          />
          <Route
            path='register'
            element={<ProtectedRoute onlyUnAuth element={<Register />} />}
          />
          <Route
            path='forgot-password'
            element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
          />
          <Route
            path='reset-password'
            element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
          />

          <Route
            path='profile'
            element={<ProtectedRoute element={<Outlet />} />}
          >
            <Route index element={<Profile />} />
            <Route path='orders' element={<ProfileOrders />} />
            <Route path='orders/:number' element={<OrderInfo />} />
          </Route>

          <Route path='*' element={<NotFound404 />} />
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Информация о заказе'>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе'>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
