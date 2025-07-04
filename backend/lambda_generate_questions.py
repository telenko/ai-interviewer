import json
from src.db.utils import TABLE
from src.operations import generate_questions

def lambda_handler(event, context):
    for record in event["Records"]:
        body = json.loads(record["body"])
        if body.get("type") != "generate_questions":
            continue

        user_id = body["user_id"]
        vacancy_sk = body["vacancy_sk"]
        payload = {
            "user_id": user_id,
            "vacancy_sk": vacancy_sk
        }
        generate_questions.generateQuestions(TABLE, payload)