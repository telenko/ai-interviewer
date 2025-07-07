import json

from src.operations import explain_op, generate_vacancy_op
from src.db.utils import TABLE
from src.operations.enums import Operation
from src.operations import create_vacancy, get_vacancies, answer_question, get_questions


def lambda_handler(event, context):

    try:
        body = json.loads(event["body"])
        operation_str = body.get("operation")
        payload = body.get("payload")

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
            result = create_vacancy.create_vacancy(TABLE, payload)
        elif operation == Operation.GET_VACANCIES:
            result = get_vacancies.get_vacancies(TABLE, payload)
        elif operation == Operation.ANSWER_QUESTION:
            result = answer_question.answer_question(TABLE, payload)
        elif operation == Operation.GET_QUESTIONS:
            result = get_questions.get_questions(TABLE, payload)
        elif operation == Operation.EXPLAIN:
            result = explain_op.explain_op(TABLE, payload)
        elif operation == Operation.GENERATE_VACANCY:
            result = generate_vacancy_op.generate_vacancy_op(TABLE, payload)
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
