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

import PlusIcon from '../../../assets/add.svg';

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
        <DragPreviewImage connect={preview} src={image} />
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
            <div className={styles.imageWrapper}>
              {count > 0 && <Counter count={count} />}
              <img
                className={styles.img}
                src={image}
                alt='картинка ингредиента.'
              />
            </div>

            <div className={styles.price}>
              <p className='text text_type_digits-default mr-2'>{price}</p>
              <CurrencyIcon type='primary' />
            </div>

            <p className={`text text_type_main-default ${styles.text}`}>
              {name}
            </p>
          </Link>

          <Button
            type='secondary'
            htmlType='button'
            onClick={handleAdd}
            extraClass={styles.addButton}
          >
            <img src={PlusIcon} alt='добавить' className={styles.icon} />
            <span className={styles.addText}>Добавить</span>
          </Button>
        </li>
      </>
    );
  }
);
