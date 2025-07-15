from enum import Enum
from typing import Annotated, List, Optional
from openai import BaseModel, OpenAI
import os
from pydantic import ConfigDict, Field, StringConstraints
from typing import List
from pydantic import BaseModel, ConfigDict

from src.config.limits import QUESTION_MAX_LEN, QUESTIONS_MAX_AMOUNT
from src.models.entities import Vacancy, EditorLanguage


class QuestionTypeLLM(str, Enum):
    TEXT = "text"
    CODING = "coding"


class QuestionLLM(BaseModel):
    model_config = ConfigDict(extra="forbid")
    question: Annotated[str, StringConstraints(max_length=QUESTION_MAX_LEN)]
    question_type: QuestionTypeLLM
    order: int
    prog_lang_code: Optional[EditorLanguage] = None


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
                "content": (
                    f"Make questions for interview for vacancy with title: {vacancy.title}, with such skills: {', '.join(vacancy.skills)}."
                    f"Return maximum {QUESTIONS_MAX_AMOUNT} questions."
                    f"Set question_type 'coding' only for programming vacancies."
                    f"Set 'prog_lang_code' flag only for 'coding' questions."
                    + (f"Use language {vacancy.lang_code}" if vacancy.lang_code else "")
                ),
            }
        ],
    )
    return response.choices[0].message.parsed
