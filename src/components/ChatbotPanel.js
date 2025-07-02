import React, { useState } from "react";
import axios from "axios";

const apiKey = process.env.REACT_APP_OPENROUTER_KEY;

export default function ChatbotPanel({ menu, setFilteredMenu, resetMenu }) {
  // System prompt includes instructions for outputting JSON for filtering or reset
  const systemPrompt = `
You are a friendly, polite, and helpful restaurant waiter chatbot named FancyMenu.

By default, when the user asks for a list or filtered items, reply with a brief, friendly answer listing item names and prices only. 
Then, output a JSON object in this format (on a new line):
{"category":"...", "max_calories":..., "allergens_exclude": [...], "min_protein":..., "max_fat":..., "ingredients_include": [...], "ingredients_exclude": [...]}

If the user asks you to reset the menu or see all items, reply "Menu reset to full list." and on a new line, output: {"reset": true}

Only include fields if mentioned. Here is the menu: ${JSON.stringify(menu, null, 2)}
  `.trim();

  // Chat history for AI (memory)
  const [chatHistory, setChatHistory] = useState([
    { role: "system", content: systemPrompt }
  ]);
  // What to display (user/bot only)
  const [displayHistory, setDisplayHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Dots animation for "thinking"
  function LoadingDots() {
    const [dots, setDots] = useState(".");
    React.useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : "."));
      }, 400);
      return () => clearInterval(interval);
    }, []);
    return <span>{dots}</span>;
  }

  // OpenRouter API call, sending full conversation history
  async function askOpenRouter(chatHistory) {
    const endpoint = "https://openrouter.ai/api/v1/chat/completions";
    try {
      const response = await axios.post(
        endpoint,
        {
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: chatHistory
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("OpenRouter API error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Main chat handler
  const handleSend = async (e) => {
    e.preventDefault();
    const userMsg = input.trim();
    if (!userMsg) return;

    // Build new chat history with user's latest message
    const updatedHistory = [
      ...chatHistory,
      { role: "user", content: userMsg }
    ];
    setInput("");
    setDisplayHistory((prev) => [
      ...prev,
      { role: "user", text: userMsg }
    ]);
    setLoading(true);

    try {
      const aiReply = await askOpenRouter(updatedHistory);

      // 1. Show AI's response in chat window
      setDisplayHistory((prev) => [
        ...prev,
        { role: "bot", text: aiReply }
      ]);

      // 2. PARSE FOR JSON FILTERING
      // Look for a JSON object in the AI's reply (for filtering or reset)
      const match = aiReply.match(/{[\s\S]*}/);
      if (match) {
        let filters;
        try {
          filters = JSON.parse(match[0]);
        } catch (e) {
          filters = null;
        }
        if (filters) {
          if (filters.reset && resetMenu) {
            resetMenu();
          } else if (setFilteredMenu) {
            let filtered = menu;
            if (filters.category) {
              filtered = filtered.filter(item =>
                item.category.toLowerCase().includes(filters.category.toLowerCase())
              );
            }
            if (filters.max_calories) {
              filtered = filtered.filter(item => item.calories <= filters.max_calories);
            }
            if (filters.min_protein) {
              filtered = filtered.filter(item => item.protein >= filters.min_protein);
            }
            if (filters.max_fat) {
              filtered = filtered.filter(item => item.fat <= filters.max_fat);
            }
            if (filters.allergens_exclude && filters.allergens_exclude.length > 0) {
              filtered = filtered.filter(item =>
                !filters.allergens_exclude.some(all =>
                  item.allergens.map(a => a.toLowerCase()).includes(all.toLowerCase())
                )
              );
            }
            if (filters.ingredients_include && filters.ingredients_include.length > 0) {
              filtered = filtered.filter(item =>
                filters.ingredients_include.every(ing =>
                  item.ingredients.join(" ").toLowerCase().includes(ing.toLowerCase())
                )
              );
            }
            if (filters.ingredients_exclude && filters.ingredients_exclude.length > 0) {
              filtered = filtered.filter(item =>
                !filters.ingredients_exclude.some(ing =>
                  item.ingredients.join(" ").toLowerCase().includes(ing.toLowerCase())
                )
              );
            }
            setFilteredMenu(filtered);
          }
        }
      }

      // 3. Update chat history for memory
      setChatHistory([
        ...updatedHistory,
        { role: "assistant", content: aiReply }
      ]);
    } catch (error) {
      setDisplayHistory((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I couldn't connect to the AI." }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white p-6">
      <h2 className="text-lg font-bold mb-4 text-red-600">Virtual Waiter</h2>
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {displayHistory.length === 0 && (
          <div className="text-gray-400 italic text-sm">
            Ask me for recommendations or menu suggestions!
          </div>
        )}
        {displayHistory.map((msg, i) =>
          msg.role === "user" ? (
            <div
              key={i}
              className="text-right text-sm bg-yellow-100 rounded-xl px-4 py-2 ml-20"
            >
              {msg.text}
            </div>
          ) : (
            <div
              key={i}
              className="text-left text-sm bg-gray-100 rounded-xl px-4 py-2 mr-20"
            >
              {msg.text}
            </div>
          )
        )}
        {loading && (
          <div className="text-left text-sm bg-gray-100 rounded-xl px-4 py-2 mr-20 flex items-center">
            <LoadingDots />
          </div>
        )}
      </div>
      <form className="flex mt-2" onSubmit={handleSend}>
        <input
          className="flex-1 border rounded-l-xl px-3 py-2 focus:outline-none focus:ring text-sm"
          placeholder="Type your request..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className="bg-red-600 text-white px-4 rounded-r-xl font-bold text-sm"
          disabled={loading || !input.trim()}
          type="submit"
        >
          Send
        </button>
      </form>
      <div className="text-xs text-gray-400 mt-2">
        Powered by OpenRouter - DeepSeek V3 0324
      </div>
    </div>
  );
}
