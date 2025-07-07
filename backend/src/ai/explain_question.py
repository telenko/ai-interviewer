from typing import Optional
from openai import OpenAI
import os

MAX_CHARACTERS = 500

def explain_question(question, role) -> Optional[str]:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": f"Job interview for role {role}. Make good explanation for this question: {question}. Use maximum {MAX_CHARACTERS} characters"}]
    )
    return response.choices[0].message.content