from src.models.operationsPayloads import GetQuestionsPayload
from src.db.query import get_questions_by_user_id_and_vacancy_id


def get_questions(table, user_id, payload: GetQuestionsPayload):
    questions = get_questions_by_user_id_and_vacancy_id(
        table, user_id, payload.vacancy_SK
    )
    questions_serializable = [q.to_dynamo() for q in questions]
    return {"questions": questions_serializable}
