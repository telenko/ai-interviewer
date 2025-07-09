import { Skeleton } from "@/components/ui/skeleton";
import { useGetVacanciesQuery } from "@/services/vacancyApi";
import VacancyCard from "./VacancyCard";

export default function VacanciesGrid() {
    const { data: vacancies, isLoading } = useGetVacanciesQuery();

    return <div className="grid responsive-grid place-content-start gap-4 p-4">
        {isLoading ? [1, 2, 3].map((n) => <Skeleton key={n} className="h-[265px] w-[300px]" />) : null}
        {!isLoading && vacancies ? vacancies.map(vacancy => <VacancyCard key={vacancy.SK} vacancy={vacancy} />) : null}
    </div>;
}