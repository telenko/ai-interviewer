import json
from typing import Tuple
import requests
from bs4 import BeautifulSoup
from src.ai.generate_vacancy import generate_vacancy
from src.db.utils import USER_ID

MAX_TITLE_LEN = 400
MAX_DESC_LEN = 100

def truncate(text: str, max_len: int) -> str:
    return text[:max_len].rstrip()

def extract_text_from_html(html: str) -> Tuple[str, str]:
    soup = BeautifulSoup(html, 'html.parser')

    title_tags = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
    title = ' | '.join(tag.get_text(strip=True) for tag in title_tags if tag.get_text(strip=True))

    # remove headers from soup to avoid duplication
    for tag in title_tags:
        tag.decompose()

    body_text = ' '.join(soup.stripped_strings)

    return title.strip(), body_text.strip()

# { url }
def generate_vacancy_op(table, payload):
    url = payload.get('url')
    if not url:
        raise Exception('url not found in body')
    html = requests.get(url, timeout=10).text
    title, description = extract_text_from_html(html)
    title = truncate(title, MAX_TITLE_LEN)
    description = truncate(description, MAX_DESC_LEN)
    vacancyCut = generate_vacancy(title, description)
    if not vacancyCut:
        raise Exception("Failed to buiold vacancy")
    if not vacancyCut.is_vacancy_looks_real:
        raise Exception("Failed to make real life vacancy")
    return {"vacancy_cut": vacancyCut.model_dump()}
