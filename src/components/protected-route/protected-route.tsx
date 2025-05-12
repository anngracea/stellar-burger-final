import { selectIsAuthChecked, selectUserData } from '@slices';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { ReactNode } from 'react';

export type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactNode;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isUserChecked = useSelector(selectIsAuthChecked);
  const userProfile = useSelector(selectUserData);
  const location = useLocation();

  if (!isUserChecked) {
    return <Preloader />;
  }

  // Если пользователь не авторизован и страница защищённая — редирект на login
  if (!userProfile && !onlyUnAuth) {
    return (
      <Navigate
        to='/login'
        replace
        state={{
          from: location
        }}
      />
    );
  }

  // Если пользователь авторизован, но пытается попасть на /login или /register
  if (userProfile && onlyUnAuth) {
    const from = location.state?.from;
    const fromPath = typeof from?.pathname === 'string' ? from.pathname : null;

    // если пришли на login вручную или был редирект с /profile → на главную
    const redirectTo =
      !fromPath || fromPath === '/login' || fromPath === '/profile'
        ? '/'
        : fromPath;

    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
