import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function UkraineSupportFlag() {
  const handleClick = () => {
    window.open('https://war.ukraine.ua/', '_blank'); // або https://u24.gov.ua/
  };
  const { t } = useTranslation();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className="rounded-full hover:scale-105 transition-transform cursor-pointer"
          >
            <img
              src="https://flagcdn.com/w40/ua.png"
              alt="Ukraine"
              className="h-5 w-auto rounded-sm shadow-sm"
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('about.helpUkraine')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
      <Card className="p-6 space-y-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('about.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>{t('about.appGeneral')}</p>
          <p>{t('about.appSecondary')}</p>
        </CardContent>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-6 items-start">
          <Avatar className="w-36 h-36 mx-auto md:mx-0">
            <AvatarImage src="/avatar.jpg" alt="Author" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <div className="flex flex-row items-center gap-3">
              <h2 className="text-lg font-semibold">{t('about.authorTitle')}</h2>
              <UkraineSupportFlag />
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('about.authorGeneral')}
            </p>
            <p className="text-sm text-muted-foreground">{t('about.authorSecondary')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
