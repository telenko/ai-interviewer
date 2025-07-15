import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ChevronLeft, ChevronRight, LightbulbIcon, Loader2Icon } from 'lucide-react';
import type { Question, Vacancy } from '@/models/entities';
import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { CodeEditor } from '@/components/custom/CodeEditor';
import { MAX_ANSWER_LEN } from '@/config/limits';

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
  const { t } = useTranslation();
  const isValid = answer.length <= MAX_ANSWER_LEN;
  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-6 min-h-screen">
      <div className="flex flex-nowrap items-center sm:flex-row sm:items-center sm:justify-between gap-2">
        <Link
          to="/vacancies"
          className="sm:text-sm text-2xl text-indigo-600 hover:underline flex items-center gap-1"
        >
          <span className="hidden sm:block">← {t('backToVacancies')}</span>
          <Button variant="outline" className="flex items-center gap-1 sm:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>

        {/* --- Назва ролі вакансії --- */}
        {vacancy && !vacancyLoading && (
          <h3 className="text-xl font-semibold text-gray-800 text-center sm:text-left">
            {vacancy.title}
          </h3>
        )}
        {!vacancy || vacancyLoading ? <Skeleton className="h-[28px] w-[163px]" /> : null}
      </div>

      {/* --- Верхній інфо-блок --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-gray-600">
          {!vacancy || vacancyLoading ? (
            <Skeleton className="h-[40px] w-[163px]" />
          ) : (
            <>
              <div>
                <span className="font-medium">{t('progress_colon')}</span>{' '}
                {(vacancy.progress * 100).toFixed(1)}%
              </div>
              <div>
                <span className="font-medium">{t('total_score_colon')}</span>{' '}
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
            {t('score_for_question_colon')}{' '}
            {question.correctness_score ? (question.correctness_score * 100).toFixed(1) : '—'}
          </div>
        )}
      </div>

      {/* --- Питання --- */}
      <Card className="bg-gradient-to-r from-indigo-100 to-indigo-200 shadow-md rounded-2xl">
        <CardHeader className="text-lg font-semibold text-indigo-900">
          {!questionLoading && question ? question?.question : t('pls_wait_a_sec')}
        </CardHeader>
      </Card>

      {/* --- Текстарія --- */}
      {question?.question_type === 'coding' ? (
        <CodeEditor
          className={`min-h-[200px] max-h-[600px] resize-none flex-grow ${!isValid ? 'border border-2 border-red-500' : ''}`}
          minHeight={'200px'}
          placeholder={t('enter_answer')}
          value={answer}
          onChange={setAnswer}
          language={question.prog_lang_code || 'other'}
        />
      ) : (
        <Textarea
          placeholder={t('enter_answer')}
          className="min-h-[200px] resize-none flex-grow"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          maxLength={MAX_ANSWER_LEN}
        />
      )}

      {/* --- Пояснення --- */}
      {explanation && (
        <Card className="bg-yellow-50 border border-yellow-300 shadow-sm p-4 relative rounded-2xl">
          <div className="flex items-center mb-2 text-yellow-800 font-semibold text-sm">
            <LightbulbIcon className="h-4 w-4 mr-2" />
            {t('explanation_AI')}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(explanation)}
            className="absolute top-2 right-2 text-xs text-yellow-600 hover:text-yellow-800"
          >
            {t('copy')}
          </button>
          <div className="whitespace-pre-wrap text-sm text-yellow-900">{explanation}</div>
        </Card>
      )}

      {/* --- Кнопки --- */}
      <div className="flex justify-between flex-nowrap gap-4 sm:grid sm:grid-cols-4 sm:gap-4 mt-auto">
        <Button
          variant="secondary"
          onClick={onExplain}
          disabled={explanationLoading || questionLoading || !!explanation}
        >
          {explanationLoading ? <Loader2Icon className="animate-spin" /> : null}
          {t('explain')}
        </Button>
        <Button
          onClick={() => onAnswer(answer)}
          disabled={
            answerLoading || answer === question?.answer || !answer || questionLoading || !isValid
          }
        >
          {answerLoading ? <Loader2Icon className="animate-spin" /> : null}
          {t('answer')}
        </Button>
        <Button variant="outline" onClick={onPrev} disabled={disablePrev}>
          <ChevronLeft className="sm:hidden w-4 h-4" />
          <span className="hidden sm:block">{t('back')}</span>
        </Button>
        <Button variant="outline" onClick={onNext} disabled={disableNext}>
          <ChevronRight className="sm:hidden w-4 h-4" />
          <span className="hidden sm:block">{t('forward')}</span>
        </Button>
      </div>
    </div>
  );
}
