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

    data_templates = {"about.md", "skills.md", "experience.md", "education.md", "certifications.md", "honors.md", "projects.js"}
    two_arg_templates = {"extracurriculars.git"}
    p_only_templates = {"home.jsx", "contact.html", "career_timeline.git"}

    if name in data_templates:
        return fn(data)
    if name in two_arg_templates:
        return fn(p, data)
    if name in p_only_templates:
        return fn(p)
    return fn(p)


def build_preview(name: str, data: dict) -> dict:
    previews = {
        "home.jsx": {"type": "home"},
        "about.md": {"type": "about"},
        "skills.md": {"type": "about"},
        "experience.md": {"type": "about"},
        "education.md": {"type": "about"},
        "projects.js": {"type": "projects"},
        "certifications.md": {"type": "certifications"},
        "honors.md": {"type": "honors"},
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
