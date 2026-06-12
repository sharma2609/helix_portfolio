import { useEffect, useState } from "react";
import { usePortfolio } from "../contexts/PortfolioContext";
import { useTheme } from "../contexts/ThemeContext";

const StatusLine = () => {
  const { activeTab, portfolio } = usePortfolio();
  const { theme, themes } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const clock = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const loc = portfolio?.personalInfo?.location?.split(",")[0] || "";

  return (
    <footer className="status-line">
      <span className="mode">NORMAL</span>
      <span>{activeTab || "welcome"}</span>
      <span className="theme-label">{themes.find((t) => t.id === theme)?.label || theme}</span>
      <span className="spacer" />
      <span>{loc}</span>
      <span>{clock}</span>
    </footer>
  );
};

export default StatusLine;
