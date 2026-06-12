import html
import json

from config import RESUME_PDF_URL


def _skill_lines(items: list[str]) -> str:
    return "\n".join(f"- {s}" for s in items)


def _exp_block(exp: dict) -> str:
    lines = [f"### {exp['title']} | {exp['company']}", f"* {exp['period']}", f"* {exp['description']}"]
    for h in exp.get("highlights", []):
        lines.append(f"* {h}")
    return "\n".join(lines)


def template_home(p: dict) -> str:
    return f"""import React from 'react';

const HomePage = () => {{
  return (
    <div>
      <h1>{p['name']}</h1>
      <h2>{p['role']}</h2>
      <p>AI/ML developer · Helix portfolio</p>
    </div>
  );
}};

export default HomePage;"""


def template_about(data: dict) -> str:
    p = data["personalInfo"]
    skills = data["skills"]
    exp_section = "\n\n".join(_exp_block(e) for e in data["experience"])
    return f"""# About Me

Hello! I'm {p['name']}, {p['role']}.

## Skills

### Programming
{_skill_lines(skills['programming'])}

### AI & ML
{_skill_lines(skills['ai_ml'])}

### ML Libraries & Frameworks
{_skill_lines(skills['libraries'])}

### Web Development
{_skill_lines(skills['webDev'])}

### Development Tools
{_skill_lines(skills['tools'])}

### Databases
{_skill_lines(skills['databases'])}

### Concepts
{_skill_lines(skills['core'])}

## Experience

{exp_section}

## Education

""" + "\n\n".join(
        f"- **{e['degree']}** — {e['institution']} ({e['year']})"
        for e in data["education"]
    ) + "\n\n## Achievements\n\n" + _skill_lines(data["achievements"])


def template_projects(data: dict) -> str:
    return (
        f"const projects = {json.dumps(data['projects'], indent=2)};\n\n"
        "export default projects;"
    )


def template_contact(p: dict) -> str:
    s = p["socials"]
    name_esc = html.escape(p["name"])
    role_esc = html.escape(p["role"])
    email_esc = html.escape(p["email"])
    li_esc = html.escape(s["linkedin"])
    gh_esc = html.escape(s["github"])
    po_esc = html.escape(s["portfolio"])
    return f"""<section class="contact">
  <h1>Get in Touch</h1>
  <p>{name_esc} — {role_esc}</p>
  <a href="mailto:{email_esc}">{email_esc}</a>
  <a href="{li_esc}">LinkedIn</a>
  <a href="{gh_esc}">GitHub</a>
  <a href="{po_esc}">Portfolio</a>
</section>"""


def template_resume(_p=None) -> str:
    return f"""function downloadResume() {{
  window.open('{RESUME_PDF_URL}', '_blank');
}}"""


def template_dino(_p=None) -> str:
    return """class DinoGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.score = 0;
  }
  start() {
    requestAnimationFrame(() => this.loop());
  }
}"""


def template_career_timeline(p: dict) -> str:
    return f"""commit guestfaculty2025 (HEAD -> main)
Author: {p['name']}
Date:   2025

    feat: Guest Faculty at FIT, Meerut (DSA & ML)

commit aiminor2024
Author: {p['name']}
Date:   2024-2026

    feat: Minor in AI at IIT Ropar

commit projects2024
Author: {p['name']}
Date:   2024

    docs: Fake News Detection & Multilingual NLP systems

commit frontend2022
Author: {p['name']}
Date:   2022

    feat: Front-end Intern at BR Softsol

commit python2021
Author: {p['name']}
Date:   2021-2022

    init: Python Internship at E&ICT Academy, IIT Kanpur

commit btech2024
Author: {p['name']}
Date:   2020-2024

    init: B.Tech (CSE) from MIET, Meerut"""


def template_extracurriculars(p: dict, data: dict) -> str:
    lines = []
    for a in data["achievements"]:
        slug = "".join(c for c in a[:12].lower() if c.isalnum()) or "ach"
        lines.append(
            f"""commit {slug}
Author: {p['name']}

    achievement: {a}"""
        )
    return "\n\n".join(lines)


TEMPLATES = {
    "home.jsx": template_home,
    "about.md": template_about,
    "projects.js": template_projects,
    "contact.html": template_contact,
    "resume.pdf": template_resume,
    "dino.js": template_dino,
    "career_timeline.git": template_career_timeline,
    "extracurriculars.git": template_extracurriculars,
}
