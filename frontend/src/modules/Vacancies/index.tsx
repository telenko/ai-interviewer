import { Skeleton } from '@/components/ui/skeleton';
import { useGetVacanciesQuery } from '@/services/vacancyApi';
import VacancyCard from './VacancyCard';
import { PlusCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddVacancyModal from './AddVacancyModal';
import { useState } from 'react';

export default function VacanciesGrid() {
  const { data: vacancies, isLoading } = useGetVacanciesQuery();
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <div className="p-4">
      <AddVacancyModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <Button className="flex items-center gap-2" onClick={() => setAddModalOpen(true)}>
        <PlusCircleIcon className="w-5 h-5" />
        Додати вакансію
      </Button>
      <div className="grid responsive-grid place-content-start gap-4 py-4">
        {isLoading
          ? [1, 2, 3].map((n) => <Skeleton key={n} className="h-[265px] w-[300px]" />)
          : null}
        {!isLoading && vacancies
          ? vacancies.map((vacancy) => <VacancyCard key={vacancy.SK} vacancy={vacancy} />)
          : null}
      </div>
    </div>
  );
}
