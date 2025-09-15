import json
from typing import Tuple
import requests
from bs4 import BeautifulSoup
from src.models.operationsPayloads import GenerateVacancyPayload
from src.ai.generate_vacancy import generate_vacancy
from urllib.parse import urlparse

MAX_TITLE_LEN = 400
MAX_DESC_LEN = 100


def is_url(string: str) -> bool:
    try:
        result = urlparse(string)
        return all([result.scheme, result.netloc])
    except:
        return False


def truncate(text: str, max_len: int) -> str:
    return text[:max_len].rstrip()


def extract_text_from_html(html: str) -> Tuple[str, str]:
    soup = BeautifulSoup(html, "html.parser")

    title_tags = soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"])
    title = " | ".join(
        tag.get_text(strip=True) for tag in title_tags if tag.get_text(strip=True)
    )

    # remove headers from soup to avoid duplication
    for tag in title_tags:
        tag.decompose()

    body_text = " ".join(soup.stripped_strings)

    return title.strip(), body_text.strip()


# { urlOrDescription }
def generate_vacancy_op(table, user_id, payload: GenerateVacancyPayload):
    input_value = payload.urlOrDescription

    if not input_value:
        raise Exception("urlOrDescription not found in body")
    title = None
    description = ""

    if is_url(input_value):
        try:
            html = requests.get(str(input_value), timeout=10).text
            title, description = extract_text_from_html(html)
            title = truncate(title, MAX_TITLE_LEN)
            description = truncate(description, MAX_DESC_LEN)
        except requests.RequestException as e:
            raise Exception(f"Failed to fetch URL: {e}")
    else:
        description = input_value

    vacancy_cut = generate_vacancy(description, title)
    if not vacancy_cut:
        raise Exception("Failed to build vacancy")
    if not vacancy_cut.is_vacancy_looks_real:
        raise Exception("Failed to make real life vacancy")

    return {"vacancy_cut": vacancy_cut.model_dump()}
