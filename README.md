# helix-portfolio

A personal portfolio website themed after the [Helix](https://helix-editor.com/) terminal text editor. Designed to feel like an actual IDE — split code/preview panes, buffer tabs, a command palette, and a status line.

Built with **FastAPI + Jinja2** on the backend and vanilla JS/CSS on the frontend. No frontend framework, no build step, no client-side routing.

## Stack

- **Backend**: Python 3.12+, FastAPI, Jinja2, Pydantic
- **Frontend**: Server-rendered HTML, vanilla JS, pure CSS
- **Theming**: 8 CSS custom-property themes persisted to localStorage
- **Content**: Single `portfolio.json` — one source of truth validated through Pydantic models
- **Deploy**: Vercel serverless via `api/index.py`

## Quick Start

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn main:app --reload --port 8000
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Project Structure

```
backend/
  main.py                  FastAPI app entry, static mounts, exception handlers
  config.py                FILE_ENTRIES, THEMES, NAV_SECTIONS, FILE_META
  models.py                Pydantic models (PortfolioData, Experience, Project, etc.)
  data/portfolio.json      Single source of truth for all content
  templates/
    base.html              Editor shell: command bar, tabs, status line
    welcome.html           Landing hero with quick-access section pills
    buffers/               One template per virtual file (home, about, skills, etc.)
    components/            Shared partials (command palette, chat pane, menu)
  static/
    css/
      helix.css            Editor layout, components, responsive
      preview.css           Content cards, tags, timeline, contact
      themes.css           8 theme definitions as CSS custom properties
    js/
      editor.js            Tab management, palette, theme switching
      chat.js              Chat assistant with suggestion chips
      dino.js              Canvas-based dino runner game
  routers/
    pages.py               HTML routes for index, welcome, buffer loading
    portfolio.py           JSON API (health, portfolio, file list, buffer data)
    chat.py                Keyword-based chat reply endpoint
    search.py              Portfolio file search endpoint
  services/
    data.py                Cached, validated portfolio data loader
    templates.py           Markdown/code generators for the code pane
    common.py              File grouping utility
    chat.py                Chat reply logic
    search.py              Full-text search logic
api/index.py               Vercel serverless adapter
```

## Architecture

### Content-Driven

All data lives in a single `portfolio.json` file validated through Pydantic models. The backend exposes both HTML views and a JSON API from the same data source — no duplication.

### Buffer System

Each portfolio section (Home, About, Skills, Experience, Education, Certifications, Honors, Projects, Contact, Resume) is a virtual "file" with:

- A **code pane** showing a syntax-highlighted source view (markdown, JSX, HTML, git log)
- A **preview pane** rendering the actual content as styled HTML

Loading a buffer fetches its template via `GET /buffer/{name}`. Once loaded, the DOM is cached — switching tabs does not re-fetch.

### Navigation

Three navigation surfaces work together:

1. **Welcome page** — hero section with quick-access pill buttons for every section
2. **Command palette** (`Ctrl+P`) — searchable file switcher, theme selector, keyboard shortcuts
3. **Embedded menu** — same palette content rendered in the bottom panel

### Theming

Eight themes defined entirely through CSS custom properties on `[data-theme]` attributes. Switching themes sets `data-theme` on `<html>`, which cascades through every component. The active theme is persisted to localStorage. On first visit, the site respects `prefers-color-scheme`.

### Responsive Design

- **Desktop (>768px)**: Side-by-side code/preview split using CSS Grid
- **Mobile (≤768px)**: Stacks vertically — code pane capped at 35vh, preview fills the rest; quick-access pills scroll horizontally

## Features

- **Helix-inspired UI**: Command bar, buffer tabs with active indicator, split pane editor, mode indicator, status line with clock
- **10 portfolio sections**: Home, About, Skills, Experience, Education, Certifications, Honors, Projects, Contact, Resume
- **Command palette**: Search files by name or content, switch themes, view keyboard shortcuts
- **Chat assistant**: Keyword-based Q&A about skills, projects, experience, and contact
- **8 color themes**: Helix, Catppuccin Mocha, Tokyo Night, Cyberpunk, Mono Dark, Mono Light, Gruvbox, Everforest
- **Dino runner game**: Canvas-based with score tracking persisted to localStorage
- **JSON API**: `GET /api/health`, `GET /api/portfolio`, `GET /api/files`, `GET /api/buffer/{name}`
- **Keyboard accessible**: Visible `:focus-visible` outlines, `prefers-reduced-motion` support, descriptive ARIA labels
- **Buffer aliasing**: `skills.md`, `experience.md`, `education.md` each render their own focused template while sharing a common data source

## Deploy

Push to GitHub and import in Vercel — `api/index.py` handles the FastAPI ASGI app as a serverless function. No build step required.
