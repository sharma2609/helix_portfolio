import json
import threading
from functools import lru_cache
from pathlib import Path

from config import DATA_PATH
from models import PortfolioData


_last_mtime: float | None = None
_lock = threading.Lock()


def load_portfolio() -> dict:
    global _last_mtime
    current_mtime = DATA_PATH.stat().st_mtime
    with _lock:
        if _last_mtime is None or current_mtime > _last_mtime:
            _load_portfolio.cache_clear()
            _last_mtime = current_mtime
    return _load_portfolio()


@lru_cache(maxsize=1)
def _load_portfolio() -> dict:
    with open(DATA_PATH, encoding="utf-8") as f:
        raw = json.load(f)
    PortfolioData.model_validate(raw)
    return raw
