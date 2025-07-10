import json
from src.db.utils import TABLE
from src.operations import generate_questions


def lambda_handler(event, context):
    event_type = event.get("type")
    user_id = event.get("user_id")
    vacancy_sk = event.get("vacancy_sk")
    if event_type == "generate_questions":
        generate_questions.generateQuestions(
            TABLE, {"user_id": user_id, "vacancy_sk": vacancy_sk}
        )
