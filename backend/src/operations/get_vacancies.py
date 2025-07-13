from src.db.query import get_vacancies_by_user_id


def get_vacancies(table, user_id, payload):
    vacancies = get_vacancies_by_user_id(table, user_id)
    vacancies_serializable = [v.model_dump() for v in vacancies]
    return {"vacancies": vacancies_serializable}
