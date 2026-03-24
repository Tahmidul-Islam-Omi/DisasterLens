from __future__ import annotations

import re
from urllib.parse import urljoin

from bs4 import BeautifulSoup

DISASTER_KEYWORDS = {
    "flood",
    "flooding",
    "flash flood",
    "cyclone",
    "landslide",
    "storm",
    "heavy rain",
    "river erosion",
    "drought",
    "earthquake",
    "ঘূর্ণিঝড়",
    "বন্যা",
    "পাহাড়ধস",
    "জলোচ্ছ্বাস",
    "ভারী বৃষ্টি",
    "দুর্যোগ",
    "দুর্ঘটনা",
}


def normalize_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def extract_environment_links(listing_html: str, listing_url: str) -> list[str]:
    """Extract and normalize Prothom Alo environment links from a listing page."""
    soup = BeautifulSoup(listing_html, "html.parser")
    links: list[str] = []
    for anchor in soup.find_all("a", href=True):
        href = anchor["href"].strip()
        absolute_url = urljoin(listing_url, href)
        if "prothomalo.com" not in absolute_url:
            continue
        if "/environment" not in absolute_url:
            continue
        links.append(absolute_url)

    # Preserve order while deduplicating.
    seen: set[str] = set()
    unique_links: list[str] = []
    for link in links:
        if link in seen:
            continue
        seen.add(link)
        unique_links.append(link)
    return unique_links


def clean_prothom_alo_article(html: str, article_url: str) -> dict[str, str | None]:
    """Clean and structure Prothom Alo article HTML into extraction-friendly fields."""
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(["script", "style", "noscript", "svg", "nav", "footer", "header", "aside", "form"]):
        tag.decompose()

    title = ""
    h1 = soup.find("h1")
    if h1:
        title = normalize_whitespace(h1.get_text(" ", strip=True))
    if not title and soup.title:
        title = normalize_whitespace(soup.title.get_text(" ", strip=True))

    published = None
    time_tag = soup.find("time")
    if time_tag and time_tag.get("datetime"):
        published = normalize_whitespace(time_tag["datetime"])

    if not published:
        meta_time = soup.find("meta", attrs={"property": "article:published_time"})
        if meta_time and meta_time.get("content"):
            published = normalize_whitespace(meta_time["content"])

    article = soup.find("article")
    paragraph_nodes = article.find_all("p") if article else soup.find_all("p")
    paragraphs = [normalize_whitespace(node.get_text(" ", strip=True)) for node in paragraph_nodes]
    paragraphs = [p for p in paragraphs if len(p) > 20]

    clean_text = normalize_whitespace("\n".join(paragraphs))

    return {
        "url": article_url,
        "title": title,
        "published_at": published,
        "clean_text": clean_text,
    }


def infer_language(text: str) -> str:
    if re.search(r"[\u0980-\u09FF]", text):
        return "bn"
    return "en"


def is_disaster_related(title: str, text: str, threshold: int = 1) -> bool:
    corpus = f"{title} {text}".lower()
    score = sum(1 for keyword in DISASTER_KEYWORDS if keyword in corpus)
    return score >= threshold
