import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Question } from "@/models/entities";
import { useState } from "react";

export default function QuestionPanel({ question, onAnswer, onExplain, onNext, onPrev, disableNext, disablePrev }: { question: Question, onAnswer: (a: string) => void, onExplain: () => void, onNext: () => void, onPrev: () => void, disableNext: boolean, disablePrev: boolean }) {
    const [answer, setAnswer] = useState("")
    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto px-4 py-2">
            {/* Верхній блок з питанням */}
            <Card className="bg-gradient-to-r from-indigo-100 to-indigo-200 shadow-md rounded-2xl mb-4">
                <CardHeader className="text-lg font-semibold text-indigo-900">
                    {question.question}
                </CardHeader>
            </Card>

            {/* Контейнер для текстареї, що росте і скролиться при потребі */}
            <div className="flex-1 overflow-auto mb-4">
                <Textarea
                    placeholder="Введіть вашу відповідь..."
                    className="w-full min-h-[120px] resize-none h-full"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
            </div>

            {/* Кнопки — завжди видно внизу */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-2">
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