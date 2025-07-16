import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { Vacancy } from '@/models/entities';
import { Link } from '@tanstack/react-router';
import { DeleteIcon, Loader2Icon, TrashIcon } from 'lucide-react';
import './styles.css';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRemoveVacancyMutation } from '@/services/vacancyApi';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function VacancyCard({ vacancy }: { vacancy: Vacancy }) {
  const [removeVacancy, { isLoading: vacancyRemoving }] = useRemoveVacancyMutation();
  const { t } = useTranslation();
  const handleDelete = () => {
    removeVacancy({ vacancySK: vacancy.SK });
  };
  const badgeSuccessClass = 'bg-green-500 text-white dark:bg-green-600';
  const badgeMediumClass = 'bg-blue-500 text-white dark:bg-blue-600';
  const badgeWeakClass = 'bg-gray-500 text-white dark:bg-gray-600';
  return (
    <Card className="w-full h-[290px] flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 overflow-hidden">
            <CardTitle className="text-base truncate leading-tight">{vacancy.title}</CardTitle>

            <CardDescription className="text-sm text-muted-foreground truncate leading-snug max-h-[2.5rem]">
              {vacancy.skills.slice(0, 5).join(', ')}
            </CardDescription>

            <div className="mt-1 h-[1.5rem]">
              {vacancy.url ? (
                <a
                  href={vacancy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-blue-800 bg-blue-100 px-1 py-0.5 rounded truncate whitespace-nowrap overflow-hidden text-ellipsis w-full"
                  title={vacancy.url}
                >
                  {vacancy.url}
                </a>
              ) : (
                <div className="h-full" />
              )}
            </div>
          </div>

          {/* Delete button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="size-6" disabled={vacancyRemoving}>
                {vacancyRemoving ? (
                  <Loader2Icon className="animate-spin w-4 h-4" />
                ) : (
                  <TrashIcon className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('removeVacancyWarn')}</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>{t('remove')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 text-sm flex-grow justify-between">
        {/* Прогрес */}
        <div className="flex justify-between items-center h-[40px]">
          <Label className="text-xs text-muted-foreground truncate">{t('progress_colon')}</Label>
          <div className="flex items-center gap-2 w-full max-w-[180px]">
            <Progress
              value={vacancy.progress * 100}
              className={cn(
                'h-2 rounded flex-grow',
                vacancy.progress >= 0.8
                  ? 'bg-green-100 [&>div]:bg-green-500'
                  : vacancy.progress >= 0.4
                    ? 'bg-indigo-100 [&>div]:bg-indigo-500'
                    : 'bg-gray-100 [&>div]:bg-gray-400',
              )}
            />
            <span className="text-xs text-muted-foreground min-w-[35px] text-right">
              {(vacancy.progress * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Score */}
        <div className="flex justify-between items-center h-[40px]">
          <Label className="text-xs text-muted-foreground truncate">{t('score_colon')}</Label>
          <Badge
            variant="secondary"
            className={cn(
              vacancy.score >= 0.8
                ? badgeSuccessClass
                : vacancy.score >= 0.4
                  ? badgeMediumClass
                  : badgeWeakClass,
            )}
          >
            {(vacancy.score * 100).toFixed(0)}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex-shrink-0">
        <Link to="/interview/$vacancySK" params={{ vacancySK: vacancy.SK }} className="w-full">
          <Button className="w-full">{t('continue')}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export const VacancyCardSkeleton = () => {
  return (
    <Card className="w-full h-[290px] flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 space-y-1 overflow-hidden">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-[1.5rem] w-full rounded bg-blue-100" />
          </div>
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-grow justify-between">
        <div className="flex justify-between items-center h-[40px]">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-2 w-2/3" />
        </div>

        <div className="flex justify-between items-center h-[40px]">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex-shrink-0">
        <Skeleton className="h-10 w-full rounded" />
      </CardFooter>
    </Card>
  );
};
