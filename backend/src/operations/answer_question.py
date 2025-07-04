import re

from src.ai import check_answer
from src.db.query import (
    get_question_by_user_id_and_question_SK,
    get_vacancy_by_user_id_and_vacancy_SK,
)
from src.db.utils import TABLE, USER_ID, update_entity


def extract_vacancy(text):
    match = re.search(r"VACANCY#[\w-]+", text)
    if match:
        return match.group(0)
    return None


# { question_SK, answer }
def answer_question(table, payload):
    required_keys = ["question_SK", "answer"]
    missing_keys = [key for key in required_keys if key not in payload]
    if missing_keys:
        raise ValueError(f"Missing required keys in payload: {missing_keys}")
    question_SK = payload.get("question_SK")
    vacancy_SK = extract_vacancy(question_SK)
    if not vacancy_SK:
        raise Exception("Invalid question")
    vacancy = get_vacancy_by_user_id_and_vacancy_SK(TABLE, USER_ID, vacancy_SK)
    question = get_question_by_user_id_and_question_SK(TABLE, USER_ID, question_SK)
    print("RETRIEVING KEYS", vacancy_SK, question_SK)
    if not vacancy or not question:
        raise Exception("Wrong data provided, failed to retrieve vacancy and question")
    validity = check_answer.check_answer(
        question.question,
        payload.get("answer"),
        vacancy.title,
    )
    if not validity:
        raise Exception("Failed to analyze answer within AI")

    updates = {
        "answer": payload.get("answer"),
        "correctness_score": validity.correctness_rate,
    }
    update_entity(
        table,
        pk_value=vacancy.PK,
        sk_value=question.SK,
        update_attrs=updates,
    )
    return {"score": validity.correctness_rate}
