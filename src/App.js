// src/App.js

import React, { useState } from 'react';
import menuData from './data/menu';
import MenuBrowser from './components/MenuBrowser';
import ChatbotPanel from './components/ChatbotPanel';

export default function App() {
  const [menu] = useState(menuData);
  const [filteredMenu, setFilteredMenu] = useState(menuData);
  const [chatHistory, setChatHistory] = useState([]);

  // Dummy chatbot handler (expand as needed)
  const handleChatbotCommand = (userInput) => {
    let filtered = menu;
    let response = "I'm sorry, I did not understand your request.";

    if (userInput.toLowerCase().includes('calories')) {
      const calMatch = userInput.match(/under (\d+) calories/i);
      if (calMatch) {
        const limit = parseInt(calMatch[1]);
        filtered = menu.filter(item => item.calories < limit);
        response = `Menu items under ${limit} calories are now shown.`;
      }
    } else if (userInput.toLowerCase().includes('red meat')) {
      filtered = menu.filter(item => item.tags.includes('red meat'));
      response = "Here are the red meat mains for you.";
    } else if (userInput.toLowerCase().includes('reset')) {
      filtered = menu;
      response = "Menu reset to full list.";
    }

    setFilteredMenu(filtered);
    setChatHistory(prev => [...prev, { role: 'user', text: userInput }, { role: 'bot', text: response }]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-yellow-100">
      <header className="bg-red-600 text-white p-4 flex items-center justify-center text-2xl font-bold">
        🍔 FancyMenu
      </header>
      {/* MAIN CONTENT: always side-by-side on md and up */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Menu on left */}
        <div className="w-full md:w-2/3 border-b md:border-b-0 md:border-r border-yellow-300">
          <MenuBrowser menu={filteredMenu} />
        </div>
        {/* Chatbot on right */}
        <div className="w-full md:w-1/3">
          <ChatbotPanel onUserMessage={handleChatbotCommand} chatHistory={chatHistory} />
        </div>
      </div>
      <footer className="bg-red-600 text-white text-center p-2 text-sm">
        Demo App – Powered by React & Tailwind | Inspired by McDonald's
      </footer>
    </div>
  );
}
