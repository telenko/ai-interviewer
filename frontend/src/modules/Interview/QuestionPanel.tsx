import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Question } from "@/models/entities";
import { useState } from "react";

export default function QuestionPanel({ question, onAnswer, onExplain, onNext, onPrev, disableNext, disablePrev }: { question: Question, onAnswer: (a: string) => void, onExplain: () => void, onNext: () => void, onPrev: () => void, disableNext: boolean, disablePrev: boolean }) {
    const [answer, setAnswer] = useState("")
    return (
        <div className="max-w-2xl mx-auto p-4 flex flex-col h-screen gap-6">
            {/* Блок з питанням — займає тільки потрібну висоту */}
            <Card className="bg-gradient-to-r from-indigo-100 to-indigo-200 shadow-md rounded-2xl flex-none">
                <CardHeader className="text-lg font-semibold text-indigo-900">
                    {question.question}
                </CardHeader>
            </Card>

            {/* Текстарія — розтягується і займає весь вільний простір */}
            <div className="flex-1">
                <Textarea
                    placeholder="Введіть вашу відповідь..."
                    className="w-full h-full resize-none"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
            </div>

            {/* Кнопки — завжди знизу, фіксована висота */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-none">
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