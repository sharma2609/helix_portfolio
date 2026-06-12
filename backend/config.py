from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "portfolio.json"
RESUME_PDF_PATH = BASE_DIR / "static" / "PriyanshuSharma_Resume.pdf"
RESUME_PDF_URL = "/static/PriyanshuSharma_Resume.pdf"

FILE_ENTRIES = [
    {"name": "home.jsx", "group": "portfolio", "keywords": "welcome home introduction portfolio react overview"},
    {"name": "about.md", "group": "portfolio", "keywords": "about skills experience education python javascript react AI ML"},
    {"name": "projects.js", "group": "portfolio", "keywords": "projects fake news detection multilingual translation NLP machine learning"},
    {"name": "contact.html", "group": "portfolio", "keywords": "contact email linkedin github phone location get in touch"},
    {"name": "resume.pdf", "group": "portfolio", "keywords": "resume CV download PDF professional document"},
    {"name": "career_timeline.git", "group": "career", "keywords": "career timeline git history education IIT Ropar MIET guest faculty internship work experience"},
    {"name": "extracurriculars.git", "group": "career", "keywords": "achievements taekwondo black belt sports captain national gold medal leetcode"},
    {"name": "dino.js", "group": "playground", "keywords": "game dinosaur chrome dino canvas javascript fun"},
]

THEMES = [
    {"id": "helix", "label": "Helix Colibri", "desc": "Purple editor theme"},
    {"id": "catppuccin-mocha", "label": "Catppuccin Mocha", "desc": "Warm mauve tones"},
    {"id": "tokyo-night", "label": "Tokyo Night", "desc": "Deep blue nightscape"},
    {"id": "cyberpunk", "label": "Cyberpunk", "desc": "Neon glow overload"},
    {"id": "mono-dark", "label": "Mono Dark", "desc": "Minimal greyscale"},
    {"id": "mono-light", "label": "Mono Light", "desc": "Clean greyscale"},
    {"id": "gruvbox", "label": "Gruvbox", "desc": "Earthy retro tones"},
    {"id": "everforest", "label": "Everforest", "desc": "Forest green calm"},
]

NAV_SECTIONS = [
    {"id": "portfolio", "label": "Portfolio", "description": "Profile, work & contact"},
    {"id": "career", "label": "Career", "description": "Timeline & achievements"},
    {"id": "playground", "label": "Playground", "description": "Extras & experiments"},
]

FILE_META = {
    "home.jsx": {"label": "Home", "ext": "jsx"},
    "about.md": {"label": "About", "ext": "md"},
    "projects.js": {"label": "Projects", "ext": "js"},
    "contact.html": {"label": "Contact", "ext": "html"},
    "resume.pdf": {"label": "Resume", "ext": "pdf"},
    "career_timeline.git": {"label": "Career Timeline", "ext": "git"},
    "extracurriculars.git": {"label": "Achievements", "ext": "git"},
    "dino.js": {"label": "Dino Game", "ext": "js"},
}

KEYBINDINGS = [
    {"keys": "Ctrl+P", "label": "Command menu", "id": "menu"},
    {"keys": "Ctrl+S", "label": "Toggle assistant", "id": "assistant"},
    {"keys": "Esc", "label": "Close menu", "id": "close"},
]
