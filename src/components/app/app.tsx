import '../../index.css';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { checkUserAuth, fetchIngredients } from '@slices';
import { AppRoutes } from './app-routes';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
