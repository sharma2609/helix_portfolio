import { usePortfolio } from "../contexts/PortfolioContext";

const WelcomePane = () => {
  const { portfolio, openFile } = usePortfolio();
  const p = portfolio?.personalInfo;

  if (!p) return null;

  const cards = [
    { file: "home.jsx", title: "Home", desc: "Introduction & overview" },
    { file: "about.md", title: "About", desc: "Skills & experience" },
    { file: "projects.js", title: "Projects", desc: "Selected work" },
    { file: "contact.html", title: "Contact", desc: "Let's connect" },
    { file: "dino.js", title: "Dino Game", desc: "A quick break" },
  ];

  return (
    <div className="welcome-pane">
      <div className="welcome-hero" aria-hidden="true">
        PS
      </div>
      <p className="welcome-location">{p.location}</p>
      <h1>{p.name}</h1>
      <h2>{p.role}</h2>
      <p className="welcome-desc">
        AI/ML developer building practical systems. Press <kbd>Ctrl+P</kbd> for the
        command menu or open the assistant below.
      </p>
      <div className="welcome-grid">
        {cards.map((c) => (
          <button
            key={c.file}
            type="button"
            className="welcome-card"
            onClick={() => openFile(c.file)}
          >
            <strong>{c.title}</strong>
            <span>{c.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomePane;
