import json
from typing import Any, Callable, Dict, Type

from pydantic import BaseModel, ValidationError

from src.models.operationsPayloads import (
    AnswerQuestionPayload,
    CreateVacancyPayload,
    ExplainQuestionPayload,
    GenerateVacancyPayload,
    GetQuestionsPayload,
    GetVacanciesPayload,
    GetVacancyPayload,
    RemoveVacancyPayload,
)
from src.operations.remove_vacancy import remove_vacancy
from src.operations.get_vacancy import get_vacancy
from src.operations import explain_op, generate_vacancy_op
from src.db.utils import TABLE
from src.operations.enums import Operation
from src.operations import create_vacancy, get_vacancies, answer_question, get_questions

operation_map: Dict[
    Operation, tuple[Callable[[Any, str, Any], Any], Type[BaseModel]]
] = {
    Operation.CREATE_VACANCY: (create_vacancy.create_vacancy, CreateVacancyPayload),
    Operation.ANSWER_QUESTION: (answer_question.answer_question, AnswerQuestionPayload),
    Operation.EXPLAIN: (explain_op.explain_op, ExplainQuestionPayload),
    Operation.GET_VACANCIES: (get_vacancies.get_vacancies, GetVacanciesPayload),
    Operation.GET_VACANCY: (get_vacancy, GetVacancyPayload),
    Operation.GET_QUESTIONS: (get_questions.get_questions, GetQuestionsPayload),
    Operation.REMOVE_VACANCY: (remove_vacancy, RemoveVacancyPayload),
    Operation.GENERATE_VACANCY: (
        generate_vacancy_op.generate_vacancy_op,
        GenerateVacancyPayload,
    ),
    # можна додавати нові пари тут
}


def lambda_handler(event, context):

    try:
        body = json.loads(event["body"])
        operation_str = body.get("operation")
        raw_payload = body.get("payload")

        claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
        user_id = claims["sub"]  # Унікальний Cognito user ID

        if not user_id:
            return {
                "statusCode": 401,
            }

        if not operation_str:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "No operation provided"}),
            }

        try:
            operation = Operation.from_str(operation_str)
        except ValueError as e:
            return {"statusCode": 400, "body": json.dumps({"error": str(e)})}

        handler, PayloadModel = operation_map[operation]

        try:
            # Валідую payload
            payload = PayloadModel.model_validate(raw_payload)
        except ValidationError as e:
            return {"statusCode": 400, "body": json.dumps({"error": str(e)})}

        # Викликаємо функцію обробки
        result = handler(TABLE, user_id, payload)
        return {"statusCode": 200, "body": json.dumps(result)}

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
