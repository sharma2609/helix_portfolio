from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from config import (
    FILE_ENTRIES,
    FILE_META,
    KEYBINDINGS,
    NAV_SECTIONS,
    RESUME_PDF_URL,
    THEMES,
)
from services.data import load_portfolio
from services.templates import (
    template_about,
    template_career_timeline,
    template_contact,
    template_dino,
    template_extracurriculars,
    template_home,
    template_projects,
    template_resume,
)

router = APIRouter(tags=["pages"])

templates = None


def _init_templates(templates_instance: Jinja2Templates):
    global templates
    templates = templates_instance


def _achievement_meta(text: str) -> dict:
    if "Black Belt" in text:
        return {"type": "achievement", "date": "2016"}
    if "Fujairah" in text:
        return {"type": "feat", "date": "2019"}
    if "National Medalist" in text:
        return {"type": "achievement", "date": "2015, 2017, 2018"}
    if "Vice Sports" in text:
        return {"type": "feat", "date": "2017 – 2018"}
    if "LeetCode" in text:
        return {"type": "feat", "date": "ongoing"}
    return {"type": "feat", "date": ""}


def _get_groups():
    groups: dict[str, list[str]] = {"portfolio": [], "career": [], "playground": []}
    for entry in FILE_ENTRIES:
        group = entry.get("group", "portfolio")
        if group in groups:
            groups[group].append(entry["name"])
    return groups


def _nav_sections_with_files():
    groups = _get_groups()
    result = []
    for section in NAV_SECTIONS:
        files = groups.get(section["id"], [])
        if files:
            result.append({**section, "files": files})
    return result


def _base_context(data: dict) -> dict:
    p = data["personalInfo"]
    groups = _get_groups()
    return {
        "p": p,
        "portfolio_json": __import__("json").dumps(data),
        "file_groups_json": __import__("json").dumps(groups),
        "location_short": (p.get("location", "") or "").split(",")[0],
        "nav_sections": _nav_sections_with_files(),
        "file_meta": FILE_META,
        "themes": THEMES,
        "default_theme": "helix",
        "keybindings": KEYBINDINGS,
        "experience": data["experience"],
        "projects": data["projects"],
        "education": data["education"],
        "skills": data["skills"],
        "achievements": data["achievements"],
        "resume_pdf_url": RESUME_PDF_URL,
    }


@router.get("/", response_class=HTMLResponse)
def index(request: Request):
    data = load_portfolio()
    ctx = _base_context(data)
    return templates.TemplateResponse(request, "base.html", ctx)


@router.get("/welcome", response_class=HTMLResponse)
def welcome(request: Request):
    data = load_portfolio()
    p = data["personalInfo"]
    ctx = {"p": p}
    return templates.TemplateResponse(request, "welcome.html", ctx)


@router.get("/buffer/{name}", response_class=HTMLResponse)
def get_buffer(request: Request, name: str):
    data = load_portfolio()
    p = data["personalInfo"]
    experience = data["experience"]
    projects = data["projects"]
    education = data["education"]
    skills = data["skills"]
    achievements = data["achievements"]

    ctx = {"p": p, "name": name}

    if name == "home.jsx":
        ctx["home_code"] = template_home(p)
    elif name == "about.md":
        ctx["about_code"] = template_about(data)
        tag_groups = [
            {"label": "Programming", "items": skills["programming"]},
            {"label": "AI & ML", "items": skills["ai_ml"]},
            {"label": "ML Libraries", "items": skills["libraries"]},
            {"label": "Web", "items": skills["webDev"]},
            {"label": "Tools", "items": skills["tools"]},
            {"label": "Databases", "items": skills["databases"]},
            {"label": "Concepts", "items": skills["core"]},
        ]
        ctx["tag_groups"] = tag_groups
        ctx["experience"] = experience
    elif name == "projects.js":
        ctx["projects_code"] = template_projects(data)
        ctx["projects"] = projects
    elif name == "contact.html":
        ctx["contact_code"] = template_contact(p)
    elif name == "resume.pdf":
        ctx["resume_code"] = template_resume(None)
        ctx["experience"] = experience
        ctx["projects"] = projects
        ctx["education"] = education
    elif name == "career_timeline.git":
        ctx["career_code"] = template_career_timeline(p)
        career_items = []
        for exp in experience:
            career_items.append(
                {"type": "feat", "text": f"{exp['title']} at {exp['company']}", "date": exp["period"]}
            )
        career_items.append(
            {"type": "docs", "text": "Fake News Detection & Multilingual NLP systems", "date": "2024"}
        )
        for edu in education:
            career_items.append(
                {"type": "init", "text": f"{edu['degree']} — {edu['institution']}", "date": edu["year"]}
            )
        ctx["career_items"] = career_items
    elif name == "extracurriculars.git":
        ctx["achievements_code"] = template_extracurriculars(p, data)
        achievement_items = []
        for a in achievements:
            meta = _achievement_meta(a)
            achievement_items.append({"type": meta["type"], "text": a, "date": meta["date"]})
        ctx["achievement_items"] = achievement_items
    elif name == "dino.js":
        ctx["dino_code"] = template_dino(None)
    else:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Buffer not found")

    template_name = _buffer_template_name(name)
    return templates.TemplateResponse(request, template_name, ctx)


def _buffer_template_name(name: str) -> str:
    mapping = {
        "home.jsx": "buffers/home.html",
        "about.md": "buffers/about.html",
        "projects.js": "buffers/projects.html",
        "contact.html": "buffers/contact.html",
        "resume.pdf": "buffers/resume.html",
        "career_timeline.git": "buffers/career.html",
        "extracurriculars.git": "buffers/achievements.html",
        "dino.js": "buffers/dino.html",
    }
    return mapping.get(name, "buffers/home.html")
