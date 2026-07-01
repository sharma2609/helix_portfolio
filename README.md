# helix-portfolio

A personal portfolio site designed to look and feel like the [Helix](https://helix-editor.com/) terminal editor — split code/preview panes, buffer tabs, a command palette, and a status line. All content is driven by a single validated JSON file.

---

## Overview

This is a bare-bones, content-first portfolio template for developers who want to present their work inside an IDE-like interface instead of a traditional blog layout. The entire site is server-rendered with FastAPI and Jinja2 — no frontend framework, no build step, no client-side routing. Portfolio data lives in one `portfolio.json`, validated through Pydantic models, and the backend exposes both HTML views and a JSON API from the same source.

---

## Features

- **Helix-inspired UI** — Command bar, buffer tabs with active indicator, split-pane code/preview editor, mode indicator, status line with live clock
- **10 portfolio sections** — Home, About, Skills, Experience, Education, Certifications, Honors, Projects, Contact, Resume
- **Buffer tabs** — Each section opens as a closable tab; DOM is cached after first load to avoid refetches
- **Command palette** (`Ctrl+P`) — Fuzzy-search files by name or content, switch themes, view keyboard shortcuts
- **Chat assistant** — Keyword-based Q&A using the portfolio data (no LLM, no external API); rate-limited to 20 req/min per IP
- **8 color themes** — Helix, Catppuccin Mocha, Tokyo Night, Cyberpunk, Mono Dark, Mono Light, Gruvbox, Everforest — persisted to localStorage
- **Full-text search** — Scores files by name, keyword, and code-content overlap via a dedicated JSON endpoint
- **Dino runner game** — Canvas-based side-scroller with high-score tracking in localStorage
- **JSON API** — Health check, portfolio data, file listing, per-buffer code+preview
- **Responsive** — Side-by-side split on desktop (>768px), stacked vertically on mobile
- **Vercel-ready** — Ships with `vercel.json` and a serverless adapter at `api/index.py`

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Python 3.12+, FastAPI 0.115+, Jinja2 3.1+, Pydantic 2.9+ |
| Frontend | Server-rendered HTML, vanilla JavaScript, pure CSS |
| Theming | CSS custom properties via `[data-theme]` attribute; 8 themes |
| Content | Single `portfolio.json` validated through Pydantic models |
| Deploy | Vercel serverless (ASGI via `api/index.py`) |

---

## Installation

### Prerequisites

- Python 3.12 or later
- pip

### Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Linux/macOS
# .venv\Scripts\activate         # Windows
pip install -r requirements.txt
```

### Run the development server

```bash
uvicorn main:app --reload --port 8000
```

Or via the root-level npm script:

```bash
npm run dev
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

## Usage

### Navigation

- Click **Menu** or press `Ctrl+P` to open the command palette — search files by name, switch themes, view shortcuts
- Click section pills on the welcome page to open a buffer
- Use the **Assistant** toggle (`Ctrl+S`) to show/hide the bottom chat panel
- `Esc` closes the command palette

### API endpoints

The backend exposes a JSON API at `/api/`:

```bash
# Health check
curl http://localhost:8000/api/health
# → {"status": "ok"}

# Full portfolio data
curl http://localhost:8000/api/portfolio

# List all files and their groups
curl http://localhost:8000/api/files

# Search files by query
curl http://localhost:8000/api/search?q=python

# Get a specific buffer's code and preview metadata
curl http://localhost:8000/api/buffers/home.jsx

# Chat with the assistant
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "what skills does he have?"}'
```

### Configuration

| Variable | Default | Description |
|---|---|---|
| `CORS_ORIGINS` | `*` | Comma-separated list of allowed origins for the CORS middleware |

Portfolio content is edited in `backend/data/portfolio.json`. The file is validated against the Pydantic models in `backend/models.py` on every load and cached until the file's mtime changes.

### Resume PDF

Place your resume PDF at `backend/static/PriyanshuSharma_Resume.pdf` to enable the in-browser download button in the Resume buffer. The file is not included in the repository.

---

## Project structure

```
helix_portfolio/
├── api/
│   └── index.py              Vercel serverless adapter
├── backend/
│   ├── main.py               FastAPI app entry point, middleware, static mounts
│   ├── config.py             File entries, themes, nav sections, keybindings
│   ├── models.py             Pydantic models (PortfolioData, Experience, …)
│   ├── data/
│   │   └── portfolio.json    Single source of truth for all content
│   ├── routers/
│   │   ├── pages.py          HTML route handlers (index, welcome, buffers)
│   │   ├── portfolio.py      JSON API (health, portfolio, files)
│   │   ├── buffers.py        JSON API (per-buffer code + preview)
│   │   ├── chat.py           Chat endpoint with IP-based rate limiter
│   │   └── search.py         Full-text file search endpoint
│   ├── services/
│   │   ├── data.py           Cached portfolio loader with mtime invalidation
│   │   ├── templates.py      Code pane generators (markdown, JSX, git-log, …)
│   │   ├── content.py        Buffer assembly (code + preview metadata)
│   │   ├── chat.py           Keyword-based reply logic
│   │   ├── search.py         File scoring and token matching
│   │   └── common.py         File-to-group mapping
│   ├── templates/
│   │   ├── base.html         Editor shell (command bar, tabs, status line)
│   │   ├── welcome.html      Landing hero with quick-access pills
│   │   ├── buffers/          One template per virtual file (13 total)
│   │   └── components/       Shared partials (palette, menu, chat pane)
│   └── static/
│       ├── css/
│       │   ├── helix.css     Editor layout, components, responsive
│       │   ├── preview.css   Content cards, tags, timeline, contact
│       │   └── themes.css    8 theme definitions as CSS custom properties
│       └── js/
│           ├── editor.js     Tab management, palette, theme switching, keyboard
│           ├── chat.js       Chat UI with suggestion chips
│           └── dino.js       Canvas-based dino runner game
├── tests/
│   └── test_services.py      39 tests covering data, chat, search, templates
├── .editorconfig
├── .gitignore
├── vercel.json
├── requirements.txt
└── package.json
```

---

## Testing

```bash
# From the project root
python3 -m pytest tests/ -v
```

Requires `pytest` (included in `backend/requirements.txt` under the `# dev` comment). Tests cover portfolio data loading and validation, chat reply routing, file search scoring, template rendering, and the buffer/code assembly layer.

---

## Deploying to Vercel

1. Push the repository to GitHub
2. Import the project in Vercel
3. Vercel detects `vercel.json` automatically — no build step required
4. The serverless function at `api/index.py` serves the FastAPI app

Environment variables (`CORS_ORIGINS`) can be set in the Vercel dashboard if needed.

---

## License

This project is unlicensed — no license file is included. All rights reserved by the author.
