import { Button } from '@/components/ui/button';
import logoUrl from '/logo.svg?url';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu, LogIn, LogOut } from 'lucide-react';
import { useAuth } from 'react-oidc-context';
import { useSignoutCallback } from '../Auth';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from './Breadcrumbs';
import { Link } from '@tanstack/react-router';

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
                <p className="text-sm text-muted-foreground">{t('navigation.user')}</p>
                <p className="font-medium break-all">
                  {auth.user?.profile?.email ?? 'Not logged in'}
                </p>
              </div>

              {/* Optional: додаткові навігаційні лінки */}
              <nav className="flex flex-col space-y-2">
                <a href="/" className="text-lg hover:underline">
                  {t('navigation.home')}
                </a>
                <a href="/about" className="text-lg hover:underline">
                  {t('navigation.about')}
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
                  <LogOut className="w-4 h-4 mr-2" /> {t('navigation.logout')}
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      {/* Logo or title */}
      <div className="text-lg font-semibold flex flex-row space-x-2 items-center">
        <img src={logoUrl} alt="Logo" className="h-8 w-8" />
        {/* <Logo /> */}
        <p>{t('app')}</p>
        <Breadcrumbs className="mt-[2px] ml-5 hidden sm:block" />
      </div>

      {/* User section */}
      <div className="flex items-center space-x-4">
        <Link
          to="/about"
          className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          {t('navigation.about')}
        </Link>
        {auth.isAuthenticated ? (
          <>
            <span className="text-sm hidden md:inline">{auth.user?.profile.email}</span>
            <Button variant="outline" size="sm" onClick={signoutCb}>
              <LogOut className="w-4 h-4 mr-1" /> {t('navigation.logout')}
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={() => auth.signinRedirect()}>
            <LogIn className="w-4 h-4 mr-1" /> {t('navigation.login')}
          </Button>
        )}
      </div>
    </header>
  );
}
