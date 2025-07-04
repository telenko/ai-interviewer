from src.ai import analyze_vacancy
from src.db.utils import add_item
from src.models.entities import build_question
from src.models.entities import Vacancy

def generateQuestions(table, payload):
    user_id = payload.get('user_id')
    vacancy_sk = payload.get('vacancy_sk')
    # TODO refactor : move to DB utils
    response = table.get_item(Key={"PK": f"USER#{user_id}", "SK": vacancy_sk})
    vacancy_data = response.get("Item")
    if not vacancy_data:
        print(f"Vacancy not found for {vacancy_sk}")
        return

    # 2. Створити обʼєкт Vacancy і викликати AI
    vacancy = Vacancy(**vacancy_data)
    questions_response = analyze_vacancy.analyze_vacancy(vacancy)
    if not questions_response or not questions_response.questions:
        return

    # 3. Зберегти питання
    for q in questions_response.questions:
        question = build_question(user_id, vacancy.SK, q.question, q.order)
        add_item(table, question)