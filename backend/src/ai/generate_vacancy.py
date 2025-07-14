from typing import List, Optional
from openai import OpenAI
import os
from pydantic import BaseModel, ConfigDict

from src.config.limits import SKILLS_MAX_AMOUNT, TEXT_MAX_LEN


class VacancyLLM(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: str
    skills: List[str]
    is_vacancy_looks_real: bool


def generate_vacancy(title: str, description: str) -> Optional[VacancyLLM]:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    prompt = (
        f"Generate job offer/vacancy based on document:"
        f"Title: {title}\n\n"
        f"Description: {description}\n\n"
        f"Return role of job offer in 'title'"
        f"Return max {TEXT_MAX_LEN} characters in role/title"
        f"Return max {SKILLS_MAX_AMOUNT} skills and max {TEXT_MAX_LEN} chars in each skill"
        f"If there is no sign of job offer in document, return is_vacancy_looks_real=false"
    )
    print("Prompting AI to generate vacancy", prompt)
    response = client.chat.completions.parse(
        model="gpt-4o-mini",
        response_format=VacancyLLM,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    return response.choices[0].message.parsed
