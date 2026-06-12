from fastapi import APIRouter, HTTPException

from services.content import get_buffer

router = APIRouter(prefix="/api/buffers", tags=["buffers"])


@router.get("/{name}")
def get_file_buffer(name: str):
    buffer = get_buffer(name)
    if buffer is None:
        raise HTTPException(status_code=404, detail="Buffer not found")
    return {
        "name": buffer["name"],
        "code": buffer["code"],
        "preview": buffer["preview"],
    }
