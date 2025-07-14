from src.models.operationsPayloads import RemoveVacancyPayload
from src.db.query import (
    delete_vacancy_by_user_id_and_vacancy_SK,
    delete_vacancy_questions_by_user_id_and_vacancy_SK,
)


# {vacancy_SK}
def remove_vacancy(table, user_id, payload: RemoveVacancyPayload):
    vacancy_SK = payload.vacancy_SK
    delete_vacancy_questions_by_user_id_and_vacancy_SK(table, user_id, vacancy_SK)
    delete_vacancy_by_user_id_and_vacancy_SK(table, user_id, vacancy_SK)
    return {"status": "ok"}
