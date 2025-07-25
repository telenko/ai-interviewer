import boto3
from pydantic import BaseModel
from typing import Optional, Union

cloudwatch = boto3.client("cloudwatch")


class MetricEntry(BaseModel):
    MetricName: str
    Value: Union[int, float]
    Unit: str
    Dimensions: Optional[list[dict[str, str]]] = []


def dict_to_metrics_list(metrics_dict: dict[str, dict]) -> list[MetricEntry]:
    metrics_list: list[MetricEntry] = []
    for name, value in metrics_dict.items():
        metrics_list.append(
            MetricEntry(
                MetricName=name,
                Dimensions=value.get("dimensions", []),
                Value=value["value"],
                Unit="Count" if "Retention" in name else "Seconds",
            )
        )
    return metrics_list


def send_metrics_dict_batch(metrics_dict: dict[str, dict]):
    metrics_list = dict_to_metrics_list(metrics_dict)
    send_metrics_batch(metrics_list)


def send_metrics_batch(metrics: list[MetricEntry]):
    if metrics:
        cloudwatch.put_metric_data(
            Namespace="ApplyMatch", MetricData=[m.model_dump() for m in metrics]
        )
