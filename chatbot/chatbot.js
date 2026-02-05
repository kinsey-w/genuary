// chatbot/chatbot.js

let genuaryBot = null;
let botReady = false;

/**
 * Append a message bubble to the chat window.
 * @param {string} text
 * @param {"bot" | "user"} who
 */
function addMessage(text, who = "bot") {
  const box = document.getElementById("chatMessages");
  if (!box) return;

  const row = document.createElement("div");
  row.className = "chat-row " + who;

  const bubble = document.createElement("span");
  bubble.textContent = text;

  row.appendChild(bubble);
  box.appendChild(row);
  box.scrollTop = box.scrollHeight;
}

/**
 * Initialize the chatbot UI and RiveScript brain.
 */
function initChatbot() {
  const panel = document.getElementById("chatPanel");
  const toggle = document.getElementById("chatToggle");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");

  if (!panel || !toggle || !form || !input) return;

  // Open / close panel
  toggle.addEventListener("click", () => {
    panel.classList.toggle("hidden");
    if (!panel.classList.contains("hidden")) {
      input.focus();
    }
  });

  // Handle user messages
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";

    addMessage(text, "user");

    if (!botReady || !genuaryBot) {
      addMessage("My script is not fully loaded yet… please try again in a moment!");
      return;
    }

    genuaryBot
      .reply("user", text)
      .then((reply) => {
        addMessage(reply, "bot");
      })
      .catch((err) => {
        console.error(err);
        addMessage(
          "Oops, something went wrong in my script. Remember: I am a simple rule-based bot, not an AI.",
          "bot"
        );
      });
  });

  // Load the RiveScript brain
  genuaryBot = new RiveScript();

  genuaryBot
    .loadFile("./chatbot/bot.rive")
    .then(() => {
      genuaryBot.sortReplies();
      botReady = true;
      addMessage(
        "Hi! I am GenuaryBot, a non-AI chatbot. Ask me about this site, the prompts, or how the code is structured 🙂",
        "bot"
      );
    })
    .catch((err) => {
      console.error("Failed to load bot.rive", err);
      addMessage(
        "I could not load my rule file (bot.rive). Check the console for details.",
        "bot"
      );
    });
}

// Start once the DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChatbot);
} else {
  initChatbot();
}
