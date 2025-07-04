from typing import Annotated, Optional
from openai import OpenAI
import os

from pydantic import BaseModel, ConfigDict, Field

class CorrectnessLLM(BaseModel):
    model_config = ConfigDict(extra="forbid")
    is_valid: bool
    correctness_rate: Annotated[float, Field(strict=True, gt=0, le=1)]

def check_answer(question, answer, role) -> Optional[CorrectnessLLM]:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.parse(
        model="gpt-4o-mini",
        response_format=CorrectnessLLM,
        messages=[{"role": "user", "content": f"Job interview is happening for role {role}. Check if the answer is correct for the question: {question}. Answer: {answer}"}]
    )
    return response.choices[0].message.parsed