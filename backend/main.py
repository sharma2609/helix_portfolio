import logging
import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from routers import buffers, chat, pages, portfolio, search

logger = logging.getLogger("helix")
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

app = FastAPI(title="Helix Portfolio", version="0.2.0")

origins = os.getenv("CORS_ORIGINS", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins.split(",") if o.strip()],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

pages._init_templates(templates)

app.include_router(portfolio.router)
app.include_router(buffers.router)
app.include_router(chat.router)
app.include_router(search.router)
app.include_router(pages.router)

static_dir = BASE_DIR / "static"
if static_dir.is_dir():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
