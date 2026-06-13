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
    common.py           Shared utilities (file groups, etc.)
    data.py             Portfolio data loader (cached, Pydantic-validated)
    templates.py        Code generators for the code pane
    chat.py             Chat reply logic
    search.py           File search logic
api/index.py            Vercel serverless entry point
```

## Features

- **Helix editor-inspired interface** — command bar, buffer tabs with caching (no re-fetch on tab switch), split code/preview, status line
- **8 virtual portfolio files** — Home, About, Projects, Contact, Resume, Career Timeline, Achievements, Dino Game
- **Command palette** (`Ctrl+P`) — search files, switch themes, view shortcuts
- **Chat assistant** — ask about skills, projects, experience, contact
- **8 color themes** (Helix, Catppuccin, Tokyo Night, Cyberpunk, Mono Dark, Mono Light, Gruvbox, Everforest) — persisted to localStorage
- **Playable Dino runner game** on canvas with high-score tracking
- **Full JSON API** for external use
- **Keyboard accessible** — visible focus indicators, `prefers-reduced-motion` support

## Fixes & Optimisations

### Layout & Scrolling
- Fixed `.helix-main` missing `min-height: 0` — content no longer overflows behind the top bar
- Fixed `.code-pane` missing `overflow: hidden` — code pane now scrolls properly
- Buffers are cached in the DOM; switching tabs no longer re-fetches content from the server

### Visual
- All `border-image` usage replaced with `border-color + box-shadow` gradients — rounded corners are no longer lost on hover/active states
- Added `:focus-visible` outlines across all interactive elements
- Added `prefers-reduced-motion` support
- Added SEO meta description and SVG favicon
- Removed all inline `onclick`/`oninput` handlers — events bound via JS
- Removed stale `/frontend/public/` comment from resume template

### Performance
- Dino game `updateThemeColors()` called once per frame (was 4× per frame)
- Dino game loop pre-bound in constructor (no new function allocation per frame)
- Dino game instance stopped and cleaned up when switching away from the tab
- Scripts load with `defer` — non-blocking
- Palette search shows user-friendly error messages on failure

### Code Quality (Backend)
- `load_portfolio()` returns Pydantic-validated model data (validation result no longer discarded)
- Shared `get_file_groups()` utility extracted — removes duplication between `pages.py` and `portfolio.py`
- Chat assistant uses name-based project lookup instead of fragile hard-coded indices
- Rate limiter cleans up stale IP entries every 5 minutes (prevents memory leak)
- Unused `_p` parameter removed from `template_dino()` and `template_resume()`
- `__import__("json")` replaced with proper `import json`

## Deploy (Vercel)

Push to GitHub and import in Vercel — `api/index.py` handles everything.
