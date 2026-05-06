import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi 👋 What would you like to eat?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const getReply = (text) => {
    const msg = text.toLowerCase();

    if (msg.includes("spicy")) return "🔥 Try our Spicy Burger!";
    if (msg.includes("cheap")) return "💸 Check items under ₹150!";
    if (msg.includes("veg")) return "🥗 Paneer Roll, Veg Burger";
    if (msg.includes("fast")) return "⚡ Pizza, Fries (20 mins)";

    return "😅 Try: spicy / cheap / veg / fast";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    const botMsg = { text: getReply(input), sender: "bot" };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const options = ["Spicy", "Cheap", "Veg", "Fast"];

  return (
    <>
      {/* Button */}
      <button className="chatbot-btn" onClick={() => setOpen(!open)}>
        {open ? "✖" : "💬"}
      </button>

      {/* Chatbox */}
      {open && (
        <div className="chatbot-container">
          <div className="chatbot-header">Food Assistant 🤖</div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.sender}`}>
                <div className={`msg ${msg.sender}`}>{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="chatbot-options">
            {options.map((opt, i) => (
              <button key={i} onClick={() => setInput(opt)}>
                {opt}
              </button>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
