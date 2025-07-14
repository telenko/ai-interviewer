import json
import boto3
import os

from src.models.operationsPayloads import CreateVacancyPayload
from src.config.limits import VACANCIES_MAX_AMOUNT
from src.db.query import get_vacancies_count_by_user_id
from src.db.utils import add_item
from src.models.entities import build_vacancy

lambda_client = boto3.client("lambda")


def invoke_generate_questions(user_id: str, vacancy_sk: str):
    message = {
        "type": "generate_questions",
        "user_id": user_id,
        "vacancy_sk": vacancy_sk,
    }
    lambda_client.invoke(
        FunctionName=os.environ["GENERATE_QUESTIONS_FUNCTION_NAME"],
        InvocationType="Event",  # async
        Payload=json.dumps(message).encode("utf-8"),
    )


def create_vacancy(table, user_id, payload: CreateVacancyPayload):
    current_vacancies_count = get_vacancies_count_by_user_id(table, user_id)
    if current_vacancies_count > VACANCIES_MAX_AMOUNT:
        raise Exception(
            f"Not allowed to have more than {VACANCIES_MAX_AMOUNT} of vacancies"
        )
    vacancy = build_vacancy(
        user_id=user_id,
        title=payload.title,
        skills=payload.skills,
        url=payload.url,
    )
    add_item(table, vacancy)

    invoke_generate_questions(user_id, vacancy_sk=vacancy.SK)

    return {
        "message": "Item created",
        "item": {"vacancy_SK": vacancy.SK},
    }
