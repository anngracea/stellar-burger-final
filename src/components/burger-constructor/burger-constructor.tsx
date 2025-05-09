import { FC, useEffect, useMemo, useState } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderRequestSelector,
  getOrderResponseSelector,
  selectUserData,
  orderBurger,
  resetOrderResponse
} from '@slices';
import { selectConstructorItems } from '@slices';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUserData);
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(getOrderRequestSelector);
  const orderModalData = useSelector(getOrderResponseSelector);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
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
    dispatch(resetOrderResponse()); // Очистка данных предыдущего заказа
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
