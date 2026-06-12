from config import FILE_ENTRIES
from services.content import build_code
from services.data import load_portfolio


def _tokenize(text: str) -> set[str]:
    return {t for t in text.lower().split() if len(t) > 1}


def search_files(query: str) -> list[dict]:
    q = query.lower().strip()
    if not q:
        return []

    data = load_portfolio()
    query_tokens = _tokenize(q)

    scored = []

    for entry in FILE_ENTRIES:
        name = entry["name"]
        keywords = entry.get("keywords", "")
        code = build_code(name, data)
        haystack = f"{name} {keywords} {code}".lower()
        haystack_tokens = _tokenize(haystack)

        score = 0
        if q in name.lower():
            score += 10
        if q in keywords.lower():
            score += 5
        if q in haystack:
            score += 1

        overlap = query_tokens & haystack_tokens
        score += len(overlap) * 3

        if score > 0:
            scored.append((score, {"name": name, "group": entry["group"]}))

    scored.sort(key=lambda x: -x[0])
    return [item for _, item in scored]
