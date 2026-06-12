# helix_portfolio

A personal portfolio website themed after the [Helix](https://helix-editor.com/) terminal text editor. Built with **FastAPI + Jinja2** on the backend, with minimal vanilla JavaScript for interactivity.

## Stack

- **Backend**: Python (FastAPI, Jinja2, Pydantic)
- **Frontend**: Server-rendered HTML + vanilla JS + CSS
- **Styling**: Pure CSS with 8 themes (Helix, Catppuccin, Tokyo Night, Cyberpunk, etc.)

## Quick start

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn main:app --reload --port 8000
```

Open http://127.0.0.1:8000

## Structure

```
backend/
  main.py               FastAPI app entry point
  config.py             File entries, themes, navigation config
  models.py             Pydantic data models
  data/portfolio.json   Single source of truth for all content
  templates/
    base.html           Editor shell layout
    welcome.html        Landing page
    buffers/            Preview templates (one per virtual file)
    components/         Shared UI partials
  static/
    css/                helix.css, preview.css, themes.css
    js/                 editor.js, chat.js, dino.js
  routers/
    pages.py            HTML page routes
    portfolio.py        JSON API (health, portfolio data, file list)
    buffers.py          JSON buffer data
    chat.py             Keyword-based chat assistant
    search.py           Portfolio file search
  services/
    data.py             Portfolio data loader (cached)
    templates.py        Code generators for the code pane
    chat.py             Chat reply logic
    search.py           File search logic
api/index.py            Vercel serverless entry point
```

## Features

- Helix editor-inspired interface (command bar, buffer tabs, split code/preview, status line)
- 8 virtual portfolio files: Home, About, Projects, Contact, Resume, Career Timeline, Achievements, Dino Game
- Command palette (`Ctrl+P`) — search files, switch themes, view shortcuts
- Chat assistant — ask about skills, projects, experience, contact
- 8 color themes (persisted to localStorage)
- Playable Dino runner game on canvas
- Full JSON API for external use

## Deploy (Vercel)

Push to GitHub and import in Vercel — `api/index.py` handles everything.
