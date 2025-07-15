from enum import Enum
from typing import Annotated, Optional, List
import uuid
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    HttpUrl,
    StringConstraints,
    TypeAdapter,
)

from src.config.limits import (
    ANSWER_MAX_LEN,
    LANG_CODE_LIMIT,
    QUESTION_MAX_LEN,
    SKILLS_MAX_AMOUNT,
    TEXT_MAX_LEN,
)


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


class QuestionType(Enum):
    TEXT = "text"
    CODING = "coding"

    @staticmethod
    def from_str(label: str):
        label = label.lower()
        if label == "text":
            return QuestionType.TEXT
        elif label == "coding":
            return QuestionType.CODING
        else:
            raise ValueError(f"Unknown type: {label}")


class BaseDynamoModel(BaseModel):
    model_config = ConfigDict(extra="forbid")

    def to_dynamo(self) -> dict:
        return self.model_dump(mode="json")


class Vacancy(BaseDynamoModel):
    PK: str
    SK: str
    title: Annotated[str, StringConstraints(max_length=TEXT_MAX_LEN)]
    skills: Annotated[
        List[Annotated[str, StringConstraints(max_length=TEXT_MAX_LEN)]],
        Field(max_length=SKILLS_MAX_AMOUNT),
    ]
    url: Optional[HttpUrl] = None
    progress: float = 0.0
    type: str
    score: float
    lang_code: Annotated[
        Optional[str], StringConstraints(max_length=LANG_CODE_LIMIT)
    ] = None


def build_vacancy(
    user_id: str,
    title: str,
    skills: List[str],
    url: Optional[HttpUrl] = None,
    lang_code: Optional[str] = None,
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
        lang_code=lang_code,
    )


class EditorLanguage(str, Enum):
    python = "py"
    javascript = "js"
    typescript = "ts"
    java = "java"
    csharp = "c#"
    dotnet = "dotnet"
    other = "other"

    @staticmethod
    def from_str(label: str) -> "EditorLanguage":
        label = label.lower()
        for lang in EditorLanguage:
            if lang.value == label or lang.name.lower() == label:
                return lang
        raise ValueError(f"Unknown language: {label}")


class Question(BaseDynamoModel):
    PK: str
    SK: str
    question: Annotated[str, StringConstraints(max_length=QUESTION_MAX_LEN)]
    answer: Annotated[Optional[str], StringConstraints(max_length=ANSWER_MAX_LEN)] = (
        None
    )
    explanation: Optional[str] = None
    correctness_score: float = 0.0
    order: Optional[int] = 0
    type: str
    question_type: Optional[QuestionType] = QuestionType.TEXT
    prog_lang_code: Optional[EditorLanguage] = None


def build_question(
    user_id: str,
    vacancy_SK: str,
    question_text: str,
    order: int,
    question_type: str,
    prog_lang_code: Optional[str],
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
        question_type=QuestionType.from_str(question_type),
        prog_lang_code=(
            EditorLanguage.from_str(prog_lang_code) if prog_lang_code else None
        ),
    )


def validate_questions(
    questions_data: List[dict], user_id: str, vacancy_sk: str
) -> List[Question]:
    result = []
    for q in questions_data:
        result.append(
            build_question(
                user_id,
                vacancy_sk,
                q.get("question") or "",
                q.get("order") or 0,
                q.get("question_type") or QuestionType.TEXT.value,
                q.get("prog_lang_code") or None,
            )
        )
    return result
