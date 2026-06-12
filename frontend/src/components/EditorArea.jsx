import { useEffect } from "react";
import { usePortfolio } from "../contexts/PortfolioContext";
import CodePane from "./CodePane";
import PreviewRouter from "./previews/PreviewRouter";
import WelcomePane from "./WelcomePane";

const EditorArea = () => {
  const {
    activeTab,
    openTabs,
    buffers,
    portfolio,
    openFile,
    loading,
    DEFAULT_FILE,
  } = usePortfolio();

  useEffect(() => {
    if (!loading && portfolio && openTabs.length === 0) {
      openFile(DEFAULT_FILE);
    }
  }, [loading, portfolio, openTabs.length, openFile, DEFAULT_FILE]);

  if (!activeTab || openTabs.length === 0) {
    return (
      <main className="editor-area">
        <WelcomePane />
      </main>
    );
  }

  const buffer = buffers[activeTab];

  if (!buffer) {
    return (
      <main className="editor-area loading-buffer">
        <span className="spinner" />
        <span>loading {activeTab}…</span>
      </main>
    );
  }

  return (
    <main className="editor-area split">
      <CodePane name={activeTab} code={buffer.code} className="code-pane-desktop" />
      <PreviewRouter preview={buffer.preview} portfolio={portfolio} />
    </main>
  );
};

export default EditorArea;
