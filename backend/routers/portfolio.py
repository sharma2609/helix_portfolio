from fastapi import APIRouter

from config import FILE_ENTRIES
from services.data import load_portfolio

router = APIRouter(prefix="/api", tags=["portfolio"])


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/portfolio")
def get_portfolio():
    return load_portfolio()


@router.get("/files")
def list_files():
    groups: dict[str, list[str]] = {
        "portfolio": [],
        "career": [],
        "playground": [],
    }
    for entry in FILE_ENTRIES:
        group = entry.get("group", "portfolio")
        if group in groups:
            groups[group].append(entry["name"])
    return {"files": [e["name"] for e in FILE_ENTRIES], "groups": groups}
