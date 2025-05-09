import { selectIsAuthChecked, selectUserData } from '@slices';
import { useSelector } from '../../services/store';
import { useLocation } from 'react-router-dom';
import { ProtectedRouteUI } from '@ui';
import { TProtectedRouteProps } from './type';

export const ProtectedRoute = ({
  onlyUnAuth,
  element
}: TProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUserData);
  const location = useLocation();

  return (
    <ProtectedRouteUI
      onlyUnAuth={onlyUnAuth}
      isAuthChecked={isAuthChecked}
      user={user}
      location={location}
      element={element}
    />
  );
};
