import time
from collections import defaultdict

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from services.chat import get_reply

router = APIRouter(prefix="/api/chat", tags=["chat"])

_rate_limit: dict[str, list[float]] = defaultdict(list)
_RATE_MAX = 20
_RATE_WINDOW = 60
_LAST_CLEANUP: float = 0


def _check_rate_limit(client_ip: str | None) -> None:
    global _LAST_CLEANUP
    if client_ip is None:
        return
    now = time.time()

    # Periodic global cleanup of stale entries
    if now - _LAST_CLEANUP > 300:
        cutoff = now - _RATE_WINDOW
        for ip in list(_rate_limit.keys()):
            _rate_limit[ip] = [t for t in _rate_limit[ip] if t > cutoff]
            if not _rate_limit[ip]:
                del _rate_limit[ip]
        _LAST_CLEANUP = now

    window_start = now - _RATE_WINDOW
    timestamps = _rate_limit[client_ip]
    timestamps[:] = [t for t in timestamps if t > window_start]
    if len(timestamps) >= _RATE_MAX:
        raise HTTPException(status_code=429, detail="Rate limit exceeded (20 req/min)")
    timestamps.append(now)


class ChatRequest(BaseModel):
    message: str


@router.post("")
def chat(body: ChatRequest, request: Request):
    client_ip = request.client.host if request.client else None
    _check_rate_limit(client_ip)
    return {"reply": get_reply(body.message)}
