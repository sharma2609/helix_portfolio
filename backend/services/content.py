from config import RESUME_PDF_URL
from services.data import load_portfolio
from services.templates import TEMPLATES

_NO_ARG_FILES = frozenset({"resume.pdf", "dino.js"})


def build_code(name: str, data: dict) -> str:
    fn = TEMPLATES.get(name)
    if fn is None:
        return ""
    if name in _NO_ARG_FILES:
        return fn()
    p = data["personalInfo"]
    if name == "about.md":
        return fn(data)
    if name == "projects.js":
        return fn(data)
    if name == "extracurriculars.git":
        return fn(p, data)
    if name == "contact.html":
        return fn(p)
    return fn(p)


def build_preview(name: str, data: dict) -> dict:
    previews = {
        "home.jsx": {"type": "home"},
        "about.md": {"type": "about"},
        "projects.js": {"type": "projects"},
        "contact.html": {"type": "contact"},
        "resume.pdf": {"type": "resume", "pdfPath": RESUME_PDF_URL},
        "dino.js": {"type": "dino"},
        "career_timeline.git": {"type": "career_timeline"},
        "extracurriculars.git": {"type": "extracurriculars"},
    }
    return previews.get(name, {"type": "raw"})


def get_buffer(name: str) -> dict | None:
    data = load_portfolio()
    code = build_code(name, data)
    if not code and name != "home.jsx":
        return None
    return {
        "name": name,
        "code": code,
        "preview": build_preview(name, data),
        "portfolio": data,
    }
