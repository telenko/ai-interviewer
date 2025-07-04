from boto3.dynamodb.conditions import Key
from typing import List, Optional
from src.db.utils import extract_vacancy_sk
from src.models.entities import EntityType, Vacancy, Question

def get_vacancies_by_user_id(table, user_id: str) -> List[Vacancy]:
    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
        & Key("SK").begins_with("VACANCY#")
    )
    items = response.get("Items", [])
    return [Vacancy(**item) for item in items if item['type'] == EntityType.VACANCY.value]


def get_questions_by_user_id_and_vacancy_id(
    table, user_id: str, vacancy_SK: str
) -> List[Question]:
    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
        & Key("SK").begins_with(f"QUESTION#")
    )
    items = response.get("Items", [])
    # TODO Andrii: here we are reading all the rows of vacancies and questions, which is not efficient
    return [Question(**item) for item in items if extract_vacancy_sk(item['SK']) == vacancy_SK]


def get_question_by_user_id_and_question_SK(
    table, user_id: str, question_SK: str
) -> Question:
    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
        & Key("SK").eq(f"{question_SK}")
    )
    items = response.get("Items", [])
    return Question(**items[0])


def get_vacancy_by_user_id_and_vacancy_SK(
    table, user_id: str, vacancy_SK: str
) -> Optional[Vacancy]:
    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
        & Key("SK").eq(f"{vacancy_SK}")
    )
    items = response.get("Items", [])
    if not items:
        return None
    # Припускаємо, що вакансія унікальна по SK, беремо перший елемент
    return Vacancy(**items[0])
