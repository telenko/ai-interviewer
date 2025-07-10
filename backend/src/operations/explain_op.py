from src.ai.explain_question import explain_question
from src.db.query import (
    get_question_by_user_id_and_vacancy_SK_and_question_SK,
    get_vacancy_by_user_id_and_vacancy_SK,
)
from src.db.utils import USER_ID, update_entity


# { question_SK, vacancy_SK }
def explain_op(table, payload):
    question_SK = payload.get("question_SK")
    vacancy_SK = payload.get("vacancy_SK")
    question = get_question_by_user_id_and_vacancy_SK_and_question_SK(
        table, USER_ID, vacancy_SK, question_SK
    )
    if not question:
        raise Exception("question not found by specified SK")
    if question.explanation:
        # not allowing to explain question twice
        return {"explanation": question.explanation}
    vacancy = get_vacancy_by_user_id_and_vacancy_SK(table, USER_ID, vacancy_SK)
    if not vacancy or not question:
        raise Exception("vacancy_SK or question_SK is invalid")
    explanation = explain_question(question=question.question, role=vacancy.title)
    updates = {
        "explanation": explanation,
    }
    update_entity(
        table,
        pk_value=question.PK,
        sk_value=question.SK,
        update_attrs=updates,
    )
    return {"explanation": explanation}
