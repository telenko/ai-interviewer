import { useGetQuestionsQuery } from "@/services/questionApi";

export default function Interview({ vacancySK }: { vacancySK: string }) {
    const { data: questions } = useGetQuestionsQuery({ vacancy_SK: vacancySK })
    return <div>{questions?.map(q => <p key={q.SK}>{q.question}</p>)}</div>;
}