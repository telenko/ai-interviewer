from src.models.operationsPayloads import GetVacancyPayload
from src.db.query import get_vacancy_by_user_id_and_vacancy_SK


# {vacancy_SK}
def get_vacancy(table, user_id, payload: GetVacancyPayload):
    vacancy_SK = payload.vacancy_SK
    vacancy = get_vacancy_by_user_id_and_vacancy_SK(table, user_id, vacancy_SK)
    if not vacancy:
        raise Exception("vacancy with such SK not found for logged user")
    return {"vacancy": vacancy.to_dynamo()}
