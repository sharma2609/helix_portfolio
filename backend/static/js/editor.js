const FILE_META = {
  "home.jsx": { label: "Home", ext: "jsx" },
  "about.md": { label: "About", ext: "md" },
  "projects.js": { label: "Projects", ext: "js" },
  "contact.html": { label: "Contact", ext: "html" },
  "resume.pdf": { label: "Resume", ext: "pdf" },
  "career_timeline.git": { label: "Career Timeline", ext: "git" },
  "extracurriculars.git": { label: "Achievements", ext: "git" },
  "dino.js": { label: "Dino Game", ext: "js" },
};

const HELIX_STATE = {
  openTabs: [],
  activeTab: null,
  bottomOpen: true,
  bottomTab: "chat",
  paletteOpen: false,
};

function initEditor() {
  loadTheme();
  initKeyboard();
  initBufferTabs();
  initCommandPalette();
  initAssistant();
  initWelcomeCards();
  updateStatusLine();
  setInterval(updateClock, 1000);
}

function loadTheme() {
  const saved = localStorage.getItem("helix-theme") || "helix";
  document.documentElement.setAttribute("data-theme", saved);
}

function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "p") {
      e.preventDefault();
      togglePalette();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      toggleAssistant();
    }
    if (e.key === "Escape") {
      if (HELIX_STATE.paletteOpen) closePalette();
    }
  });
}

/* ---- Buffer / Tab Management ---- */

function initBufferTabs() {
  document.querySelectorAll(".buffer-tab button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tab = e.currentTarget.closest(".buffer-tab");
      const name = tab.dataset.buffer;
      if (e.target.classList.contains("tab-close")) {
        closeTab(name);
      } else {
        switchTab(name);
      }
    });
  });
}

function openFile(name) {
  if (!HELIX_STATE.openTabs.includes(name)) {
    HELIX_STATE.openTabs.push(name);
  }
  HELIX_STATE.activeTab = name;
  renderTabs();
  loadBuffer(name);
  updateStatusLine();
}

function switchTab(name) {
  HELIX_STATE.activeTab = name;
  renderTabs();
  if (!document.getElementById("buffer-" + name.replace(/[.#]/g, "-"))) {
    loadBuffer(name);
  } else {
    showBuffer(name);
  }
  updateStatusLine();
}

function closeTab(name) {
  HELIX_STATE.openTabs = HELIX_STATE.openTabs.filter((t) => t !== name);
  if (HELIX_STATE.activeTab === name) {
    HELIX_STATE.activeTab = HELIX_STATE.openTabs.length
      ? HELIX_STATE.openTabs[HELIX_STATE.openTabs.length - 1]
      : null;
  }
  renderTabs();
  if (HELIX_STATE.activeTab) {
    showBuffer(HELIX_STATE.activeTab);
  } else {
    showWelcome();
  }
  updateStatusLine();
}

function renderTabs() {
  const container = document.getElementById("buffer-tabs-container");
  if (!container) return;
  if (HELIX_STATE.openTabs.length === 0) {
    container.innerHTML = "";
    return;
  }
  container.innerHTML = HELIX_STATE.openTabs
    .map(
      (name) => `
    <div class="buffer-tab ${HELIX_STATE.activeTab === name ? "active" : ""}" data-buffer="${name}">
      <button type="button">${FILE_META[name]?.label || name}</button>
      <button type="button" class="tab-close" aria-label="Close ${name}">×</button>
    </div>`
    )
    .join("");
  initBufferTabs();
}

function loadBuffer(name) {
  const area = document.getElementById("editor-area");
  area.innerHTML = `<div class="editor-area loading-buffer"><span class="spinner"></span><span>loading ${name}…</span></div>`;
  fetch("/buffer/" + encodeURIComponent(name))
    .then((r) => {
      if (!r.ok) throw new Error("Failed to load");
      return r.text();
    })
    .then((html) => {
      area.innerHTML = html;
      area.classList.add("split");
      initPreviewButtons();
      initDinoGame();
    })
    .catch(() => {
      area.innerHTML = `<div class="preview-pane empty">failed to load ${name}</div>`;
    });
}

function showBuffer(name) {
  document.querySelectorAll(".buffer-content").forEach((el) => el.classList.add("hidden"));
  const el = document.getElementById("buffer-" + name.replace(/[.#]/g, "-"));
  if (el) el.classList.remove("hidden");
}

function showWelcome() {
  const area = document.getElementById("editor-area");
  area.classList.remove("split");
  fetch("/welcome")
    .then((r) => r.text())
    .then((html) => {
      area.innerHTML = html;
      initWelcomeCards();
    });
}

function initWelcomeCards() {
  document.querySelectorAll(".welcome-card").forEach((btn) => {
    btn.addEventListener("click", () => openFile(btn.dataset.file));
  });
}

function initPreviewButtons() {
  document.querySelectorAll("[data-open-file]").forEach((btn) => {
    btn.addEventListener("click", () => openFile(btn.dataset.openFile));
  });
}

/* ---- Command Palette ---- */

function initCommandPalette() {
  document.getElementById("menu-btn")?.addEventListener("click", togglePalette);
  document.getElementById("palette-overlay")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closePalette();
  });
}

function togglePalette() {
  if (HELIX_STATE.paletteOpen) closePalette();
  else openPalette();
}

function openPalette() {
  HELIX_STATE.paletteOpen = true;
  document.getElementById("palette-overlay").classList.remove("hidden");
  const input = document.getElementById("palette-search");
  input.value = "";
  input.focus();
  showPaletteDefault();
}

function closePalette() {
  HELIX_STATE.paletteOpen = false;
  document.getElementById("palette-overlay").classList.add("hidden");
}

function showPaletteDefault() {
  const body = document.getElementById("palette-body");
  body.innerHTML = document.getElementById("palette-default-content").innerHTML;
  initPaletteButtons();
  initThemeChips();
}

function initPaletteButtons() {
  document.querySelectorAll("[data-palette-file]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openFile(btn.dataset.paletteFile);
      closePalette();
    });
  });
  document.querySelectorAll("[data-palette-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.paletteAction;
      if (action === "toggle-assistant") {
        toggleAssistant();
        closePalette();
      }
    });
  });
}

