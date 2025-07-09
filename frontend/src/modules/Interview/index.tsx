import { useEffect, useMemo, useState } from "react";
import QuestionPanel from "./QuestionPanel";
import { useGetVacancyBySKQuery, useGetQuestionsQuery, useAnswerQuestionMutation } from "@/services/vacancyApi";

export default function Interview({ vacancySK }: { vacancySK: string }) {

    const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(-1);

    const { data: questions } = useGetQuestionsQuery({ vacancySK: vacancySK });
    const { data: vacancy } = useGetVacancyBySKQuery({ vacancySK: vacancySK });
    const [answerQuestion] = useAnswerQuestionMutation();

    const sortedQuestions = useMemo(() => questions ? [...questions].sort((qA, qB) => qB.order - qA.order) : [], [questions]);

    useEffect(() => {
        if (sortedQuestions.length === 0) {
            setActiveQuestionIdx(-1)
        }
        const questionIdx = (() => {
            for (let i = 0; i < sortedQuestions.length; i++) {
                if (!sortedQuestions[i].answer) {
                    return i;
                }
            }
            return sortedQuestions.length - 1;
        })();
        setActiveQuestionIdx(questionIdx);
    }, [sortedQuestions]);

    const activeQuestion = sortedQuestions[activeQuestionIdx];

    if (!activeQuestion || !vacancy) { return null; }

    return <QuestionPanel
        vacancy={vacancy}
        question={activeQuestion}
        disableNext={activeQuestionIdx === sortedQuestions.length - 1}
        disablePrev={activeQuestionIdx === 0}
        onAnswer={(answer) => {
            answerQuestion({ answer, questionSK: activeQuestion.SK, vacancySK })
        }}
        onExplain={() => { }}
        onNext={() => {
            setActiveQuestionIdx(Math.min(activeQuestionIdx + 1, sortedQuestions.length - 1))
        }}
        onPrev={() => {
            setActiveQuestionIdx(Math.max(activeQuestionIdx - 1, 0))
        }} />;
}