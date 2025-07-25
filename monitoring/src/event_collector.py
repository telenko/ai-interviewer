from collections import defaultdict
import json
import os
import boto3
import time

from utils import MetricEntry, send_metrics_batch
from model import Session, UserActivity

TABLE_NAME = os.environ["TABLE_NAME"]
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)  # type: ignore[attr-defined]
cloudwatch = boto3.client("cloudwatch")


def lambda_handler(event, context):
    body = json.loads(event.get("body", "{}"))
    user_id = body.get("user_id")
    rawEvents = body.get("events")

    events = (
        rawEvents if isinstance(rawEvents, list) else [rawEvents]
    )  # Підтримка batch або одиночних подій

    if not user_id or not events:
        return {"statusCode": 400, "body": "Missing userId or events"}

    clicks_counter: dict[str, int] = defaultdict(int)

    for ev in events:
        event_type = ev.get("eventType")
        timestamp = int(time.time())

        if event_type == "session_start":
            update_session(user_id, start_ts=timestamp, sessionId=ev.get("sessionId"))

        elif event_type == "session_end":
            update_session(user_id, end_ts=timestamp, sessionId=ev.get("sessionId"))

        elif event_type == "click":
            element = ev.get("element", "unknown")
            clicks_counter[element] += 1  # рахуємо кліки для кожного елемента

    # Перетворюємо словник у список MetricEntry
    clicks_metrics: list[MetricEntry] = [
        MetricEntry(
            MetricName="Click",
            Dimensions=[{"Name": "Element", "Value": element}],
            Unit="Count",
            Value=count,
        )
        for element, count in clicks_counter.items()
    ]

    # Відправляємо всі click метрики одним batch викликом
    if clicks_metrics:
        send_metrics_batch(clicks_metrics)

    return {"statusCode": 200, "body": json.dumps({"status": "ok"})}


def update_session(user_id, sessionId, start_ts=None, end_ts=None):
    # Читаємо існуючого юзера
    userRaw = table.get_item(Key={"USER_ID": user_id}).get(
        "Item", UserActivity(USER_ID=user_id).to_dynamo()
    )
    user = UserActivity(**userRaw)
    sessions = user.sessions or []

    if start_ts:
        if not any(s.sessionId == sessionId for s in sessions):
            sessions.append(Session(sessionId=sessionId, start=start_ts, end=None))
            sessions = sessions[-10:]

    if end_ts:
        for s in sessions:
            if s.sessionId == sessionId:
                s.end = end_ts
                break

    table.update_item(
        Key={"USER_ID": user_id},
        UpdateExpression="SET lastSeen = :lastSeen, sessions = :sessions",
        ExpressionAttributeValues={
            ":lastSeen": int(time.time()),
            ":sessions": [s.model_dump() for s in sessions],
        },
    )
