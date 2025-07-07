from src.db.query import get_questions_by_user_id_and_vacancy_id
from src.db.utils import USER_ID


def get_questions(table, payload):
    questions = get_questions_by_user_id_and_vacancy_id(table, USER_ID, payload.get("vacancy_SK"))
    questions_serializable = [q.model_dump() for q in questions]
    return { "questions": questions_serializable }