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

  if (!userProfile && !onlyUnAuth) {
    return (
      <Navigate
        replace
        to='/login'
        state={{
          from: location,
          backgroundLocation: location.state?.backgroundLocation || location
        }}
      />
    );
  }

  if (userProfile && onlyUnAuth) {
    const from = location.state?.from || { pathname: '/profile' };

    return (
      <Navigate
        replace
        to={from}
        state={{ backgroundLocation: from?.state?.backgroundLocation }}
      />
    );
  }

  return children;
};
