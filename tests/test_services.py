import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from services.data import load_portfolio


def test_portfolio_loads():
    data = load_portfolio()
    assert "personalInfo" in data
    assert data["personalInfo"]["name"] == "Priyanshu Sharma"
    assert len(data["experience"]) > 0
    assert len(data["projects"]) > 0


def test_portfolio_structure():
    data = load_portfolio()
    p = data["personalInfo"]
    assert p["email"]
    assert p["socials"]["github"]
    assert data["summary"]
    assert data["skills"]["programming"]
    assert data["skills"]["ai_ml"]


def test_experience_fields():
    data = load_portfolio()
    for exp in data["experience"]:
        assert exp["title"]
        assert exp["company"]
        assert exp["period"]
        assert exp["description"]
        assert isinstance(exp["highlights"], list)


def test_project_fields():
    data = load_portfolio()
    for proj in data["projects"]:
        assert proj["name"]
        assert proj["description"]
        assert isinstance(proj["techStack"], list)
        assert isinstance(proj["features"], list)


def test_education_fields():
    data = load_portfolio()
    for edu in data["education"]:
        assert edu["degree"]
        assert edu["institution"]



from services.chat import get_reply


def test_chat_hello():
    reply = get_reply("hello")
    assert "Hello" in reply
    assert "skills" in reply or "projects" in reply


def test_chat_skills():
    reply = get_reply("what are his skills?")
    assert "Programming" in reply


def test_chat_experience():
    reply = get_reply("tell me about experience")
    assert reply


def test_chat_projects():
    reply = get_reply("what projects did he build?")
    assert "Fake News" in reply or "projects" in reply


def test_chat_education():
    reply = get_reply("education")
    assert "IIT" in reply or "MIET" in reply


def test_chat_contact():
    reply = get_reply("how to contact him?")
    assert "Email" in reply


def test_chat_unknown():
    reply = get_reply("asdfghjkl")
    assert "skills" in reply or "projects" in reply or "help" in reply or "contact" in reply


def test_chat_case_insensitive():
    reply_upper = get_reply("SKILLS")
    reply_lower = get_reply("skills")
    assert reply_upper == reply_lower


def test_chat_empty_message():
    reply = get_reply("")
    assert reply



from services.search import search_files


def test_search_empty():
    assert search_files("") == []


def test_search_name():
    results = search_files("home")
    assert any(r["name"] == "home.jsx" for r in results)


def test_search_keyword():
    results = search_files("python")
    assert len(results) > 0


def test_search_no_match():
    results = search_files("zzznotexist")
    assert results == []


def test_search_case_insensitive():
    upper = search_files("ABOUT")
    lower = search_files("about")
    assert upper == lower



from services.templates import TEMPLATES


def test_template_home():
    data = load_portfolio()
    fn = TEMPLATES["home.jsx"]
    result = fn(data["personalInfo"])
    assert data["personalInfo"]["name"] in result


def test_template_about():
    data = load_portfolio()
    fn = TEMPLATES["about.md"]
    result = fn(data)
    assert "About Me" in result


def test_template_projects():
    data = load_portfolio()
    fn = TEMPLATES["projects.js"]
    result = fn(data)
    assert "projects" in result


def test_template_contact():
    data = load_portfolio()
    fn = TEMPLATES["contact.html"]
    result = fn(data["personalInfo"])
    assert "Get in Touch" in result


def test_template_resume():
    fn = TEMPLATES["resume.pdf"]
    result = fn()
    assert "downloadResume" in result


def test_template_dino():
    fn = TEMPLATES["dino.js"]
    result = fn()
    assert "DinoGame" in result


def test_template_certifications():
    data = load_portfolio()
    fn = TEMPLATES["certifications.md"]
    result = fn(data)
    assert "NPTEL" in result or "No certifications listed" in result


def test_template_honors():
    data = load_portfolio()
    fn = TEMPLATES["honors.md"]
    result = fn(data)
    assert "Taekwondo" in result or "No honors listed" in result


def test_template_alias_exists():
    for alias in ("skills.md", "experience.md", "education.md"):
        assert alias in TEMPLATES
        assert TEMPLATES[alias] is TEMPLATES["about.md"]



from services.content import build_code, get_buffer, build_preview


def test_build_code_home():
    data = load_portfolio()
    code = build_code("home.jsx", data)
    assert code


def test_build_code_about():
    data = load_portfolio()
    code = build_code("about.md", data)
    assert "About Me" in code


def test_build_code_aliases():
    data = load_portfolio()
    for alias in ("skills.md", "experience.md", "education.md"):
        code = build_code(alias, data)
        assert code, f"build_code returned empty for {alias}"


def test_build_code_certifications():
    data = load_portfolio()
    code = build_code("certifications.md", data)
    assert code, "build_code returned empty for certifications.md"


def test_build_code_honors():
    data = load_portfolio()
    code = build_code("honors.md", data)
    assert code, "build_code returned empty for honors.md"


def test_get_buffer():
    buf = get_buffer("home.jsx")
    assert buf is not None
    assert buf["name"] == "home.jsx"
    assert "code" in buf
    assert "preview" in buf


def test_get_buffer_alias():
    for alias in ("skills.md", "experience.md", "education.md"):
        buf = get_buffer(alias)
        assert buf is not None, f"get_buffer returned None for {alias}"
        assert buf["code"]


def test_get_buffer_certifications():
    buf = get_buffer("certifications.md")
    assert buf is not None
    assert buf["code"]


def test_get_buffer_honors():
    buf = get_buffer("honors.md")
    assert buf is not None
    assert buf["code"]


def test_get_buffer_unknown():
    assert get_buffer("nonexistent.md") is None


def test_build_preview():
    assert build_preview("home.jsx", {})["type"] == "home"
    assert build_preview("about.md", {})["type"] == "about"
    assert build_preview("skills.md", {})["type"] == "about"
    assert build_preview("certifications.md", {})["type"] == "certifications"
    assert build_preview("honors.md", {})["type"] == "honors"
    assert build_preview("resume.pdf", {})["type"] == "resume"
    assert build_preview("unknown.x", {})["type"] == "raw"
