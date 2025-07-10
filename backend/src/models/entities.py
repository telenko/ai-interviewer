from enum import Enum
from typing import Optional, List
import uuid
from pydantic import BaseModel, ConfigDict


class EntityType(Enum):
    VACANCY = "vacancy"
    QUESTION = "question"

    @staticmethod
    def from_str(label: str):
        label = label.lower()
        if label == "vacancy":
            return EntityType.VACANCY
        elif label == "question":
            return EntityType.QUESTION
        else:
            raise ValueError(f"Unknown operation: {label}")


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
    type: str
    score: float


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
        type=EntityType.VACANCY.value,
        score=0.0,
    )


class Question(BaseDynamoModel):
    PK: str
    SK: str
    question: str
    answer: Optional[str] = None
    explanation: Optional[str] = None
    correctness_score: float = 0.0
    order: Optional[int] = 0
    type: str


def build_question(
    user_id: str, vacancy_SK: str, question_text: str, order: int
) -> Question:
    question_id = str(uuid.uuid4())
    return Question(
        PK=f"USER#{user_id}#{vacancy_SK}",
        SK=f"QUESTION#{question_id}",
        question=question_text,
        answer=None,
        explanation=None,
        correctness_score=0.0,
        order=order,
        type=EntityType.QUESTION.value,
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
