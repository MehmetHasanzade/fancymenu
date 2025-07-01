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
  const msg = userInput.toLowerCase();
  let filtered = menu;

  // --- FILTERS ---
  let filters = {
    category: null,
    calories: null,
    protein: null,
    carbs: null,
    fat: null,
    includeIngredients: [],
    excludeIngredients: [],
    excludeAllergens: [],
  };

  // --- Categories ---
  const categories = [
    "mains", "starters", "desserts", "sides", "soups", "sandwiches", "ice cream", "fries", "burgers", "chicken"
  ];
  categories.forEach(cat => {
    if (msg.includes(cat)) filters.category = cat;
  });

  // --- Calories ---
  const calMax = msg.match(/(under|less than|below) (\d+)\s*cal/);
  if (calMax) filters.calories = { type: "max", value: parseInt(calMax[2]) };
  const calMin = msg.match(/(over|at least|more than|above) (\d+)\s*cal/);
  if (calMin) filters.calories = { type: "min", value: parseInt(calMin[2]) };

  // --- Protein ---
  const proteinMax = msg.match(/(under|less than|below) (\d+)\s*g\s*protein/);
  if (proteinMax) filters.protein = { type: "max", value: parseInt(proteinMax[2]) };
  const proteinMin = msg.match(/(over|at least|minimum|more than|above) (\d+)\s*g\s*protein/);
  if (proteinMin) filters.protein = { type: "min", value: parseInt(proteinMin[2]) };

  // --- Carbs ---
  const carbsMax = msg.match(/(under|less than|below) (\d+)\s*g\s*carb/);
  if (carbsMax) filters.carbs = { type: "max", value: parseInt(carbsMax[2]) };
  const carbsMin = msg.match(/(over|at least|minimum|more than|above) (\d+)\s*g\s*carb/);
  if (carbsMin) filters.carbs = { type: "min", value: parseInt(carbsMin[2]) };

  // --- Fat ---
  const fatMax = msg.match(/(under|less than|below) (\d+)\s*g\s*fat/);
  if (fatMax) filters.fat = { type: "max", value: parseInt(fatMax[2]) };
  const fatMin = msg.match(/(over|at least|minimum|more than|above) (\d+)\s*g\s*fat/);
  if (fatMin) filters.fat = { type: "min", value: parseInt(fatMin[2]) };

  // --- Ingredients: include/exclude ---
  // For "with X" or "containing X"
  const incIngMatch = msg.match(/(with|containing|include)s? (\w+)/g);
  if (incIngMatch) {
    incIngMatch.forEach(m => {
      const ing = m.split(" ").pop();
      filters.includeIngredients.push(ing);
    });
  }
  // For "no X" or "without X"
  const excIngMatch = msg.match(/(no|without) (\w+)/g);
  if (excIngMatch) {
    excIngMatch.forEach(m => {
      const ing = m.split(" ").pop();
      filters.excludeIngredients.push(ing);
    });
  }

  // --- Allergens: exclude ---
  // e.g. "no gluten", "gluten free", "no dairy", "no egg"
  const allergensList = ["gluten", "dairy", "eggs", "fish", "nuts"];
  allergensList.forEach(all => {
    if (msg.includes(`no ${all}`) || msg.includes(`${all} free`)) {
      filters.excludeAllergens.push(all.charAt(0).toUpperCase() + all.slice(1));
    }
  });

  // --- FILTER APPLICATION ---
  filtered = filtered.filter(item => {
    // Category
    if (filters.category && !(item.category.toLowerCase().includes(filters.category) || (item.subcategory && item.subcategory.toLowerCase().includes(filters.category)))) return false;

    // Calories
    if (filters.calories) {
      if (filters.calories.type === "max" && item.calories > filters.calories.value) return false;
      if (filters.calories.type === "min" && item.calories < filters.calories.value) return false;
    }
    // Protein
    if (filters.protein) {
      if (filters.protein.type === "max" && item.protein > filters.protein.value) return false;
      if (filters.protein.type === "min" && item.protein < filters.protein.value) return false;
    }
    // Carbs
    if (filters.carbs) {
      if (filters.carbs.type === "max" && item.carbs > filters.carbs.value) return false;
      if (filters.carbs.type === "min" && item.carbs < filters.carbs.value) return false;
    }
    // Fat
    if (filters.fat) {
      if (filters.fat.type === "max" && item.fat > filters.fat.value) return false;
      if (filters.fat.type === "min" && item.fat < filters.fat.value) return false;
    }

    // Ingredients (include)
    if (filters.includeIngredients.length > 0) {
      if (!filters.includeIngredients.every(ing =>
        item.ingredients.join(" ").toLowerCase().includes(ing)
      )) return false;
    }
    // Ingredients (exclude)
    if (filters.excludeIngredients.length > 0) {
      if (filters.excludeIngredients.some(ing =>
        item.ingredients.join(" ").toLowerCase().includes(ing)
      )) return false;
    }

    // Allergens (exclude)
    if (filters.excludeAllergens.length > 0) {
      if (filters.excludeAllergens.some(all =>
        item.allergens.map(a => a.toLowerCase()).includes(all.toLowerCase())
      )) return false;
    }

    return true;
  });

  // Compose response
  let response = filtered.length
    ? `Filtered to ${filtered.length} items.`
    : "No menu items match your request.";

  setFilteredMenu(filtered);
  setChatHistory(prev => [
    ...prev,
    { role: "user", text: userInput },
    { role: "bot", text: response }
  ]);
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
