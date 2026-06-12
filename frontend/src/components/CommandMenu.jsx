import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api/client";
import {
  allFilesFromGroups,
  FILE_META,
  getGroupFiles,
  KEYBINDINGS,
  NAV_SECTIONS,
} from "../constants/navigation";
import { usePortfolio } from "../contexts/PortfolioContext";
import { useTheme } from "../contexts/ThemeContext";

const CommandMenu = ({ variant = "modal", onClose, showSearch = true }) => {
  const {
    fileGroups,
    openFile,
    setBottomOpen,
    setBottomTab,
    setPaletteOpen,
  } = usePortfolio();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const abortRef = useRef(null);

  const allFiles = useMemo(() => allFilesFromGroups(fileGroups), [fileGroups]);
  const q = query.trim().toLowerCase();

  useEffect(() => {
    if (!q) {
      setSearchResults([]);
      return;
    }
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const t = setTimeout(() => {
      api
        .search(query, controller.signal)
        .then((r) => {
          if (!controller.signal.aborted) {
            setSearchResults(r.results || []);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setSearchResults([]);
          }
        });
    }, 150);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  const filteredFiles = useMemo(() => {
    if (!q) return [];
    const fromSearch = searchResults.map((r) => r.name);
    const local = allFiles.filter(
      (name) =>
        name.toLowerCase().includes(q) ||
        (FILE_META[name]?.label || "").toLowerCase().includes(q)
    );
    return [...new Set([...fromSearch, ...local])];
  }, [q, allFiles, searchResults]);

  const close = () => {
    onClose?.();
    setPaletteOpen(false);
  };

  const pickFile = (name) => {
    openFile(name);
    close();
  };

  const runBinding = (id) => {
    if (id === "menu") return;
    if (id === "assistant") {
      setBottomOpen((v) => !v);
      setBottomTab("chat");
    }
    if (id === "close") close();
  };

  const { theme, setTheme, themes } = useTheme();
  const isEmbedded = variant === "embedded";

  return (
    <div className={`command-menu ${isEmbedded ? "embedded" : "modal"}`}>
      {showSearch && (
        <div className="command-menu-search">
          <input
            autoFocus={!isEmbedded}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to file or search portfolio…"
            className="command-menu-input"
            aria-label="Command menu search"
          />
          {!isEmbedded && (
            <button type="button" className="command-menu-close" onClick={close} aria-label="Close">
              Esc
            </button>
          )}
        </div>
      )}

      <div className="command-menu-body">
        {q ? (
          <section className="command-menu-section">
            <h3 className="command-menu-heading">Results</h3>
            {filteredFiles.length === 0 ? (
              <p className="command-menu-empty">No matches for &ldquo;{query}&rdquo;</p>
            ) : (
              <ul className="command-menu-grid">
                {filteredFiles.map((name) => (
                  <li key={name}>
                    <button type="button" className="command-menu-item" onClick={() => pickFile(name)}>
                      <span className="command-menu-item-label">{FILE_META[name]?.label || name}</span>
                      <span className="command-menu-item-file">{name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <>
            {NAV_SECTIONS.map((section) => {
              const files = getGroupFiles(fileGroups, section.id);
              if (!files.length) return null;
              return (
                <section key={section.id} className="command-menu-section">
                  <div className="command-menu-section-head">
                    <h3 className="command-menu-heading">{section.label}</h3>
                    <span className="command-menu-section-desc">{section.description}</span>
                  </div>
                  <ul className="command-menu-grid">
                    {files.map((name) => (
                      <li key={name}>
                        <button
                          type="button"
                          className="command-menu-item"
                          onClick={() => pickFile(name)}
                        >
                          <span className="command-menu-item-label">
                            {FILE_META[name]?.label || name}
                          </span>
                          <span className="command-menu-item-file">{name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}

            <section className="command-menu-section">
              <div className="command-menu-section-head">
                <h3 className="command-menu-heading">Appearance</h3>
                <span className="command-menu-section-desc">Select theme</span>
              </div>
              <ul className="command-menu-chips">
                {themes.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      className={`command-menu-chip${t.id === theme ? " active" : ""}`}
                      onClick={() => setTheme(t.id)}
                    >
                      {t.label}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="command-menu-section">
              <h3 className="command-menu-heading">Shortcuts</h3>
              <ul className="command-menu-shortcuts">
                {KEYBINDINGS.map((kb) => (
                  <li key={kb.id}>
                    <button
                      type="button"
                      className="command-menu-shortcut"
                      onClick={() => runBinding(kb.id)}
                    >
                      <kbd>{kb.keys}</kbd>
                      <span>{kb.label}</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className="command-menu-shortcut"
                    onClick={() => {
                      setBottomOpen(true);
                      setBottomTab("chat");
                      close();
                    }}
                  >
                    <kbd>chat</kbd>
                    <span>Open assistant panel</span>
                  </button>
                </li>
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default CommandMenu;
