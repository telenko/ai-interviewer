from src.db.query import get_questions_by_user_id_and_vacancy_id


def get_questions(table, user_id, payload):
    questions = get_questions_by_user_id_and_vacancy_id(
        table, user_id, payload.get("vacancy_SK")
    )
    questions_serializable = [q.model_dump() for q in questions]
    return {"questions": questions_serializable}
