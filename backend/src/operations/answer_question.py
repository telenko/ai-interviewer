from src.db.query import (
    calculate_progress_and_score,
    get_question_by_user_id_and_vacancy_SK_and_question_SK,
    get_questions_by_user_id_and_vacancy_id,
    get_vacancy_by_user_id_and_vacancy_SK,
)
from src.ai import check_answer

from src.db.utils import TABLE, USER_ID, update_entity


def update_vacancy_metrics(table, PK, vacancy_SK):
    questions = get_questions_by_user_id_and_vacancy_id(
        table, USER_ID, vacancy_SK=vacancy_SK
    )
    progress, score = calculate_progress_and_score(questions)
    updates = {
        "progress": progress,
        "score": score,
    }
    update_entity(
        table,
        pk_value=PK,
        sk_value=vacancy_SK,
        update_attrs=updates,
    )


# { question_SK, vacancy_SK, answer }
def answer_question(table, payload):
    required_keys = ["question_SK", "vacancy_SK", "answer"]
    missing_keys = [key for key in required_keys if key not in payload]
    if missing_keys:
        raise ValueError(f"Missing required keys in payload: {missing_keys}")
    question_SK = payload.get("question_SK")
    vacancy_SK = payload.get("vacancy_SK")
    vacancy = get_vacancy_by_user_id_and_vacancy_SK(TABLE, USER_ID, vacancy_SK)
    question = get_question_by_user_id_and_vacancy_SK_and_question_SK(
        TABLE, USER_ID, vacancy_SK, question_SK
    )
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
        pk_value=question.PK,
        sk_value=question.SK,
        update_attrs=updates,
    )
    update_vacancy_metrics(table, vacancy.PK, vacancy.SK)
    return {"score": validity.correctness_rate}
