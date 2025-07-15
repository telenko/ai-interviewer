import { Button } from '@/components/ui/button';
import { useCallback, useEffect } from 'react';
import { useAuth, type AuthContextProps } from 'react-oidc-context';

let authContainer: AuthContextProps | null = null;

export const getAuthContainer = () => authContainer;

export const useSignoutCallback = () => {
  const auth = useAuth();
  const signOutRedirect = useCallback(() => {
    auth.signoutSilent();
    const clientId = import.meta.env.VITE_AUTH_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_AUTH_REDIRECT_LOGOUT_URL;
    const cognitoDomain = import.meta.env.VITE_AUTH_UI_URL;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  }, [auth]);
  return signOutRedirect;
};

export default function Secured(props: React.PropsWithChildren) {
  const auth = useAuth();

  useEffect(() => {
    authContainer = auth;
  }, [auth]);

  const signOutRedirect = useSignoutCallback();

  switch (auth.activeNavigator) {
    case 'signinSilent':
      return <div>Signing you in...</div>;
    case 'signoutRedirect':
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <>
      {auth.isAuthenticated ? (
        props.children
      ) : (
        <p className="p-4">Not logged in. Please click sign in to proceed</p>
      )}
    </>
  );
}
