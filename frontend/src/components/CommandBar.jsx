import { usePortfolio } from "../contexts/PortfolioContext";

const CommandBar = () => {
  const { portfolio, setPaletteOpen, setBottomOpen, bottomOpen, setBottomTab } =
    usePortfolio();
  const p = portfolio?.personalInfo;

  return (
    <header className="command-bar">
      <div className="command-bar-left">
        <div className="brand-lockup" title="Priyanshu Sharma">
          <span className="ps-logo" aria-hidden="true">
            PS
          </span>
          <span className="brand-name">Priyanshu Sharma</span>
        </div>
        <nav className="command-nav" aria-label="Editor controls">
          <button
            type="button"
            className="cmd-btn cmd-btn-primary"
            onClick={() => setPaletteOpen(true)}
            title="Command menu (Ctrl+P)"
          >
            Menu
          </button>
          <button
            type="button"
            className={`cmd-btn ${bottomOpen ? "active" : ""}`}
            onClick={() => {
              setBottomOpen((v) => !v);
              setBottomTab("chat");
            }}
            title="Toggle assistant (Ctrl+S)"
          >
            Assistant
          </button>
        </nav>
      </div>
      <div className="command-bar-right">
        {p && (
          <nav className="social-nav" aria-label="Social links">
            <a href={p.socials.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={p.socials.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={`mailto:${p.email}`} className="social-cta">
              Hire me
            </a>
          </nav>
        )}
        <span className="hint">Ctrl+P</span>
      </div>
    </header>
  );
};

export default CommandBar;
