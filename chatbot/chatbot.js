// chatbot/chatbot.js

let genuaryBot = null;
let botReady = false;
let chatOpenedOnce = false;

function $(id) {
  return document.getElementById(id);
}

function addMessage(text, who = "bot") {
  const box = $("chatMessages");
  if (!box) return;

  const row = document.createElement("div");
  row.className = `chat-row ${who}`;

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.textContent = text;

  row.appendChild(bubble);
  box.appendChild(row);
  box.scrollTop = box.scrollHeight;
}

function setBotStatus(text) {
  const status = $("chatStatus");
  if (status) status.textContent = text;
}

function openChat() {
  const panel = $("chatPanel");
  const input = $("chatInput");
  if (!panel) return;

  panel.classList.remove("hidden");
  panel.setAttribute("aria-hidden", "false");

  if (!chatOpenedOnce) {
    chatOpenedOnce = true;
    setTimeout(() => input?.focus(), 60);
  } else {
    input?.focus();
  }
}

function closeChat() {
  const panel = $("chatPanel");
  if (!panel) return;
  panel.classList.add("hidden");
  panel.setAttribute("aria-hidden", "true");
}

function toggleChat() {
  const panel = $("chatPanel");
  if (!panel) return;
  if (panel.classList.contains("hidden")) openChat();
  else closeChat();
}

async function getReply(text) {
  if (!botReady || !genuaryBot) {
    return "I am still loading my script. Try again in a moment.";
  }

  try {
    const reply = await genuaryBot.reply("local-user", text);
    return reply || "I am not sure how to answer that yet.";
  } catch (err) {
    console.error(err);
    return "Something went wrong while generating my reply. I am only a small rule-based bot, so I can break.";
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  const input = $("chatInput");
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  addMessage(text, "user");
  setBotStatus("Thinking...");

  const reply = await getReply(text);
  addMessage(reply, "bot");

  setBotStatus(botReady ? "Online" : "Offline");
}

async function initBot() {
  if (typeof RiveScript === "undefined") {
    console.error("RiveScript is not loaded.");
    addMessage("I could not start because the RiveScript library is missing.", "bot");
    setBotStatus("Offline");
    return;
  }

  genuaryBot = new RiveScript({
    utf8: true
  });

  try {
    setBotStatus("Loading...");
    await genuaryBot.loadFile("./chatbot/bot.rive");
    genuaryBot.sortReplies();
    botReady = true;
    setBotStatus("Online");

    addMessage(
      "Hi. I’m GenuaryBot. Ask me about the site, the prompts, the sketches, or how everything is built.",
      "bot"
    );
  } catch (err) {
    console.error("Failed to load bot.rive", err);
    botReady = false;
    setBotStatus("Offline");
    addMessage(
      "I could not load my conversation script. Check that chatbot/bot.rive exists and that the path is correct.",
      "bot"
    );
  }
}

function bindUI() {
  const toggle = $("chatToggle");
  const close = $("chatClose");
  const form = $("chatForm");

  toggle?.addEventListener("click", toggleChat);
  close?.addEventListener("click", closeChat);
  form?.addEventListener("submit", handleSubmit);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeChat();
  });
}

function initChatbot() {
  const panel = $("chatPanel");
  const toggle = $("chatToggle");
  const form = $("chatForm");
  const input = $("chatInput");
  const messages = $("chatMessages");

  if (!panel || !toggle || !form || !input || !messages) {
    console.warn("Chatbot UI not found in DOM.");
    return;
  }

  bindUI();
  initBot();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChatbot);
} else {
  initChatbot();
}