function initThemeChips() {
  document.querySelectorAll("[data-theme-select]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const theme = chip.dataset.themeSelect;
      setTheme(theme);
      document.querySelectorAll("[data-theme-select]").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });
}

/* Palette search */
let searchTimeout = null;
function onPaletteSearch(input) {
  clearTimeout(searchTimeout);
  const q = input.value.trim();
  if (!q) {
    showPaletteDefault();
    return;
  }
  searchTimeout = setTimeout(() => {
    fetch("/api/search?q=" + encodeURIComponent(q))
      .then((r) => r.json())
      .then((data) => {
        const results = data.results || [];
        const body = document.getElementById("palette-body");
        if (results.length === 0) {
          body.innerHTML =
            '<section class="command-menu-section"><p class="command-menu-empty">No matches for "' +
            q +
            '"</p></section>';
          return;
        }
        body.innerHTML =
          '<section class="command-menu-section"><h3 class="command-menu-heading">Results</h3><ul class="command-menu-grid">' +
          results
            .map(
              (r) =>
                `<li><button type="button" class="command-menu-item" data-palette-file="${r.name}"><span class="command-menu-item-label">${FILE_META[r.name]?.label || r.name}</span><span class="command-menu-item-file">${r.name}</span></button></li>`
            )
            .join("") +
          "</ul></section>";
        initPaletteButtons();
      })
      .catch(() => {});
  }, 150);
}

function setTheme(themeId) {
  document.documentElement.setAttribute("data-theme", themeId);
  localStorage.setItem("helix-theme", themeId);
  updateStatusLine();
}

/* ---- Assistant ---- */

function initAssistant() {
  document.getElementById("assistant-btn")?.addEventListener("click", toggleAssistant);
  document.getElementById("bottom-menu-btn")?.addEventListener("click", () => {
    HELIX_STATE.bottomTab = "menu";
    showBottomTab("menu");
  });
  document.getElementById("bottom-chat-btn")?.addEventListener("click", () => {
    HELIX_STATE.bottomTab = "chat";
    showBottomTab("chat");
  });
}

function toggleAssistant() {
  HELIX_STATE.bottomOpen = !HELIX_STATE.bottomOpen;
  HELIX_STATE.bottomTab = "chat";
  const panel = document.getElementById("bottom-panel");
  if (HELIX_STATE.bottomOpen) {
    panel.classList.remove("hidden");
    showBottomTab("chat");
  } else {
    panel.classList.add("hidden");
  }
  document.getElementById("assistant-btn").classList.toggle("active", HELIX_STATE.bottomOpen);
}

function showBottomTab(tab) {
  document.querySelectorAll(".bottom-tab-content").forEach((el) => el.classList.add("hidden"));
  document.getElementById("bottom-content-" + tab).classList.remove("hidden");
  document.querySelectorAll(".bottom-tabs button").forEach((btn) => btn.classList.remove("active"));
  document.getElementById("bottom-" + tab + "-btn").classList.add("active");
}

/* ---- Status Line ---- */

function updateStatusLine() {
  const el = document.getElementById("status-active-tab");
  if (el) el.textContent = HELIX_STATE.activeTab || "welcome";
  const themeEl = document.getElementById("status-theme");
  if (themeEl) {
    const themeId = document.documentElement.getAttribute("data-theme") || "helix";
    themeEl.textContent = themeId;
  }
}

function updateClock() {
  const el = document.getElementById("status-clock");
  if (el) {
    const now = new Date();
    el.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
}

/* ---- Dino Game Init ---- */

function initDinoGame() {
  const canvas = document.getElementById("dino-canvas");
  if (canvas && !canvas.dataset.initialized) {
    canvas.dataset.initialized = "1";
    const game = new DinoGame(canvas);
    canvas.__dinoGame = game;
    game.start();
  }
}

document.addEventListener("DOMContentLoaded", initEditor);
