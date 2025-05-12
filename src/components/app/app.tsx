import '../../index.css';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { checkUserAuth, fetchIngredients } from '@slices';
import { AppRoutes } from './app-routes';
import { AppHeader } from '@components';
import styles from './app.module.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <AppHeader />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
};

export default App;
