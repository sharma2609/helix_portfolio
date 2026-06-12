const CHAT_SUGGESTIONS = [
  "What are his skills?",
  "Tell me about his projects",
  "What is his current job?",
  "How can I contact him?",
];

function initChat() {
  addChatMessage("bot", "Portfolio assistant — ask about skills, projects, experience, education, or contact.");
  initChatSuggestions();
  document.getElementById("chat-form")?.addEventListener("submit", onChatSubmit);
}

function initChatSuggestions() {
  const container = document.getElementById("chat-suggestions");
  if (!container) return;
  container.innerHTML = CHAT_SUGGESTIONS.map(
    (q) =>
      `<button type="button" class="chat-suggestion" onclick="sendChatMessage(this.textContent)">${q}</button>`
  ).join("");
}

function onChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  sendChatMessage(text);
}

let chatBusy = false;

function sendChatMessage(text) {
  if (chatBusy) return;
  chatBusy = true;
  addChatMessage("user", text);
  showChatThinking();

  fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text }),
  })
    .then((r) => {
      if (!r.ok) throw new Error("API error");
      return r.json();
    })
    .then((data) => {
      removeChatThinking();
      addChatMessage("bot", data.reply || "");
    })
    .catch(() => {
      removeChatThinking();
      addChatMessage("bot", "Assistant unavailable. Make sure the backend is running.");
    })
    .finally(() => {
      chatBusy = false;
      document.getElementById("chat-input")?.focus();
    });
}

function addChatMessage(role, text) {
  const log = document.getElementById("chat-log");
  if (!log) return;
  const msg = document.createElement("p");
  msg.className = "chat-msg " + role;
  msg.innerHTML =
    '<span class="chat-prefix">' + (role === "user" ? "›" : "◆") + "</span>" + escapeHtml(text);
  log.appendChild(msg);
  log.scrollTop = log.scrollHeight;
}

function showChatThinking() {
  const log = document.getElementById("chat-log");
  if (!log) return;
  const msg = document.createElement("p");
  msg.className = "chat-msg bot chat-thinking";
  msg.id = "chat-thinking";
  msg.innerHTML = '<span class="chat-prefix">◆</span>thinking…';
  log.appendChild(msg);
  log.scrollTop = log.scrollHeight;
}

function removeChatThinking() {
  const el = document.getElementById("chat-thinking");
  if (el) el.remove();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", initChat);
