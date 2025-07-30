import { Button } from '@/components/ui/button';
import { useActivityMonitoring } from '@/services/Monitoring/useActivityMonitoring';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';

export const WelcomePage = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const { trackClick } = useActivityMonitoring();

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
            onClick={() => {
              trackClick('login_welcome');
              auth.signinRedirect();
            }}
          >
            {t('welcome.login')}
          </Button>
        </div>
      </div>

      <div
        className="mt-10 p-1 sm:p-6 space-y-4 rounded-xl overflow-hidden w-full sm:w-[600px]"
        style={{ aspectRatio: '16 / 9' }}
      >
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/93ko_fFy9ts"
          title="ApplyMatch demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <footer className="mt-20 text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} ApplyMatch - AI Interview Assistant
      </footer>
    </div>
  );
};
