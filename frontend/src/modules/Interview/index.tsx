import { useEffect, useMemo, useRef, useState } from 'react';
import QuestionPanel from './QuestionPanel';
import {
  useGetVacancyBySKQuery,
  useGetQuestionsQuery,
  useAnswerQuestionMutation,
} from '@/services/vacancyApi';
import { fetchExplanation, useExplanation } from '@/store/explanationSlice';
import { useAppDispatch } from '@/store';
import type { Question } from '@/models/entities';

export default function Interview({ vacancySK }: { vacancySK: string }) {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(-1);
  const autoSlideDone = useRef(false);
  const dispatch = useAppDispatch();

  const {
    data: questions = [],
    isLoading: questionsLoading,
    refetch,
  } = useGetQuestionsQuery({
    vacancySK: vacancySK,
  });
  const { data: vacancy, isLoading: vacancyLoading } = useGetVacancyBySKQuery({
    vacancySK: vacancySK,
  });
  const [answerQuestion, { isLoading: answerLoading }] = useAnswerQuestionMutation();
  const sortedQuestions = useMemo(
    () => (questions ? [...questions].sort((qA, qB) => qB.order - qA.order) : []),
    [questions],
  );

  useEffect(() => {
    if (!vacancySK || questions.length > 0 || questionsLoading) return;

    const interval = setInterval(() => {
      refetch();
    }, 5000); // кожні 5 секунд

    return () => clearInterval(interval);
  }, [vacancySK, questions.length, refetch, questionsLoading]);

  const activeQuestion: Question | undefined = sortedQuestions[activeQuestionIdx];

  const { explanation, loading: explanationLoading } = useExplanation(activeQuestion?.SK);

  useEffect(() => {
    if (autoSlideDone.current) {
      return;
    }
    if (sortedQuestions.length === 0) {
      setActiveQuestionIdx(-1);
      return;
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
    autoSlideDone.current = true;
  }, [sortedQuestions]);

  return (
    <QuestionPanel
      vacancy={vacancy}
      question={activeQuestion}
      disableNext={activeQuestionIdx === sortedQuestions.length - 1}
      disablePrev={activeQuestionIdx === 0}
      answerLoading={answerLoading}
      explanation={explanation || activeQuestion?.explanation || ''}
      explanationLoading={explanationLoading}
      onAnswer={(answer) => {
        answerQuestion({ answer, questionSK: activeQuestion?.SK, vacancySK });
      }}
      onExplain={() => {
        dispatch(fetchExplanation({ questionSK: activeQuestion?.SK, vacancySK }));
      }}
      onNext={() => {
        setActiveQuestionIdx(Math.min(activeQuestionIdx + 1, sortedQuestions.length - 1));
      }}
      onPrev={() => {
        setActiveQuestionIdx(Math.max(activeQuestionIdx - 1, 0));
      }}
      vacancyLoading={vacancyLoading}
      questionLoading={questionsLoading}
      currentQuestionIndex={activeQuestionIdx}
      totalQuestions={questions?.length || 0}
    />
  );
}
