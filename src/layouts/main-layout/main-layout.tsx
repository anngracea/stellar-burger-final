import { AppHeader } from '@components';
import { Outlet, useLocation } from 'react-router-dom';

export const MainLayout = () => {
  const location = useLocation();
  const isProfileOrdersPage = location.pathname === '/profile/orders';

  return (
    <>
      <AppHeader />
      <main style={{ paddingTop: '108px', paddingLeft: '40px' }}>
        <Outlet />
      </main>
    </>
  );
};
