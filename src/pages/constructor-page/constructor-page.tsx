import { useSelector } from '../../services/store';
import { FC } from 'react';
import { selectIsIngredientsLoading } from '@slices';
import { ConstructorPageUI } from '@ui-pages';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIsIngredientsLoading);

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
