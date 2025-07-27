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
                    f"Generate up to {QUESTIONS_MAX_AMOUNT} interview questions for vacancy '{vacancy.title}' "
                    f"with skills: {', '.join(vacancy.skills)}. "
                    + (f"Language: {vacancy.lang_code}. " if vacancy.lang_code else "")
                    + (
                        f"Adapt to company {vacancy.company} (e.g., for IBM add system design for software engineers). "
                        if vacancy.company and vacancy.company.lower() != "none"
                        else ""
                    )
                    + f"If the role is technical/programming, include {QUESTIONS_MAX_AMOUNT/10} algorithmic/coding tasks (LeetCode style)"
                    + f" plus {QUESTIONS_MAX_AMOUNT/5} coding tasks based on required skills (f.e. React, Node, etc), "
                    "and set question_type='coding' with 'prog_lang_code'. "
                    "Add extra relevant topics inferred from the role and skills."
                ),
            }
        ],
    )
    return response.choices[0].message.parsed
