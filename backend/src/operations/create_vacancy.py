import json

from src.db.utils import SQS, USER_ID, add_item, get_queue_url
from src.models.entities import build_vacancy

def push_generate_questions_event(user_id: str, vacancy_sk: str):
    message = {
        "type": "generate_questions",
        "user_id": user_id,
        "vacancy_sk": vacancy_sk
    }
    SQS.send_message(
        QueueUrl=get_queue_url(),
        MessageBody=json.dumps(message)
    )

def create_vacancy(table, payload):
    vacancy = build_vacancy(
        user_id=USER_ID,
        title=payload.get("title") or "",
        skills=payload.get("skills"),
        url=payload.get("url"),
    )
    add_item(table, vacancy)

    push_generate_questions_event(USER_ID, vacancy_sk=vacancy.SK)

    return {
        "message": "Item created",
        "item": {
            "vacancy_SK": vacancy.SK
        },
    }
