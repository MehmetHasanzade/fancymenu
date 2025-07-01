// src/components/MenuBrowser.js
import React from "react";

export default function MenuBrowser({ menu }) {
  return (
    <div className="w-full h-full md:h-screen bg-yellow-50 p-6 border-r border-yellow-300 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-red-600">Menu</h2>
      {menu.length === 0 ? (
        <div className="text-gray-600">No items match your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menu.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col gap-2"
            >
              {/* Image block (shows only if image is present) */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-40 h-40 object-cover rounded-2xl mb-2 border-2 border-yellow-300 self-center shadow-lg"
                />
              )}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{item.name}</span>
                <span className="text-red-600 font-bold text-lg">
                  £{item.price.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-gray-700">
                <strong>Category:</strong> {item.category}
                {item.subcategory && ` – ${item.subcategory}`}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Calories:</strong> {item.calories} kcal &nbsp;|&nbsp;
                <strong>Protein:</strong> {item.protein}g &nbsp;|&nbsp;
                <strong>Carbs:</strong> {item.carbs}g &nbsp;|&nbsp;
                <strong>Fat:</strong> {item.fat}g
              </div>
              <div className="text-sm">
                <strong>Ingredients:</strong> {item.ingredients.join(", ")}
              </div>
              <div className="text-sm">
                <strong>Allergens:</strong>{" "}
                {item.allergens.length > 0
                  ? item.allergens.join(", ")
                  : "None"}
              </div>
              <div className="text-sm italic text-gray-500">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
