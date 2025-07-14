from src.models.operationsPayloads import ExplainQuestionPayload
from src.ai.explain_question import explain_question
from src.db.query import (
    get_question_by_user_id_and_vacancy_SK_and_question_SK,
    get_vacancy_by_user_id_and_vacancy_SK,
)
from src.db.utils import update_entity


# { question_SK, vacancy_SK }
def explain_op(table, user_id, payload: ExplainQuestionPayload):
    question_SK = payload.question_SK
    vacancy_SK = payload.vacancy_SK
    question = get_question_by_user_id_and_vacancy_SK_and_question_SK(
        table, user_id, vacancy_SK, question_SK
    )
    if not question:
        raise Exception("question not found by specified SK")
    if question.explanation:
        # not allowing to explain question twice
        return {"explanation": question.explanation}
    vacancy = get_vacancy_by_user_id_and_vacancy_SK(table, user_id, vacancy_SK)
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
