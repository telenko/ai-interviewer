import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { Vacancy } from '@/models/entities';
import { Link } from '@tanstack/react-router';
import { Loader2Icon, TrashIcon, Building2 } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    <Card className="w-full h-[290px] flex flex-col gap-2">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex justify-between items-start gap-2 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <CardTitle className="text-base truncate leading-tight mb-2">{vacancy.title}</CardTitle>

            <CardDescription className="text-sm text-muted-foreground truncate leading-snug max-h-[2.5rem]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p>{vacancy.skills.slice(0, 5).join(', ')}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-h-[500px] overflow-y-auto">
                    <ul>
                      {vacancy.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardDescription>

            <div className="mt-1 h-[1.5rem]">
              {vacancy.url ? (
                <a
                  href={vacancy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-blue-800 bg-blue-100 px-1 py-0.5 rounded overflow-hidden text-ellipsis whitespace-nowrap w-full max-w-full"
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

      <CardContent className="flex flex-col gap-1 text-sm flex-grow justify-between">
        {/* Прогрес */}
        <div className="flex items-center gap-2 w-full h-[40px]">
          <Progress
            value={vacancy.progress * 100}
            className={cn(
              'h-2 rounded flex-grow',
              'flex-1',
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

        {/* Score */}
        <div className="flex gap-3 items-center h-[40px]">
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

          {vacancy.company ? (
            <Popover>
              <PopoverTrigger asChild>
                <div className="ml-auto flex gap-2 cursor-pointer">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <Label>{vacancy.company}</Label>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <p className="max-h-[500px] overflow-y-auto text-sm text-gray-600">
                  {t('company_name_hint')}
                </p>
              </PopoverContent>
            </Popover>
          ) : null}
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
    <Card className="w-full h-[290px] flex flex-col gap-2">
      <CardHeader className="pb-2 flex-shrink-0 overflow-hidden">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 space-y-1 overflow-hidden">
            <Skeleton className="h-4 w-3/4 mb-3" />
            <Skeleton className="h-3 w-5/6 mb-2" />
            <Skeleton className="h-[1.5rem] w-full rounded bg-blue-100" />
          </div>
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 flex-grow justify-between">
        <div className="flex justify-between items-center h-[40px]">
          <Skeleton className="h-2 w-2/3 w-full mt-1" />
        </div>

        <div className="flex gap-3 items-center h-[40px] mt-">
          <Skeleton className="h-3 w-1/6" />
          <Skeleton className="h-5 w-8 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full ml-auto" />
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex-shrink-0">
        <Skeleton className="h-10 w-full rounded" />
      </CardFooter>
    </Card>
  );
};
