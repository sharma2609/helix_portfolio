import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { api } from "../api/client";

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
};

const DEFAULT_FILE = "home.jsx";

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [fileGroups, setFileGroups] = useState(null);
  const [buffers, setBuffers] = useState({});
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [bottomOpen, setBottomOpen] = useState(true);
  const [bottomTab, setBottomTab] = useState("chat");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const buffersRef = useRef(buffers);

  useEffect(() => {
    buffersRef.current = buffers;
  }, [buffers]);

  useEffect(() => {
    let cancelled = false;
    let retries = 0;
    const maxRetries = 3;

    const fetchData = () => {
      Promise.allSettled([api.portfolio(), api.files()]).then(
        ([dataResult, filesResult]) => {
          if (cancelled) return;
          if (dataResult.status === "rejected" && filesResult.status === "rejected") {
            if (retries < maxRetries) {
              retries++;
              setTimeout(fetchData, 2000 * retries);
              return;
            }
            setError("API unavailable — start the backend first");
            setLoading(false);
            return;
          }
          if (dataResult.status === "fulfilled") {
            setPortfolio(dataResult.value);
          }
          if (filesResult.status === "fulfilled") {
            setFileGroups(filesResult.value.groups);
          }
          setLoading(false);
        }
      );
    };

    fetchData();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        setBottomOpen((v) => !v);
        setBottomTab("chat");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openFile = useCallback(async (name) => {
    setOpenTabs((tabs) => (tabs.includes(name) ? tabs : [...tabs, name]));
    setActiveTab(name);
    if (buffersRef.current[name]) return;
    try {
      const data = await api.buffer(name);
      setBuffers((prev) => ({
        ...prev,
        [name]: { code: data.code, preview: data.preview },
      }));
    } catch (err) {
      console.error("Failed to load buffer:", name, err);
    }
  }, []);

  const closeFile = useCallback(
    (name) => {
      setOpenTabs((tabs) => {
        const next = tabs.filter((t) => t !== name);
        if (activeTab === name) {
          setActiveTab(next.length ? next[next.length - 1] : null);
        }
        return next;
      });
    },
    [activeTab]
  );

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        fileGroups,
        buffers,
        openTabs,
        activeTab,
        bottomOpen,
        bottomTab,
        paletteOpen,
        loading,
        error,
        setBottomOpen,
        setBottomTab,
        setPaletteOpen,
        openFile,
        closeFile,
        setActiveTab,
        DEFAULT_FILE,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
