import json

from src.operations.remove_vacancy import remove_vacancy
from src.operations.get_vacancy import get_vacancy
from src.operations import explain_op, generate_vacancy_op
from src.db.utils import TABLE
from src.operations.enums import Operation
from src.operations import create_vacancy, get_vacancies, answer_question, get_questions


def lambda_handler(event, context):

    try:
        body = json.loads(event["body"])
        operation_str = body.get("operation")
        payload = body.get("payload")

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

        if operation == Operation.CREATE_VACANCY:
            result = create_vacancy.create_vacancy(TABLE, user_id, payload)
        elif operation == Operation.GET_VACANCIES:
            result = get_vacancies.get_vacancies(TABLE, user_id, payload)
        elif operation == Operation.GET_VACANCY:
            result = get_vacancy(TABLE, user_id, payload)
        elif operation == Operation.ANSWER_QUESTION:
            result = answer_question.answer_question(TABLE, user_id, payload)
        elif operation == Operation.GET_QUESTIONS:
            result = get_questions.get_questions(TABLE, user_id, payload)
        elif operation == Operation.EXPLAIN:
            result = explain_op.explain_op(TABLE, user_id, payload)
        elif operation == Operation.GENERATE_VACANCY:
            result = generate_vacancy_op.generate_vacancy_op(TABLE, user_id, payload)
        elif operation == Operation.REMOVE_VACANCY:
            result = remove_vacancy(TABLE, user_id, payload)
        elif operation == Operation.ECHO:
            return {"statusCode": 200, "body": "Hello from Lambda :)"}

        else:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Unsupported operation"}),
            }

        return {"statusCode": 200, "body": json.dumps(result)}

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
