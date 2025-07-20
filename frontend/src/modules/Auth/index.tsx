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

  return <>{auth.isAuthenticated ? props.children : null}</>;
}
