import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderRequestSelector,
  getOrderResponseSelector,
  selectUserData,
  orderBurger,
  resetOrderResponse,
  selectConstructorItems
} from '@slices';

export const BurgerConstructor: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // 🆕

  const user = useSelector(selectUserData);
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(getOrderRequestSelector);
  const orderModalData = useSelector(getOrderResponseSelector);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', {
        state: { from: location }
      });
      return;
    }

    setIsOpen(true);
    dispatch(orderBurger(constructorItems));
  };

  const onCloseClick = () => {
    setIsOpen(false);
  };

  const closeOrderModal = () => {
    dispatch(resetOrderResponse());
    setIsOpen(false);
  };

  useEffect(() => {
    dispatch(resetOrderResponse());
  }, [dispatch]);

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (acc, item) => acc + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      isOrderOpen={isOpen}
      onCloseClick={onCloseClick}
    />
  );
};
