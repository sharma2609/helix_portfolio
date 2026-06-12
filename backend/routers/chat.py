import time
from collections import defaultdict

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from services.chat import get_reply

router = APIRouter(prefix="/api/chat", tags=["chat"])

_rate_limit: dict[str, list[float]] = defaultdict(list)
_RATE_MAX = 20
_RATE_WINDOW = 60


def _check_rate_limit(client_ip: str | None) -> None:
    if client_ip is None:
        return
    now = time.time()
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
