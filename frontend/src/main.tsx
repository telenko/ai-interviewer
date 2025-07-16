import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

import './styles.css';
import reportWebVitals from './reportWebVitals.ts';
import { Provider } from 'react-redux';
import { AuthProvider } from 'react-oidc-context';
import { store } from './store';
import '../i18n';

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_AUTH_IDP_URL,
  client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_LOGIN_URL,
  post_logout_redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_LOGOUT_URL,
  response_type: 'code',
  scope: 'phone openid email',
  onSigninCallback: () => {
    // Після успішного логіну – прибрати код із URL
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider {...cognitoAuthConfig}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </AuthProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
