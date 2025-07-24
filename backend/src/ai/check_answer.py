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
        temperature=0,
        response_format=CorrectnessLLM,
        max_tokens=QUESTION_COMMENT_MAX_LEN + 100,
        messages=[
            {
                "role": "system",
                "content": (
                    "Strictly evaluate the answer (0-100):\n"
                    "- 90-100: complete, clear, relevant, examples/logic;\n"
                    "- 60-89: mostly correct, minor missing details or minor gaps;\n"
                    "- 40-59: partly correct, lacks clarity or depth, incomplete reasoning or code;;\n"
                    "- 25-39: minimal relevance, vague explanation, incorrect or missing main parts;\n"
                    "- 0-24: incorrect, empty, irrelevant.\n"
                    "If empty, score=0. If not related to role, score<=20.\n"
                    f"Correctness comment <= {QUESTION_COMMENT_MAX_LEN} chars"
                    + (f", respond in {lang}." if lang else ".")
                ),
            },
            {
                "role": "user",
                "content": (f"Role: {role}\nQuestion: {question}\nAnswer: {answer}"),
            },
        ],
    )
    return response.choices[0].message.parsed
