import { useGetVacanciesQuery } from '@/services/vacancyApi';
import VacancyCard, { VacancyCardSkeleton } from './VacancyCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddVacancyModal from './AddVacancyModal';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { MAX_VACANCIES } from '@/config/limits';
import { useActivityMonitoring } from '@/services/Monitoring/useActivityMonitoring';

const AddVacancyBtn = (props: React.ComponentProps<'button'>) => {
  const { t } = useTranslation();
  return (
    <Card className="w-full h-[120px] sm:h-[290px] flex items-center justify-center">
      <Button
        {...props}
        variant="outline"
        className="cursor-pointer flex flex-col items-center justify-center gap-1 w-5/6 h-5/5 sm:w-5/6 sm:h-5/6 text-muted-foreground border-dashed border-2 rounded-lg hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="w-55 h-55 stroke-[1.9] scale-190 sm:scale-285 mb-2" />
        <span className="text-xs font-medium">{t('add_vacancy')}</span>
      </Button>
    </Card>
  );
};

const AddVacancyScreenBtn = (props: React.ComponentProps<'button'>) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center h-[70vh] w-full">
      <Button
        {...props}
        variant="outline"
        className="flex flex-col items-center justify-center gap-2 w-72 sm:w-132 h-72 cursor-pointer text-lg border-dashed border-2 rounded-xl hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="w-55 h-55 stroke-[1.9] scale-190 sm:scale-285 mb-2" />
        <span className="text-base font-medium">{t('add_vacancy')}</span>
      </Button>
    </div>
  );
};

export default function VacanciesGrid() {
  const { data: vacancies, isLoading } = useGetVacanciesQuery();
  const { trackClick } = useActivityMonitoring();
  const sortedVacancies = useMemo(
    () =>
      [...(vacancies ?? [])].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0; // null = 0 (найстаріше)
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB; // новіші вище
      }),
    [vacancies],
  );
  const [addModalOpen, setAddModalOpen] = useState(false);
  const openNewVacModal = () => {
    setAddModalOpen(true);
    trackClick('add_vacancy_btn');
  };
  return (
    <div className="">
      <AddVacancyModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      {!isLoading && vacancies?.length === 0 ? (
        <AddVacancyScreenBtn onClick={openNewVacModal} />
      ) : (
        /* w-full max-w-sm */
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
          {(vacancies?.length ?? 0) <= MAX_VACANCIES ? (
            <AddVacancyBtn onClick={openNewVacModal} />
          ) : null}

          {isLoading ? [1, 2, 3].map((n) => <VacancyCardSkeleton key={n} />) : null}
          {!isLoading && sortedVacancies.length > 0
            ? sortedVacancies.map((vacancy) => <VacancyCard key={vacancy.SK} vacancy={vacancy} />)
            : null}
        </div>
      )}
    </div>
  );
}
