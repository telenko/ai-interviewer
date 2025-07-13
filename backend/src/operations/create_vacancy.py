import json
import boto3
import os

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


def create_vacancy(table, user_id, payload):
    vacancy = build_vacancy(
        user_id=user_id,
        title=payload.get("title") or "",
        skills=payload.get("skills"),
        url=payload.get("url"),
    )
    add_item(table, vacancy)

    invoke_generate_questions(user_id, vacancy_sk=vacancy.SK)

    return {
        "message": "Item created",
        "item": {"vacancy_SK": vacancy.SK},
    }
