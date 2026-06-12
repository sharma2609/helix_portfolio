from fastapi import APIRouter, Query

from services.search import search_files

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("")
def search(q: str = Query("", min_length=0)):
    return {"results": search_files(q)}
