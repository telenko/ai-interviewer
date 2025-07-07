from typing import List, Optional
from openai import OpenAI
import os
from pydantic import BaseModel, ConfigDict


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
        f"Return max 20 characters in role/title"
        f"Return max 20 skills and max 20 chars in each skill"
        f"If there is no sign of job offer in document, return is_vacancy_looks_real=false"
    )
    print("Prompting AI to generate vacancy", prompt)
    response = client.chat.completions.parse(
        model="gpt-4o-mini",
        response_format=VacancyLLM,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    return response.choices[0].message.parsed