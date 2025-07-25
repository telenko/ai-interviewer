import os
import boto3
from datetime import datetime, timedelta

from utils import send_metrics_dict_batch
from model import UserActivity

TABLE_NAME = os.environ["TABLE_NAME"]
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)  # type: ignore[attr-defined]
cloudwatch = boto3.client("cloudwatch")


def lambda_handler(event, context):
    users = scan_all_users()
    metricsDict = calculate_metrics(users)
    send_metrics_dict_batch(metricsDict)


def scan_all_users() -> list[UserActivity]:
    items = []
    response = table.scan()
    items.extend(response.get("Items", []))
    while "LastEvaluatedKey" in response:
        response = table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
        items.extend(response.get("Items", []))
    users = [UserActivity(**item) for item in items]
    return users


def calculate_metrics(users):
    range_max = 7
    metrics = {f"Retention_D{day}": {"value": 0.0} for day in range(1, range_max + 1)}
    metrics["Engagement_AvgSession"] = {"value": 0.0}
    total_sessions = 0
    total_duration = 0

    for user in users:
        sessions = user.sessions or []
        first_seen = user.firstSeen

        for day in range(1, range_max + 1):
            start_window = first_seen + day * 86400  # +N днів у секундах
            end_window = start_window + 86399  # кінець дня

            if any(start_window <= s.start <= end_window for s in sessions):
                metrics[f"Retention_D{day}"]["value"] += 1

        yesterday = datetime.now() - timedelta(days=1)
        engagement_start = int(
            yesterday.replace(hour=0, minute=0, second=0).timestamp()
        )
        engagement_end = int(
            yesterday.replace(hour=23, minute=59, second=59).timestamp()
        )
        for s in sessions:
            if s.start and engagement_start <= s.start <= engagement_end:
                total_sessions += 1
                if s.end:
                    total_duration += s.end - s.start

    engagement = total_duration / total_sessions if total_sessions else 0

    # Формуємо фінальний словник метрик
    metrics["Engagement_AvgSession"]["value"] = engagement

    return metrics
