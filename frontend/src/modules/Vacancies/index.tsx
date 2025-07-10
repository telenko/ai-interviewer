import { Skeleton } from '@/components/ui/skeleton';
import { useGetVacanciesQuery } from '@/services/vacancyApi';
import VacancyCard from './VacancyCard';
import { PlusCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddVacancyModal from './AddVacancyModal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function VacanciesGrid() {
  const { data: vacancies, isLoading } = useGetVacanciesQuery();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <AddVacancyModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <Button className="flex items-center gap-2" onClick={() => setAddModalOpen(true)}>
        <PlusCircleIcon className="w-5 h-5" />
        {t('add_vacancy')}
      </Button>
      {/* w-full max-w-sm */}
      <div className="grid responsive-grid place-content-start gap-4 py-4">
        {isLoading
          ? [1, 2, 3].map((n) => <Skeleton key={n} className="h-[265px] md:w-[300px] w-full" />)
          : null}
        {!isLoading && vacancies
          ? vacancies.map((vacancy) => <VacancyCard key={vacancy.SK} vacancy={vacancy} />)
          : null}
      </div>
    </div>
  );
}
