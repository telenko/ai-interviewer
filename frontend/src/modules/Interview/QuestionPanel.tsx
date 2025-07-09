import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Question, Vacancy } from "@/models/entities";
import { useEffect, useState } from "react";

export default function QuestionPanel({ vacancy, question, onAnswer, onExplain, onNext, onPrev, disableNext, disablePrev }: { question: Question, onAnswer: (a: string) => void, onExplain: () => void, onNext: () => void, onPrev: () => void, disableNext: boolean, disablePrev: boolean, vacancy: Vacancy }) {
    const [answer, setAnswer] = useState('');
    useEffect(() => {
        setAnswer(question.answer ?? '')
    }, [question]);
    return (
        <div className="max-w-2xl mx-auto p-4 flex flex-col gap-6 min-h-screen">
            {/* --- Верхній інфо-блок --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                    <div><span className="font-medium">Прогрес:</span> {(vacancy.progress * 100).toFixed(1)}%</div>
                    <div><span className="font-medium">Загальний скор:</span> {(vacancy.score * 100).toFixed(1)}/100</div>
                </div>
                <div className="text-sm text-indigo-700 font-semibold">
                    Оцінка за це питання: {question.correctness_score ? (question.correctness_score * 100).toFixed(1) : '—'}
                </div>
            </div>

            {/* --- Питання --- */}
            <Card className="bg-gradient-to-r from-indigo-100 to-indigo-200 shadow-md rounded-2xl">
                <CardHeader className="text-lg font-semibold text-indigo-900">
                    {question.question}
                </CardHeader>
            </Card>

            {/* --- Текстарія --- */}
            <Textarea
                placeholder="Введіть вашу відповідь..."
                className="min-h-[200px] resize-none flex-grow"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
            />

            {/* --- Кнопки --- */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-auto">
                <Button variant="secondary" onClick={onExplain}>
                    Поясни
                </Button>
                <Button onClick={() => onAnswer(answer)}>
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
    )
}