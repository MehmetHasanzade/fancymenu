
// App.js
import React, { useState } from 'react';
import menuData from './data/menu';
import MenuBrowser from './components/MenuBrowser';
import ChatbotPanel from './components/ChatbotPanel';

export default function App() {
  const [filteredMenu, setFilteredMenu] = useState(menuData);

  return (
    <div className="flex flex-col min-h-screen bg-yellow-100">
      {/* ... header ... */}
      <div className="flex flex-1 flex-col md:flex-row h-full">
        <div className="w-full md:w-2/3 border-b md:border-b-0 md:border-r border-yellow-300">
          <MenuBrowser menu={filteredMenu} />
        </div>
        <div className="w-full md:w-1/3 h-full">
          <ChatbotPanel
            menu={menuData}
            setFilteredMenu={setFilteredMenu}
            resetMenu={() => setFilteredMenu(menuData)}
          />
        </div>
      </div>
      <footer className="bg-red-600 text-white text-center p-2 text-sm">
        Demo App – Powered by React & Tailwind | Inspired by McDonald's
      </footer>
    </div>
  );
}
