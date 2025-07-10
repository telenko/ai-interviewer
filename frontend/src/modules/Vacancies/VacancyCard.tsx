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
import { DeleteIcon, Loader2Icon } from 'lucide-react';
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

export default function VacancyCard({ vacancy }: { vacancy: Vacancy }) {
  const [removeVacancy, { isLoading: vacancyRemoving }] = useRemoveVacancyMutation();
  const handleDelete = () => {
    removeVacancy({ vacancySK: vacancy.SK });
  };
  const badgeSuccessClass = 'bg-green-500 text-white dark:bg-green-600';
  const badgeMediumClass = 'bg-blue-500 text-white dark:bg-blue-600';
  const badgeWeakClass = 'bg-gray-500 text-white dark:bg-gray-600';
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="line-clamp-1">{vacancy.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {vacancy.skills.slice(0, 5).join(', ')}
        </CardDescription>
        {/* AlertDialog for confirmation */}
        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" size="icon" className="size-8" disabled={vacancyRemoving}>
                {vacancyRemoving ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <DeleteIcon className="w-4 h-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ви впевнені, що хочете видалити вакансію?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Скасувати</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Видалити</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="flex gap-2">
              <Label>Progress: </Label>
              <Badge
                className={
                  vacancy.progress > 0.6
                    ? badgeSuccessClass
                    : vacancy.progress > 0.3
                      ? badgeMediumClass
                      : badgeWeakClass
                }
                variant="secondary"
              >
                {(vacancy.progress * 100).toFixed(1)} %
              </Badge>
            </div>
            <div className="flex gap-2">
              <Label>Score: </Label>
              <Badge
                className={
                  vacancy.score > 0.6
                    ? badgeSuccessClass
                    : vacancy.score > 0.3
                      ? badgeMediumClass
                      : badgeWeakClass
                }
                variant="secondary"
              >
                {(vacancy.score * 100).toFixed(0)}
              </Badge>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Link to="/interview/$vacancySK" params={{ vacancySK: vacancy.SK }} className="w-full">
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
