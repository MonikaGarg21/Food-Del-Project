import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = ({ food_list = [] }) => {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      text: "Hi 👋 Welcome to Foodie Chatbot! Ask me about food 🍔",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");

  // =========================
  // Food Suggestion Function
  // =========================
  const getSuggestions = () => {
    const randomFoods = [...food_list]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    return randomFoods
      .map((item) => `${item.name} (₹${item.price})`)
      .join(", ");
  };

  // =========================
  // Reply Function
  // =========================
  const getReply = (text) => {
    const msg = text.toLowerCase();

    // ===== Suggest Food =====
    if (
      msg.includes("suggest") ||
      msg.includes("recommend") ||
      msg.includes("food")
    ) {
      return `🍽️ Recommended Foods:\n${getSuggestions()}`;
    }

    // ===== Veg Foods =====
    if (msg.includes("veg")) {
      const vegItems = food_list.filter(
        (item) =>
          item.name.toLowerCase().includes("veg") ||
          item.category.toLowerCase().includes("pure veg") ||
          item.category.toLowerCase().includes("salad"),
      );

      return vegItems.length
        ? `🥗 Veg Foods:\n${vegItems
            .map((item) => `${item.name} (₹${item.price})`)
            .join(", ")}`
        : "😅 No veg foods found";
    }

    // ===== Cheap Foods =====
    if (msg.includes("cheap") || msg.includes("low price")) {
      const cheapItems = food_list.filter((item) => item.price <= 100);

      return cheapItems.length
        ? `💸 Cheap Foods:\n${cheapItems
            .map((item) => `${item.name} (₹${item.price})`)
            .join(", ")}`
        : "😅 No cheap foods found";
    }

    // ===== Expensive Foods =====
    if (msg.includes("expensive") || msg.includes("premium")) {
      const expensiveItems = food_list.filter((item) => item.price >= 300);

      return expensiveItems.length
        ? `👑 Premium Foods:\n${expensiveItems
            .map((item) => `${item.name} (₹${item.price})`)
            .join(", ")}`
        : "😅 No premium foods found";
    }

    // ===== Category Search =====
    const categoryMatch = food_list.filter((item) =>
      item.category.toLowerCase().includes(msg),
    );

    if (categoryMatch.length > 0) {
      return `🍴 ${msg.toUpperCase()} Items:\n${categoryMatch
        .map((item) => `${item.name} (₹${item.price})`)
        .join(", ")}`;
    }

    // ===== Food Name Search =====
    const matchedFood = food_list.find((item) =>
      item.name.toLowerCase().includes(msg),
    );

    if (matchedFood) {
      return `
🍽️ ${matchedFood.name}

💰 Price: ₹${matchedFood.price}

📂 Category: ${matchedFood.category}

📝 ${matchedFood.description}
      `;
    }

    // ===== Default =====
    return `
😅 I couldn't understand.

Try asking:
• suggest food
• veg food
• cheap food
• burger
• noodles
• pasta
• cake
• salad
• thali
• chicken pasta
    `;
  };

  // =========================
  // Send Message
  // =========================
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      text: input,
      sender: "user",
    };

    const botReply = getReply(input);

    const botMsg = {
      text: botReply,
      sender: "bot",
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);

    setInput("");
  };

  // =========================
  // Quick Buttons
  // =========================
  const options = ["Suggest Food", "Veg", "Cheap", "Burger", "Pasta", "Cake"];

  return (
    <>
      {/* Chat Open Button */}
      <button className="chatbot-btn" onClick={() => setOpen(!open)}>
        {open ? "✖" : "💬"}
      </button>

      {/* Chatbox */}
      {open && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">Food Assistant 🤖</div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.sender}`}>
                <div className={`msg ${msg.sender}`}>{msg.text}</div>
              </div>
            ))}
          </div>

          {/* Options */}
          <div className="chatbot-options">
            {options.map((opt, i) => (
              <button key={i} type="button" onClick={() => setInput(opt)}>
                {opt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask about food..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button type="button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
