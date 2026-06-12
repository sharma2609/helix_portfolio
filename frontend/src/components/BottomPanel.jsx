import { usePortfolio } from "../contexts/PortfolioContext";
import ChatPane from "./ChatPane";
import CommandMenu from "./CommandMenu";

const BottomPanel = () => {
  const { bottomOpen, bottomTab, setBottomTab } = usePortfolio();

  if (!bottomOpen) return null;

  return (
    <section className="bottom-panel">
      <div className="bottom-tabs">
        <button
          type="button"
          className={bottomTab === "menu" ? "active" : ""}
          onClick={() => setBottomTab("menu")}
        >
          menu
        </button>
        <button
          type="button"
          className={bottomTab === "chat" ? "active" : ""}
          onClick={() => setBottomTab("chat")}
        >
          assistant
        </button>
      </div>
      <div className="bottom-content">
        {bottomTab === "menu" && <CommandMenu variant="embedded" showSearch />}
        {bottomTab === "chat" && <ChatPane />}
      </div>
    </section>
  );
};

export default BottomPanel;
