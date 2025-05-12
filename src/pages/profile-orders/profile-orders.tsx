import { FC, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrders, selectUserOrders } from '@slices';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  const location = useLocation();
  const { number } = useParams();
  const isOrderPage = Boolean(number);
  const backgroundLocation = location.state?.backgroundLocation;

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  if (!orders) {
    return (
      <div style={{ marginTop: '10vh' }}>
        <Preloader />
      </div>
    );
  }

  if (isOrderPage && !backgroundLocation) {
    return null;
  }

  return <ProfileOrdersUI orders={orders} />;
};
