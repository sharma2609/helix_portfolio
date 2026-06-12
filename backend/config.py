from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "portfolio.json"
RESUME_PDF_PATH = BASE_DIR.parent / "frontend" / "public" / "PriyanshuSharma_Resume.pdf"
RESUME_PDF_URL = "/PriyanshuSharma_Resume.pdf"

FILE_ENTRIES = [
    {
        "name": "home.jsx",
        "group": "portfolio",
        "keywords": "welcome home introduction portfolio react overview",
    },
    {
        "name": "about.md",
        "group": "portfolio",
        "keywords": "about skills experience education python javascript react AI ML",
    },
    {
        "name": "projects.js",
        "group": "portfolio",
        "keywords": "projects fake news detection multilingual translation NLP machine learning",
    },
    {
        "name": "contact.html",
        "group": "portfolio",
        "keywords": "contact email linkedin github phone location get in touch",
    },
    {
        "name": "resume.pdf",
        "group": "portfolio",
        "keywords": "resume CV download PDF professional document",
    },
    {
        "name": "career_timeline.git",
        "group": "career",
        "keywords": "career timeline git history education IIT Ropar MIET guest faculty internship work experience",
    },
    {
        "name": "extracurriculars.git",
        "group": "career",
        "keywords": "achievements taekwondo black belt sports captain national gold medal leetcode",
    },
    {
        "name": "dino.js",
        "group": "playground",
        "keywords": "game dinosaur chrome dino canvas javascript fun",
    },
]


