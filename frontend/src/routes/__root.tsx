import Secured from '@/modules/Auth';
import { Header } from '@/modules/Layout/Header';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4 flex-1 overflow-auto flex flex-col">
          <Secured>
            <Outlet />
          </Secured>
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
