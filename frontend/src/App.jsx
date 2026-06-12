import CommandBar from "./components/CommandBar";
import BufferTabs from "./components/BufferTabs";
import EditorArea from "./components/EditorArea";
import BottomPanel from "./components/BottomPanel";
import StatusLine from "./components/StatusLine";
import CommandPalette from "./components/CommandPalette";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PortfolioProvider, usePortfolio } from "./contexts/PortfolioContext";

function HelixApp() {
  const { loading, error } = usePortfolio();

  if (loading) {
    return (
      <div className="helix-window loading-screen">
        <span>loading portfolio…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="helix-window loading-screen">
        <span>API unavailable — start the backend first</span>
        <code className="error-detail">npm run dev</code>
        <span className="error-detail">{error}</span>
      </div>
    );
  }

  return (
    <div className="helix-window">
      <CommandBar />
      <div className="helix-body">
        <div className="helix-main">
          <BufferTabs />
          <EditorArea />
          <BottomPanel />
        </div>
      </div>
      <StatusLine />
      <CommandPalette />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <PortfolioProvider>
          <HelixApp />
        </PortfolioProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
