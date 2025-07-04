from typing import Optional, List
import uuid
from pydantic import BaseModel, ConfigDict


class BaseDynamoModel(BaseModel):
    model_config = ConfigDict(extra="forbid")

    def to_dynamo(self) -> dict:
        return self.model_dump()


class Vacancy(BaseDynamoModel):
    PK: str
    SK: str
    title: str
    skills: List[str]
    url: Optional[str] = None
    progress: float = 0.0


def build_vacancy(
    user_id: str, title: str, skills: List[str], url: Optional[str] = None
) -> Vacancy:
    vacancy_id = str(uuid.uuid4())
    return Vacancy(
        PK=f"USER#{user_id}",
        SK=f"VACANCY#{vacancy_id}",
        title=title,
        skills=skills,
        url=url,
        progress=0.0,
    )


class Question(BaseDynamoModel):
    PK: str
    SK: str
    question: str
    answer: Optional[str] = None
    correctness_score: float = 0.0
    order: Optional[int] = 0


def build_question(
    user_id: str, vacancy_SK: str, question_text: str, order: int
) -> Question:
    question_id = str(uuid.uuid4())
    return Question(
        PK=f"USER#{user_id}",
        SK=f"{vacancy_SK}#QUESTION#{question_id}",
        question=question_text,
        answer=None,
        correctness_score=0.0,
        order=order,
    )


def validate_questions(
    questions_data: List[dict], user_id: str, vacancy_sk: str
) -> List[Question]:
    result = []
    for q in questions_data:
        result.append(
            build_question(
                user_id, vacancy_sk, q.get("question") or "", q.get("order") or 0
            )
        )
    return result
