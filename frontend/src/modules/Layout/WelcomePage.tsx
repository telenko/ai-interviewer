import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';

export const WelcomePage = () => {
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-10 bg-gradient-to-br from-blue-100 via-indigo-100 to-indigo-200">
      <div className="space-y-6 max-w-2xl w-full">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-800 leading-tight">
          {t('welcome.title')}
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          {t('welcome.subTitle')}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button
            size="lg"
            className="text-base px-6 py-4 sm:w-auto w-full"
            onClick={() => auth.signinRedirect()}
          >
            {t('welcome.login')}
          </Button>
        </div>
      </div>

      <footer className="mt-20 text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} AI Interview Assistant
      </footer>
    </div>
  );
};
