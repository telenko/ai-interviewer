from typing import List, Optional
from openai import BaseModel, OpenAI
import time
import os
from pydantic import ConfigDict
from typing import List
from pydantic import BaseModel, ConfigDict

from src.models.entities import Vacancy


class QuestionLLM(BaseModel):
    model_config = ConfigDict(extra="forbid")
    question: str
    order: int


class AnalyzeVacancyOutput(BaseModel):
    questions: List[QuestionLLM]


MAX_QUESTIONS = 10


def analyze_vacancy(vacancy: Vacancy) -> Optional[AnalyzeVacancyOutput]:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.parse(
        model="gpt-4o-mini",
        response_format=AnalyzeVacancyOutput,
        messages=[
            {
                "role": "user",
                "content": f"Make questions for interview for vacancy with title: {vacancy.title}, with such skills: {', '.join(vacancy.skills)}. Return maximum {MAX_QUESTIONS} questions",
            }
        ],
    )
    return response.choices[0].message.parsed
