from src.models.operationsPayloads import GetVacanciesPayload
from src.db.query import get_vacancies_by_user_id


def get_vacancies(table, user_id, payload: GetVacanciesPayload):
    vacancies = get_vacancies_by_user_id(table, user_id)
    vacancies_serializable = [v.to_dynamo() for v in vacancies]
    return {"vacancies": vacancies_serializable}
