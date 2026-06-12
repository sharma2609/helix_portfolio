import { useEffect } from "react";
import CommandMenu from "./CommandMenu";
import { usePortfolio } from "../contexts/PortfolioContext";

const CommandPalette = () => {
  const { paletteOpen, setPaletteOpen } = usePortfolio();

  useEffect(() => {
    if (!paletteOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  if (!paletteOpen) return null;

  return (
    <div
      className="palette-overlay"
      role="presentation"
      onClick={() => setPaletteOpen(false)}
    >
      <div
        className="palette command-menu-shell"
        role="dialog"
        aria-label="Command menu"
        onClick={(e) => e.stopPropagation()}
      >
        <CommandMenu variant="modal" onClose={() => setPaletteOpen(false)} />
      </div>
    </div>
  );
};

export default CommandPalette;
