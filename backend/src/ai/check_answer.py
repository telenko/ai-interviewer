from typing import Annotated, Optional
from openai import OpenAI
import os

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

from src.config.limits import QUESTION_COMMENT_MAX_LEN


class CorrectnessLLM(BaseModel):
    model_config = ConfigDict(extra="forbid")
    is_valid: bool
    correctness_rate: Annotated[float, Field(strict=True, gt=0, le=1)]
    correctness_comment: Annotated[
        str, StringConstraints(max_length=QUESTION_COMMENT_MAX_LEN)
    ]


def check_answer(question, answer, role) -> Optional[CorrectnessLLM]:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.parse(
        model="gpt-4o-mini",
        response_format=CorrectnessLLM,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert evaluator for job interviews.\n"
                    "Your task is to assess whether the answer is valid,relevant and complete in context of the role.\n"
                    "Evaluate how well the answer:\n"
                    "- directly addresses the question,\n"
                    "- shows understanding of the role's responsibilities,\n"
                    "- provides a complete and thoughtful response.\n\n"
                    "- add comment of your 'correctness_rate' to 'correctness_comment' field.Clearly justify the reasoning of correctness rate, including key factors or evidence that influenced evaluation."
                    f"- Use maximum {QUESTION_COMMENT_MAX_LEN} characters for 'correctness_comment'"
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
