import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';

import {
  Counter,
  CurrencyIcon,
  Button
} from '@zlden/react-developer-burger-ui-components';

import { TBurgerIngredientUIProps } from './type';
import { DragPreviewImage, useDrag } from 'react-dnd';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd, locationState }) => {
    const { image, price, name, _id } = ingredient;

    const [{ isDrag }, dragRef, preview] = useDrag({
      type: 'drag_ingredient_in_constructor',
      item: ingredient,
      collect: (monitor) => ({
        isDrag: monitor.isDragging()
      })
    });

    return (
      <>
        <DragPreviewImage connect={preview} src={ingredient.image} />
        <li
          data-cy={ingredient._id}
          className={styles.container}
          ref={dragRef}
          style={{ opacity: isDrag ? 0.1 : 1 }}
        >
          <Link
            className={styles.article}
            to={`/ingredients/${_id}`}
            state={locationState}
          >
            {count > 0 && <Counter count={count} />}
            <img
              className={styles.img}
              src={image}
              alt='картинка ингредиента.'
            />
            <p className={`text text_type_main-default ${styles.text}`}>
              {name}
            </p>
          </Link>
          <div className={styles.footer}>
            <div className={styles.cost}>
              <p className='text text_type_digits-default mr-2'>{price}</p>
              <CurrencyIcon type='primary' />
            </div>
            <Button
              type='secondary'
              htmlType='button'
              onClick={handleAdd}
              extraClass={styles.addButton}
            >
              Добавить
            </Button>
          </div>
        </li>
      </>
    );
  }
);
