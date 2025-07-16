from typing import Annotated, List, Optional
from openai import OpenAI
import os
from pydantic import BaseModel, ConfigDict, Field, StringConstraints

from src.config.limits import SKILLS_MAX_AMOUNT, TEXT_MAX_LEN


class VacancyLLM(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: Annotated[str, StringConstraints(max_length=TEXT_MAX_LEN)]
    skills: Annotated[
        List[Annotated[str, StringConstraints(max_length=TEXT_MAX_LEN)]],
        Field(max_length=SKILLS_MAX_AMOUNT),
    ]
    is_vacancy_looks_real: bool


def generate_vacancy(title: str, description: str) -> Optional[VacancyLLM]:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    prompt = (
        f"Analyze the following document and extract vacancy data.\n\n"
        f"Title: {title}\n\n"
        f"Description: {description}\n\n"
        f"Instructions:\n"
        f"- Extract the role of the job offer and return it in 'title'. Limit it to {TEXT_MAX_LEN} characters.\n"
        f"- Extract a list of relevant skills. Return at most {SKILLS_MAX_AMOUNT} skills, each up to {TEXT_MAX_LEN} characters long.\n"
        f"- If the document does not appear to describe a real job offer, return is_vacancy_looks_real as false.\n"
    )
    print("Prompting AI to generate vacancy", prompt)
    response = client.chat.completions.parse(
        model="gpt-4o-mini",
        response_format=VacancyLLM,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    return response.choices[0].message.parsed
