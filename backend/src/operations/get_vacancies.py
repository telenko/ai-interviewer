from src.db.utils import USER_ID
from src.db.query import get_vacancies_by_user_id


def get_vacancies(table, payload):
    vacancies = get_vacancies_by_user_id(table, USER_ID)
    vacancies_serializable = [v.model_dump() for v in vacancies]
    return { "vacancies": vacancies_serializable }