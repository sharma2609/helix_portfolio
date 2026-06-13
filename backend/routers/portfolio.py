from fastapi import APIRouter

from config import FILE_ENTRIES
from services.common import get_file_groups
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
    groups = get_file_groups()
    return {"files": [e["name"] for e in FILE_ENTRIES], "groups": groups}
