from boto3.dynamodb.conditions import Key
from typing import List, Optional, Tuple
from src.models.entities import EntityType, Vacancy, Question

ITEMS_LIMIT_LEN = 40


def get_vacancies_by_user_id(table, user_id: str) -> List[Vacancy]:
    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
        & Key("SK").begins_with("VACANCY#"),
        Limit=ITEMS_LIMIT_LEN,
    )
    items = response.get("Items", [])
    return [
        Vacancy(**item) for item in items if item["type"] == EntityType.VACANCY.value
    ]


def get_questions_by_user_id_and_vacancy_id(
    table, user_id: str, vacancy_SK: str
) -> List[Question]:
    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}#{vacancy_SK}")
        & Key("SK").begins_with(f"QUESTION#"),
        Limit=ITEMS_LIMIT_LEN,
    )
    items = response.get("Items", [])
    return [Question(**item) for item in items]


def get_question_by_user_id_and_vacancy_SK_and_question_SK(
    table, user_id: str, vacancy_SK: str, question_SK: str
) -> Optional[Question]:
    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}#{vacancy_SK}")
        & Key("SK").eq(f"{question_SK}"),
        Limit=ITEMS_LIMIT_LEN,
    )
    items = response.get("Items", [])
    return Question(**items[0])


def get_vacancy_by_user_id_and_vacancy_SK(
    table, user_id: str, vacancy_SK: str
) -> Optional[Vacancy]:
    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
        & Key("SK").eq(f"{vacancy_SK}"),
        Limit=ITEMS_LIMIT_LEN,
    )
    items = response.get("Items", [])
    if not items:
        return None
    # Припускаємо, що вакансія унікальна по SK, беремо перший елемент
    return Vacancy(**items[0])


def calculate_progress_and_score(questions: List[Question]) -> Tuple[float, float]:
    if not questions:
        return 0.0, 0.0

    answered_questions = [q for q in questions if q.answer and q.answer.strip()]
    total_questions = len(questions)
    total_answered = len(answered_questions)

    # Прогрес: частка відповідей
    progress = total_answered / total_questions

    # Середній бал: тільки по тих, де є відповідь
    if total_answered > 0:
        total_score = sum(q.correctness_score for q in answered_questions)
        average_score = total_score / total_answered
    else:
        average_score = 0.0

    return round(progress, 4), round(average_score, 4)


def delete_vacancy_by_user_id_and_vacancy_SK(table, user_id: str, vacancy_SK: str):
    table.delete_item(Key={"PK": f"USER#{user_id}", "SK": vacancy_SK})


def delete_vacancy_questions_by_user_id_and_vacancy_SK(
    table, user_id: str, vacancy_SK: str
):
    questions = get_questions_by_user_id_and_vacancy_id(table, user_id, vacancy_SK)
    for question in questions:
        table.delete_item(Key={"PK": question.PK, "SK": question.SK})
