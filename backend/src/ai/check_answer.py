from typing import Annotated, Optional
from openai import OpenAI
import os

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

from src.config.limits import QUESTION_COMMENT_MAX_LEN


class CorrectnessLLM(BaseModel):
    model_config = ConfigDict(extra="forbid")
    is_valid: bool
    correctness_rate: Annotated[int, Field(strict=True, gt=0, le=100)]
    correctness_comment: Annotated[
        str, StringConstraints(max_length=QUESTION_COMMENT_MAX_LEN)
    ]


def check_answer(
    question, answer, role, lang: Optional[str]
) -> Optional[CorrectnessLLM]:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.parse(
        model="gpt-4o-mini",
        response_format=CorrectnessLLM,
        max_tokens=QUESTION_COMMENT_MAX_LEN + 100,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert evaluator for job interviews.\n"
                    "Score answer 0-100 by rules:\n"
                    "90-100 = full, clear, relevant with examples or detailed logic, fully covers question;\n"
                    "70-89 = mostly correct and functional, minor gaps;\n"
                    "40-69 = incomplete, partial or vague;\n"
                    "0-39 = incorrect, invalid, irrelevant.\n\n"
                    "Consider that answer MUST:\n"
                    "- show understanding of the role's responsibilities.\n\n"
                    "Notes:\n"
                    f"- Add a brief 'correctness_comment' explaining your score."
                    f"- Return max {QUESTION_COMMENT_MAX_LEN} characters for 'correctness_comment'"
                    f"\n- Answer in language {lang}"
                    if lang
                    else ""
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Role: {role}\n" f"Question: {question}\n" f"Answer: {answer}"
                ),
            },
        ],
    )
    return response.choices[0].message.parsed
