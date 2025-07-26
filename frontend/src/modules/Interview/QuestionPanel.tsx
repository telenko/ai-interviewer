import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  LightbulbIcon,
  Loader2Icon,
  InfoIcon,
  Building2,
  Send,
} from 'lucide-react';
import type { Question, Vacancy } from '@/models/entities';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { CodeEditor } from '@/components/custom/CodeEditor';
import { MAX_ANSWER_LEN } from '@/config/limits';
import LazyMarkdownPreview from '@/components/custom/LazyMarkdownPreview';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';

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
  currentQuestionIndex,
  totalQuestions,
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
  currentQuestionIndex?: number;
  totalQuestions: number;
}) {
  const [answer, setAnswer] = useState('');
  useEffect(() => {
    setAnswer(question?.answer ?? '');
  }, [question]);
  const { t } = useTranslation();
  const isValidAnswer = answer.length <= MAX_ANSWER_LEN;
  const answerDisable =
    answerLoading || answer === question?.answer || !answer || questionLoading || !isValidAnswer;
  const explainDisable = explanationLoading || questionLoading || !!explanation;
  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-6 flex-1">
      <div className="flex flex-nowrap items-center sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* --- Назва ролі вакансії --- */}
        <div className="flex flex-row items-center sm:justify-between w-full gap-1 text-left">
          <div className="text-xl font-semibold text-gray-800 w-full relative">
            {!vacancyLoading && vacancy ? (
              vacancy.title
            ) : (
              <Skeleton className="h-[28px] w-[163px]" />
            )}
            {!vacancyLoading && vacancy?.company ? (
              <div className="text-sm text-gray-500 flex items-center gap-1 absolute bottom-[-20px]">
                <Popover>
                  <PopoverTrigger asChild>
                    <span className="flex items-center gap-1 cursor-pointer">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {vacancy.company}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p className="text-sm text-gray-600">{t('company_name_hint')}</p>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              vacancyLoading && (
                <Skeleton className="mt-[5px] h-[16px] w-[100px] absolute bottom-[-20px]" />
              )
            )}
          </div>
          <div className="text-sm text-gray-500 w-auto text-right shrink-0">
            {!questionLoading && question ? (
              <div>
                {t('question')} {(currentQuestionIndex ?? 0) + 1}/{totalQuestions}
              </div>
            ) : (
              <Skeleton className="h-[20px] w-[60px]" />
            )}
          </div>
        </div>
      </div>

      {/* --- Верхній інфо-блок --- */}
      <div className="flex flex-row justify-between items-start gap-4">
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
          <div className="flex items-center space-x-1 text-sm text-indigo-700 font-semibold">
            <span>{t('score_for_question_colon')} </span>
            <span>
              {question.correctness_score !== undefined && question.correctness_score !== null
                ? (question.correctness_score * 100).toFixed(1)
                : '—'}
            </span>

            {question.correctness_comment && (
              <Popover>
                <PopoverTrigger asChild>
                  <InfoIcon
                    className="w-4 h-4 text-indigo-500 cursor-pointer"
                    aria-label="Correctness comment"
                    tabIndex={0}
                  />
                </PopoverTrigger>
                <PopoverContent className="max-w-xs whitespace-normal text-sm">
                  {question.correctness_comment}
                </PopoverContent>
              </Popover>
            )}
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
      <div className="relative flex-grow flex flex-col">
        {question?.question_type === 'coding' ? (
          <CodeEditor
            className={`min-h-[200px] max-h-[600px] resize-none flex-grow ${!isValidAnswer ? 'border border-2 border-red-500' : ''}`}
            minHeight={'200px'}
            placeholder={t('enter_answer')}
            value={answer}
            onChange={setAnswer}
            language={question.prog_lang_code || 'other'}
          />
        ) : (
          <Textarea
            placeholder={t('enter_answer')}
            className="min-h-[200px] resize-none flex-grow bg-white"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            maxLength={MAX_ANSWER_LEN}
          />
        )}
        <div className="block sm:hidden flex absolute bottom-2 right-2 z-3">
          {explanationLoading || !explainDisable ? (
            <Button
              onClick={onExplain}
              variant="outline"
              className="text-muted-foreground hover:text-primary flex mr-2"
            >
              {explanationLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <LightbulbIcon className="h-2 w-2" />
              )}
            </Button>
          ) : null}
          <Button
            variant="outline"
            onClick={() => onAnswer(answer)}
            disabled={answerDisable}
            size="icon"
            className="text-muted-foreground hover:text-primary flex"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
        {!isValidAnswer ? (
          <p className="mt-1 text-sm text-red-600 absolute bottom-[-20px] left-1" role="alert">
            {t('answer_too_long_error', { amount: MAX_ANSWER_LEN })}
          </p>
        ) : (
          <p className="hidden sm:block text-gray-600 mt-1 text-sm absolute right-3 bottom-3">
            {answer.length}/{MAX_ANSWER_LEN}
          </p>
        )}
      </div>

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
          <div className="whitespace-pre-wrap text-sm text-yellow-900">
            <LazyMarkdownPreview
              source={explanation}
              style={{
                backgroundColor: 'oklch(98.7% 0.026 102.212)', // Tailwind bg-yellow-100
                color: '#713F12', // Tailwind text-yellow-900
                padding: '1rem',
                borderRadius: '0.375rem',
              }}
              className="text-yellow-900"
            />
          </div>
        </Card>
      )}

      {/* --- Кнопки --- */}
      <div className="flex justify-between flex-nowrap gap-4 sm:grid sm:grid-cols-4 sm:gap-4 mt-auto">
        <Button
          variant="secondary"
          className="hidden sm:flex"
          onClick={onExplain}
          disabled={explainDisable}
        >
          {explanationLoading ? (
            <Loader2Icon className="animate-spin ml-[-15px]" />
          ) : (
            <LightbulbIcon className="h-2 w-2 ml-[-15px]" />
          )}
          {t('explain')}
        </Button>
        <Button
          className="hidden sm:flex"
          onClick={() => onAnswer(answer)}
          disabled={answerDisable}
        >
          {answerLoading ? (
            <Loader2Icon className="animate-spin ml-[-15px]" />
          ) : (
            <Send className="h-2 w-2 ml-[-15px]" />
          )}
          {t('answer')}
        </Button>
        <Button
          className="flex-1 flex items-center justify-center gap-2"
          variant="outline"
          onClick={onPrev}
          disabled={disablePrev}
        >
          <ChevronLeft className="w-4 h-4 flex-1 sm:mt-[2px]" />
          <span className="hidden sm:block flex-2 text-left">{t('back')}</span>
        </Button>
        <Button
          className="flex-1 flex items-center justify-center gap-2"
          variant="outline"
          onClick={onNext}
          disabled={disableNext}
        >
          <span className="hidden sm:block flex-2 text-right">{t('forward')}</span>
          <ChevronRight className="w-4 h-4 flex-1 sm:mt-[2px]" />
        </Button>
      </div>
    </div>
  );
}
