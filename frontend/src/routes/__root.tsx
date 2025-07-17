import Secured from '@/modules/Auth';
import { Header } from '@/modules/Layout/Header';
import { WelcomePage } from '@/modules/Layout/WelcomePage';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useAuth } from 'react-oidc-context';

const BaseLayout = () => {
  const auth = useAuth();
  if (auth.isLoading) {
    return null; // TODO LOADER
  }
  if (!auth.isAuthenticated) {
    return <WelcomePage />;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4 flex-1 overflow-auto flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-100">
          <Secured>
            <Outlet />
          </Secured>
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  component: BaseLayout,
});
