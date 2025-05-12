import {
  Routes,
  Route,
  useLocation,
  Outlet,
  useMatch,
  useNavigate
} from 'react-router-dom';
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
import {
  Modal,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute
} from '@components';

import styles from './app.module.css';

export const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;

  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderMatch = useMatch('/profile/orders/:number')?.params.number;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path='/' index element={<ConstructorPage />} />

        <Route
          path='ingredients/:id'
          element={
            <div className={styles.detailPageWrap}>
              <h3
                className={`text text_type_main-large ${styles.detailHeader}`}
              >
                Детали ингредиента
              </h3>
              <IngredientDetails />
            </div>
          }
        />

        <Route path='feed'>
          <Route index element={<Feed />} />
          <Route
            path=':number'
            element={
              <div className={styles.detailPageWrap}>
                <p
                  className={`text text_type_digits-default ${styles.detailHeader}`}
                >
                  {'#' + feedMatch}
                </p>
                <OrderInfo />
              </div>
            }
          />
        </Route>

        {/* Авторизация */}
        <Route
          path='login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Профиль и заказы */}
        <Route
          path='profile'
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path='orders' element={<ProfileOrders />} />
          <Route
            path='orders/:number'
            element={
              <div className={styles.detailPageWrap}>
                <p
                  className={`text text_type_digits-default ${styles.detailHeader}`}
                >
                  {'#' + orderMatch}
                </p>
                <OrderInfo />
              </div>
            }
          />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={`#${orderMatch}`}
                onClose={() => navigate('/profile/orders')}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${feedMatch}`} onClose={() => navigate('/feed')}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
