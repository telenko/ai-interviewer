from enum import Enum
from typing import Annotated, List, Optional
from openai import BaseModel, OpenAI
import os
from pydantic import ConfigDict, Field, StringConstraints
from typing import List
from pydantic import BaseModel, ConfigDict

from src.config.limits import QUESTION_MAX_LEN, QUESTIONS_MAX_AMOUNT
from src.models.entities import Vacancy


class QuestionTypeLLM(str, Enum):
    TEXT = "text"
    CODING = "coding"


class QuestionLLM(BaseModel):
    model_config = ConfigDict(extra="forbid")
    question: Annotated[str, StringConstraints(max_length=QUESTION_MAX_LEN)]
    question_type: QuestionTypeLLM
    order: int


class AnalyzeVacancyOutput(BaseModel):
    questions: Annotated[
        List[QuestionLLM],
        Field(max_length=QUESTIONS_MAX_AMOUNT),
    ]


def analyze_vacancy(vacancy: Vacancy) -> Optional[AnalyzeVacancyOutput]:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.parse(
        model="gpt-4o-mini",
        response_format=AnalyzeVacancyOutput,
        messages=[
            {
                "role": "user",
                "content": f"Make questions for interview for vacancy with title: {vacancy.title}, with such skills: {', '.join(vacancy.skills)}.Return maximum {QUESTIONS_MAX_AMOUNT} questions. Use 'coding' only for programming vacancies.",
            }
        ],
    )
    return response.choices[0].message.parsed
