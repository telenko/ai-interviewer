import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu, LogIn, LogOut } from 'lucide-react';
import { useAuth } from 'react-oidc-context';
import { useSignoutCallback } from '../Auth';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from './Breadcrumbs';

export function Header() {
  const auth = useAuth();
  const signoutCb = useSignoutCallback();
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b sticky top-0 right-0 left-0 z-50 bg-white border-b shadow-sm px-4 py-2">
      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col justify-between h-full p-4">
            {/* Top part: user info */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current user</p>
                <p className="font-medium break-all">
                  {auth.user?.profile?.email ?? 'Not logged in'}
                </p>
              </div>

              {/* Optional: додаткові навігаційні лінки */}
              <nav className="flex flex-col space-y-2">
                <a href="/" className="text-sm hover:underline">
                  Home
                </a>
                <a href="/about" className="text-sm hover:underline">
                  About
                </a>
              </nav>
            </div>

            {/* Bottom part: logout button */}
            {auth.isAuthenticated && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signoutCb}
                  className="w-full justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      {/* Logo or title */}
      <div className="text-lg font-semibold flex flex-row space-x-2 items-center">
        <p>{t('app')}</p>
        <Breadcrumbs />
      </div>

      {/* User section */}
      <div className="flex items-center space-x-4">
        {auth.isAuthenticated ? (
          <>
            <span className="text-sm hidden md:inline">{auth.user?.profile.email}</span>
            <Button variant="outline" size="sm" onClick={signoutCb}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={() => auth.signinRedirect()}>
            <LogIn className="w-4 h-4 mr-1" /> Login
          </Button>
        )}
      </div>
    </header>
  );
}
