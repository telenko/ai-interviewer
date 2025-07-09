import { Skeleton } from "@/components/ui/skeleton";
import { useGetVacanciesQuery } from "@/services/vacancyApi";
import VacancyCard from "./VacancyCard";

export default function VacanciesGrid() {
    const { data: vacancies, isLoading } = useGetVacanciesQuery();

    return <div className="grid [grid-template-columns:repeat(auto-fill,minmax(100%,1fr))] 
  sm:[grid-template-columns:repeat(auto-fill,minmax(300px,1fr))] place-content-start gap-4 p-4">
        {isLoading ? [1, 2, 3].map((n) => <Skeleton key={n} className="h-[265px] w-[300px]" />) : null}
        {!isLoading && vacancies ? vacancies.map(vacancy => <VacancyCard key={vacancy.SK} vacancy={vacancy} />) : null}
    </div>;
}