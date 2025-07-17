import { useGetVacanciesQuery } from '@/services/vacancyApi';
import VacancyCard, { VacancyCardSkeleton } from './VacancyCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddVacancyModal from './AddVacancyModal';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';

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

export default function VacanciesGrid() {
  const { data: vacancies, isLoading } = useGetVacanciesQuery();
  const [addModalOpen, setAddModalOpen] = useState(false);
  return (
    <div className="">
      <AddVacancyModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      {/* w-full max-w-sm */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        <AddVacancyBtn onClick={() => setAddModalOpen(true)} />
        {isLoading ? [1, 2, 3].map((n) => <VacancyCardSkeleton key={n} />) : null}
        {!isLoading && vacancies
          ? vacancies.map((vacancy) => <VacancyCard key={vacancy.SK} vacancy={vacancy} />)
          : null}
      </div>
    </div>
  );
}
