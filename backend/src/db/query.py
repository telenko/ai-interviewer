from boto3.dynamodb.conditions import Key
from typing import List, Optional
from src.models.entities import Vacancy, Question


def get_vacancies_by_user_id(table, user_id: str) -> List[Vacancy]:
    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
        & Key("SK").begins_with("VACANCY#")
    )
    items = response.get("Items", [])
    return [Vacancy(**item) for item in items]


def get_questions_by_user_id_and_vacancy_id(
    table, user_id: str, vacancy_SK: str
) -> List[Question]:
    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
        & Key("SK").begins_with(f"{vacancy_SK}#QUESTION#")
    )
    items = response.get("Items", [])
    return [Question(**item) for item in items]


def get_question_by_user_id_and_question_SK(
    table, user_id: str, question_SK: str
) -> Question:
    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
        & Key("SK").begins_with(f"{question_SK}")
    )
    items = response.get("Items", [])
    return Question(**items[0])


def get_vacancy_by_user_id_and_vacancy_SK(
    table, user_id: str, vacancy_SK: str
) -> Optional[Vacancy]:
    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
        & Key("SK").begins_with(f"VACANCY#{vacancy_SK}")
    )
    items = response.get("Items", [])
    if not items:
        return None
    # Припускаємо, що вакансія унікальна по SK, беремо перший елемент
    return Vacancy(**items[0])
