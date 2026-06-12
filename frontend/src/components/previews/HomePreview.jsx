import { usePortfolio } from "../../contexts/PortfolioContext";

const HomePreview = ({ portfolio }) => {
  const { openFile } = usePortfolio();
  const p = portfolio.personalInfo;

  return (
    <div className="preview-pane">
      <div className="preview-hero">
        <p className="preview-tag">Portfolio</p>
        <h1>{p.name}</h1>
        <h2>{p.role}</h2>
        <p className="preview-lead">
          AI/ML developer focused on practical systems — from NLP pipelines to
          full-stack apps. Browse the workspace or chat with the assistant below.
        </p>
      </div>
      <div className="preview-actions">
        <button type="button" className="primary" onClick={() => openFile("about.md")}>
          View profile
        </button>
        <button type="button" onClick={() => openFile("projects.js")}>
          Projects
        </button>
        <button type="button" onClick={() => openFile("career_timeline.git")}>
          Career timeline
        </button>
        <button type="button" onClick={() => openFile("contact.html")}>
          Contact
        </button>
      </div>
    </div>
  );
};

export default HomePreview;
