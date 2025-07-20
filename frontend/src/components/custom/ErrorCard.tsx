import { useTranslation } from 'react-i18next';
import { Card } from '../ui/card';

const ErrorCard = (props: { msg: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6 text-center bg-destructive/10">
        <p className="text-lg font-semibold text-destructive">{t('error.genTitle')}</p>
        <p className="text-sm mt-2">{props.msg}</p>
      </Card>
    </div>
  );
};

export default ErrorCard;
