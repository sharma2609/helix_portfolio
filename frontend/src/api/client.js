const API_BASE = import.meta.env.VITE_API_URL || "";
const TIMEOUT_MS = 15000;

async function request(path, options = {}, signal) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const combinedSignal = signal
    ? combineAbortSignals(signal, controller.signal)
    : controller.signal;

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: combinedSignal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`API ${res.status}: ${path}${detail ? ` — ${detail}` : ""}`);
    }
    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

function combineAbortSignals(...signals) {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  for (const sig of signals) {
    if (sig.aborted) {
      controller.abort();
      return controller.signal;
    }
    sig.addEventListener("abort", onAbort, { once: true });
  }
  return controller.signal;
}

export const api = {
  health: (signal) => request("/api/health", {}, signal),
  portfolio: (signal) => request("/api/portfolio", {}, signal),
  files: (signal) => request("/api/files", {}, signal),
  buffer: (name) => request(`/api/buffers/${encodeURIComponent(name)}`),
  search: (q, signal) => request(`/api/search?q=${encodeURIComponent(q)}`, {}, signal),
  chat: (message) =>
    request("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
