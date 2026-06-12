import { usePortfolio } from "../contexts/PortfolioContext";
import { FILE_META } from "../constants/navigation";

const BufferTabs = () => {
  const { openTabs, activeTab, setActiveTab, closeFile } = usePortfolio();

  if (openTabs.length === 0) return null;

  return (
    <div className="buffer-tabs">
      {openTabs.map((name) => (
        <div
          key={name}
          className={`buffer-tab ${activeTab === name ? "active" : ""}`}
        >
          <button type="button" onClick={() => setActiveTab(name)}>
            {FILE_META[name]?.label || name}
          </button>
          <button
            type="button"
            className="tab-close"
            aria-label={`Close ${name}`}
            onClick={() => closeFile(name)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default BufferTabs;
