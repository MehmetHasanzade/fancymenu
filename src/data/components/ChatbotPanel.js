// src/components/ChatbotPanel.js
import React, { useState, useRef, useEffect } from "react";

export default function ChatbotPanel({ onUserMessage, chatHistory }) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSend = () => {
    if (input.trim()) {
      onUserMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full md:w-1/2 flex flex-col bg-white p-6">
      <h2 className="text-xl font-bold mb-4 text-yellow-600">🍟 Virtual Waiter</h2>
      <div className="flex-1 overflow-y-auto bg-yellow-50 rounded-xl p-3 mb-4">
        {chatHistory.length === 0 && (
          <div className="text-gray-500 italic mb-2">
            Ask me for menu suggestions, e.g., “Show me chicken mains under 500 calories” or “List vegetarian starters.”
          </div>
        )}
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span
              className={
                msg.role === "user"
                  ? "inline-block bg-yellow-200 text-gray-800 rounded px-3 py-1"
                  : "inline-block bg-red-100 text-red-700 rounded px-3 py-1"
              }
            >
              {msg.role === "user" ? "You: " : "Waiter: "}
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded px-3 py-2 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Type your request..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-red-600 text-white rounded px-4 py-2 font-bold hover:bg-red-700"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
      <button
        className="mt-2 text-sm underline text-yellow-700 hover:text-red-700"
        onClick={() => onUserMessage("reset")}
      >
        Reset Menu
      </button>
    </div>
  );
}
