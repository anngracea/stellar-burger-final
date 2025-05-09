import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  resetOrderResponse,
  selectAllIngredients,
  getOrderByNumber,
  getOrderSelector
} from '@slices';
import styles from '../ui/order-info/order-info.module.css';
import clsx from 'clsx';

export const OrderInfo: FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { number } = useParams();
  const dispatch = useDispatch();

  const orderData = useSelector(getOrderSelector);
  const ingredients: TIngredient[] = useSelector(selectAllIngredients);
  const location = useLocation();
  const isModal = !!location.state?.backgroundLocation;

  useEffect(() => {
    setIsLoading(true);
    dispatch(resetOrderResponse());
    dispatch(getOrderByNumber(Number(number))).finally(() => {
      setIsLoading(false);
    });
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  return (
    <div className={clsx(styles.wrap, { [styles.page]: !isModal })}>
      {isLoading || !orderInfo ? (
        <Preloader />
      ) : (
        <OrderInfoUI orderInfo={orderInfo} />
      )}
    </div>
  );
};
