import json
from decimal import Decimal
import os

import boto3


def convert_to_dynamo(item_model):
    return json.loads(json.dumps(item_model.to_dynamo()), parse_float=Decimal)


def add_item(table, item_model):
    table.put_item(Item=convert_to_dynamo(item_model))


def update_entity(table, pk_value, sk_value, update_attrs: dict):
    update_expr = "SET "
    expr_attr_values = {}
    expr_attr_names = {}

    update_clauses = []
    for i, (key, value) in enumerate(update_attrs.items()):
        attr_name_placeholder = f"#attr{i}"
        attr_value_placeholder = f":val{i}"
        expr_attr_names[attr_name_placeholder] = key

        # Якщо value — float, перетворюємо на Decimal
        if isinstance(value, float):
            value = Decimal(str(value))
        expr_attr_values[attr_value_placeholder] = value

        update_clauses.append(f"{attr_name_placeholder} = {attr_value_placeholder}")

    update_expr += ", ".join(update_clauses)

    response = table.update_item(
        Key={"PK": pk_value, "SK": sk_value},
        UpdateExpression=update_expr,
        ExpressionAttributeNames=expr_attr_names,
        ExpressionAttributeValues=expr_attr_values,
        ReturnValues="ALL_NEW",
    )
    return response.get("Attributes")


table_name = os.environ["TABLE_NAME"]
dynamodb = boto3.resource("dynamodb")

TABLE = dynamodb.Table(table_name)
