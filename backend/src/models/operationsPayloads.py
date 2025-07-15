from typing import Annotated, List, Optional
from pydantic import BaseModel, HttpUrl, StringConstraints, field_validator

from src.config.limits import ANSWER_MAX_LEN, ID_MAX_LEN


class CreateVacancyPayload(BaseModel):
    title: str
    skills: List[str]
    url: Optional[HttpUrl] = None
    lang_code: Optional[str] = None

    @field_validator("url", mode="before")
    @classmethod
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v


class AnswerQuestionPayload(BaseModel):
    answer: Annotated[str, StringConstraints(max_length=ANSWER_MAX_LEN)]
    question_SK: Annotated[str, StringConstraints(max_length=ID_MAX_LEN)]
    vacancy_SK: Annotated[str, StringConstraints(max_length=ID_MAX_LEN)]


class ExplainQuestionPayload(BaseModel):
    question_SK: Annotated[str, StringConstraints(max_length=ID_MAX_LEN)]
    vacancy_SK: Annotated[str, StringConstraints(max_length=ID_MAX_LEN)]


class GetVacancyPayload(BaseModel):
    vacancy_SK: Annotated[str, StringConstraints(max_length=ID_MAX_LEN)]


class GetQuestionsPayload(BaseModel):
    vacancy_SK: Annotated[str, StringConstraints(max_length=ID_MAX_LEN)]


class RemoveVacancyPayload(BaseModel):
    vacancy_SK: Annotated[str, StringConstraints(max_length=ID_MAX_LEN)]


class GetVacanciesPayload(BaseModel):
    pass


class GenerateVacancyPayload(BaseModel):
    url: HttpUrl
