from src.db.utils import USER_ID
from src.db.query import get_vacancy_by_user_id_and_vacancy_SK

# {vacancy_SK}
def get_vacancy(table, payload):
    vacancy_SK = payload.get('vacancy_SK')
    vacancy = get_vacancy_by_user_id_and_vacancy_SK(table, USER_ID, vacancy_SK)
    if not vacancy:
        raise Exception("vacancy with such SK not found for logged user")
    return { "vacancy": vacancy.model_dump() }