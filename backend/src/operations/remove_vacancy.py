from src.db.utils import USER_ID
from src.db.query import (
    delete_vacancy_by_user_id_and_vacancy_SK,
    delete_vacancy_questions_by_user_id_and_vacancy_SK,
)


# {vacancy_SK}
def remove_vacancy(table, payload):
    vacancy_SK = payload.get("vacancy_SK")
    delete_vacancy_questions_by_user_id_and_vacancy_SK(table, USER_ID, vacancy_SK)
    delete_vacancy_by_user_id_and_vacancy_SK(table, USER_ID, vacancy_SK)
    return {"status": "ok"}
