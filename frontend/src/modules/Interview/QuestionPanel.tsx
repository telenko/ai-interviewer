import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { LightbulbIcon, Loader2Icon } from 'lucide-react';
import type { Question, Vacancy } from '@/models/entities';
import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuestionPanel({
  vacancy,
  question,
  onAnswer,
  onExplain,
  onNext,
  onPrev,
  disableNext,
  disablePrev,
  answerLoading: answerLoading,
  explanation,
  explanationLoading,
  vacancyLoading,
  questionLoading,
}: {
  question?: Question;
  onAnswer: (a: string) => void;
  onExplain: () => void;
  onNext: () => void;
  onPrev: () => void;
  disableNext: boolean;
  disablePrev: boolean;
  vacancy?: Vacancy;
  answerLoading: boolean;
  explanation: string;
  explanationLoading: boolean;
  vacancyLoading: boolean;
  questionLoading: boolean;
}) {
  const [answer, setAnswer] = useState('');
  useEffect(() => {
    setAnswer(question?.answer ?? '');
  }, [question]);
  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Link
          to="/vacancies"
          className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
        >
          ← Назад до вакансій
        </Link>

        {/* --- Назва ролі вакансії --- */}
        {vacancy && !vacancyLoading && (
          <h3 className="text-xl font-semibold text-gray-800 text-center sm:text-left">
            {vacancy.title}
          </h3>
        )}
      </div>

      {/* --- Верхній інфо-блок --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-gray-600">
          {!vacancy || vacancyLoading ? (
            <Skeleton className="h-[40px] w-[163px]" />
          ) : (
            <>
              <div>
                <span className="font-medium">Прогрес:</span> {(vacancy.progress * 100).toFixed(1)}%
              </div>
              <div>
                <span className="font-medium">Загальний скор:</span>{' '}
                {(vacancy.score * 100).toFixed(1)}
                /100
              </div>
            </>
          )}
        </div>
        {!question || questionLoading ? (
          <Skeleton className="h-[20px] w-[163px]" />
        ) : (
          <div className="text-sm text-indigo-700 font-semibold">
            Оцінка за це питання:{' '}
            {question.correctness_score ? (question.correctness_score * 100).toFixed(1) : '—'}
          </div>
        )}
      </div>

      {/* --- Питання --- */}
      <Card className="bg-gradient-to-r from-indigo-100 to-indigo-200 shadow-md rounded-2xl">
        <CardHeader className="text-lg font-semibold text-indigo-900">
          {!questionLoading && question ? question?.question : 'Почекай хвильку...'}
        </CardHeader>
      </Card>

      {/* --- Текстарія --- */}
      <Textarea
        placeholder="Введіть вашу відповідь..."
        className="min-h-[200px] resize-none flex-grow"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      {/* --- Пояснення --- */}
      {explanation && (
        <Card className="bg-yellow-50 border border-yellow-300 shadow-sm p-4 relative rounded-2xl">
          <div className="flex items-center mb-2 text-yellow-800 font-semibold text-sm">
            <LightbulbIcon className="h-4 w-4 mr-2" />
            Порада від AI
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(explanation)}
            className="absolute top-2 right-2 text-xs text-yellow-600 hover:text-yellow-800"
          >
            Копіювати
          </button>
          <div className="whitespace-pre-wrap text-sm text-yellow-900">{explanation}</div>
        </Card>
      )}

      {/* --- Кнопки --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-auto">
        <Button
          variant="secondary"
          onClick={onExplain}
          disabled={explanationLoading || questionLoading || !!explanation}
        >
          {explanationLoading ? <Loader2Icon className="animate-spin" /> : null}
          Поясни
        </Button>
        <Button
          onClick={() => onAnswer(answer)}
          disabled={answerLoading || answer === question?.answer || !answer || questionLoading}
        >
          {answerLoading ? <Loader2Icon className="animate-spin" /> : null}
          Відповісти
        </Button>
        <Button variant="outline" onClick={onPrev} disabled={disablePrev}>
          Назад
        </Button>
        <Button variant="outline" onClick={onNext} disabled={disableNext}>
          Вперед
        </Button>
      </div>
    </div>
  );
}
