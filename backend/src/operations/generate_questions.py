from src.db.query import get_vacancy_by_user_id_and_vacancy_SK
from src.ai import analyze_vacancy
from src.db.utils import add_item
from src.models.entities import build_question
from src.models.entities import Vacancy

def generateQuestions(table, payload):
    user_id = payload.get('user_id')
    vacancy_sk = payload.get('vacancy_sk')
    # 2. Створити обʼєкт Vacancy і викликати AI
    vacancy = get_vacancy_by_user_id_and_vacancy_SK(table, user_id, vacancy_sk)
    if not vacancy:
        print(f"Vacancy not found for {vacancy_sk}")
        return
    questions_response = analyze_vacancy.analyze_vacancy(vacancy)
    if not questions_response or not questions_response.questions:
        return

    # 3. Зберегти питання
    for q in questions_response.questions:
        question = build_question(user_id, vacancy.SK, q.question, q.order)
        add_item(table, question)