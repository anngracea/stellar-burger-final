import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients, selectAllIngredients, addIngredient } from '@slices';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ingredients = useSelector(selectAllIngredients) as TIngredient[];
  const ingredientData = ingredients.find(
    (item: TIngredient) => item._id === id
  );

  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    if (ingredientData?.image_large) {
      const img = new Image();
      img.src = ingredientData.image_large;
      img.onload = () => setImageLoaded(true);
    }
  }, [ingredientData?.image_large]);

  const handleAdd = () => {
    if (ingredientData) {
      dispatch(addIngredient(ingredientData));
      navigate(-1);
    }
  };

  if (!ingredientData || !imageLoaded) {
    return <Preloader />;
  }

  return (
    <IngredientDetailsUI ingredientData={ingredientData} onClick={handleAdd} />
  );
};
