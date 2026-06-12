import re

from services.data import load_portfolio


_HELLO_WORDS = frozenset(("hello", "hi", "hey"))
_SKILL_WORDS = frozenset(("skill", "skills", "technology", "technologies", "tech", "programming"))
_EXP_WORDS = frozenset(("experience", "work", "job", "teaching", "career", "intern", "internship"))
_PROJECT_WORDS = frozenset(("project", "projects", "build", "built", "app", "apps"))
_EDUCATION_WORDS = frozenset(("education", "study", "degree", "college", "university", "iit", "miet", "minor"))
_CONTACT_WORDS = frozenset(("contact", "email", "reach", "connect", "phone", "call"))
_LOCATION_WORDS = frozenset(("where", "location", "based", "live", "from"))
_ACHIEVEMENT_WORDS = frozenset(("achievement", "achievements", "hobby", "hobbies", "taekwondo", "sport", "medal", "leetcode", "extra"))
_HELP_WORDS = frozenset(("help", "options", "commands", "guide"))

_FAKE_NEWS_PHRASES = ("fake news", "false news", "misinformation", "detection")
_TRANSLATION_PHRASES = ("translation", "translator", "transliteration", "multilingual", "nllb", "whisper")


def _match_words(text: str, words: frozenset) -> bool:
    tokens = set(re.findall(r"\w+", text))
    return bool(tokens & words)


def _match_phrases(text: str, phrases: tuple[str, ...]) -> bool:
    for phrase in phrases:
        if phrase in text:
            return True
    return False


def get_reply(message: str) -> str:
    text = message.lower().strip()
    data = load_portfolio()
    p = data["personalInfo"]
    skills = data["skills"]
    experience = data["experience"]
    projects = data["projects"]
    education = data["education"]
    achievements = data["achievements"]

    fake_news = projects[0]
    translation = projects[1] if len(projects) >= 2 else projects[0]

    if _match_words(text, _HELLO_WORDS):
        return (
            f"Hello! I can tell you about {p['name']}, {p['role']}. "
            "Ask about skills, projects, experience, education, or contact."
        )

    if _match_words(text, _SKILL_WORDS):
        return (
            f"Programming: {', '.join(skills['programming'])}\n"
            f"AI/ML: {', '.join(skills['ai_ml'])}\n"
            f"Libraries: {', '.join(skills['libraries'])}\n"
            f"Web: {', '.join(skills['webDev'])}\n"
            f"Tools: {', '.join(skills['tools'])}\n"
            f"Databases: {', '.join(skills['databases'])}\n"
            f"Concepts: {', '.join(skills['core'])}"
        )

    if _match_words(text, _EXP_WORDS):
        blocks = []
        for exp in experience:
            blocks.append(
                f"{exp['title']} at {exp['company']} ({exp['period']})\n{exp['description']}"
            )
        return "\n\n".join(blocks)

    if not _match_words(text, frozenset(("website", "site"))) and _match_words(text, _PROJECT_WORDS):
        return "\n\n".join(
            f"{i + 1}. {pr['name']}\n   {pr['description']}\n   Tech: {', '.join(pr['techStack'])}"
            for i, pr in enumerate(projects)
        )

    if _match_phrases(text, _FAKE_NEWS_PHRASES) and "translation" not in text:
        pr = fake_news
        return f"{pr['name']}\n{pr['description']}\nTech: {', '.join(pr['techStack'])}"

    if _match_phrases(text, _TRANSLATION_PHRASES):
        pr = translation
        return f"{pr['name']}\n{pr['description']}\nTech: {', '.join(pr['techStack'])}"

    if _match_words(text, _EDUCATION_WORDS):
        return "\n\n".join(
            f"{e['degree']} — {e['institution']} ({e['year']})" for e in education
        )

    if _match_words(text, _CONTACT_WORDS):
        s = p["socials"]
        return (
            f"Email: {p['email']}\n"
            f"Phone: {p['phone']}\n"
            f"LinkedIn: {s['linkedin']}\n"
            f"GitHub: {s['github']}\n"
            f"Portfolio: {s['portfolio']}\n"
            f"Location: {p['location']}"
        )

    if _match_words(text, _LOCATION_WORDS):
        return f"{p['name']} is based in {p['location']}."

    if _match_words(text, _ACHIEVEMENT_WORDS):
        return "\n".join(f"• {a}" for a in achievements)

    if _match_words(text, _HELP_WORDS):
        return (
            'Try: "What are his skills?", "Tell me about fake news detection", '
            '"What is his guest faculty role?", "How can I contact him?"'
        )

    return (
        "I can help with skills, projects, experience, education, achievements, "
        "or contact info. What would you like to know?"
    )
