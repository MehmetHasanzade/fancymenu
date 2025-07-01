import React, { useState } from 'react';
import menuData from './data/menu';
import MenuBrowser from './components/MenuBrowser';
import ChatbotPanel from './components/ChatbotPanel';

export default function App() {
  const [menu, setMenu] = useState(menuData);
  const [filteredMenu, setFilteredMenu] = useState(menuData);
  const [chatHistory, setChatHistory] = useState([]);

  // Dummy chatbot handler (will improve later)
  const handleChatbotCommand = (userInput) => {
    // Example: filter by calories
    let filtered = menu;
    let response = "I'm sorry, I did not understand your request.";

    // Basic parsing for demo - improve later!
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
    // Add more parsing for protein, category, allergens, etc.

    setFilteredMenu(filtered);
    setChatHistory(prev => [...prev, { role: 'user', text: userInput }, { role: 'bot', text: response }]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-yellow-100">
      <header className="bg-red-600 text-white p-4 flex items-center justify-center text-2xl font-bold">
        🍔 FancyMenu
      </header>
      <div className="flex flex-1 flex-col md:flex-row">
        <MenuBrowser menu={filteredMenu} />
        <ChatbotPanel onUserMessage={handleChatbotCommand} chatHistory={chatHistory} />
      </div>
      <footer className="bg-red-600 text-white text-center p-2 text-sm">
        Demo App – Powered by React & Tailwind | Inspired by McDonald's
      </footer>
    </div>
  );
}
