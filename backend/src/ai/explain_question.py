from typing import Optional
from openai import OpenAI
import os

from src.config.limits import EXPLANATION_MAX_LEN


def explain_question(question, role) -> Optional[str]:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": f"Job interview for role {role}. Make good explanation for this question: {question}. Use maximum {EXPLANATION_MAX_LEN} characters",
            }
        ],
    )
    return response.choices[0].message.content
