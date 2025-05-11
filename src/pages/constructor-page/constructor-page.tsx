import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectIsLoading } from '@slices';
import { ConstructorPageUI } from '../../components/ui/pages/constructor-page';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIsLoading);
  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
