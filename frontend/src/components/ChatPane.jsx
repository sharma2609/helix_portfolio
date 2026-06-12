import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../api/client";
import { usePortfolio } from "../contexts/PortfolioContext";
import { getLocalReply } from "../services/chat";

const SUGGESTIONS = [
  "What are his skills?",
  "Tell me about his projects",
  "What is his current job?",
  "How can I contact him?",
];

const ChatPane = () => {
  const { portfolio } = usePortfolio();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("api");
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        role: "bot",
        text: "Portfolio assistant — ask about skills, projects, experience, education, or contact.",
      },
    ]);
    api
      .health()
      .then(() => setMode("api"))
      .catch(() => setMode("local"));
  }, []);

  useEffect(() => {
    if (mode !== "local") return;
    const interval = setInterval(() => {
      api
        .health()
        .then(() => setMode("api"))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;
      setInput("");
      setBusy(true);
      setMessages((m) => [...m, { role: "user", text: trimmed }]);

      try {
        const data = await api.chat(trimmed);
        setMessages((m) => [...m, { role: "bot", text: data.reply || "" }]);
        setMode("api");
      } catch {
        if (portfolio) {
          setMessages((m) => [
            ...m,
            { role: "bot", text: getLocalReply(trimmed, portfolio) },
          ]);
          setMode("local");
        } else {
          setMessages((m) => [
            ...m,
            {
              role: "bot",
              text: "Assistant unavailable. Run npm run dev from the frontend folder (starts the API automatically).",
            },
          ]);
        }
      } finally {
        setBusy(false);
        inputRef.current?.focus();
      }
    },
    [busy, portfolio]
  );

  const onSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="chat-pane">
      {mode === "local" && (
        <p className="chat-banner">Using offline replies — API will be used when available.</p>
      )}
      <div className="chat-suggestions">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            className="chat-suggestion"
            disabled={busy}
            onClick={() => sendMessage(q)}
          >
            {q}
          </button>
        ))}
      </div>
      <div className="chat-log">
        {messages.map((msg, i) => (
          <p key={i} className={`chat-msg ${msg.role}`}>
            <span className="chat-prefix">{msg.role === "user" ? "›" : "◆"}</span>
            {msg.text}
          </p>
        ))}
        {busy && (
          <p className="chat-msg bot chat-thinking">
            <span className="chat-prefix">◆</span>
            thinking…
          </p>
        )}
        <span ref={endRef} />
      </div>
      <form className="chat-input-row" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ask about skills, projects, experience…"
          disabled={busy}
          autoComplete="off"
        />
        <button type="submit" disabled={busy || !input.trim()}>
          send
        </button>
      </form>
    </div>
  );
};

export default ChatPane;
