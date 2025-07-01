// src/components/MenuBrowser.js
import React from "react";

export default function MenuBrowser({ menu }) {
  if (menu.length === 0) {
    return (
      <div className="w-full md:w-1/2 bg-yellow-50 p-6 border-r border-yellow-300">
        <h2 className="text-xl font-bold mb-4 text-red-600">Menu</h2>
        <div className="text-gray-600">No items match your criteria.</div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 bg-yellow-50 p-6 border-r border-yellow-300 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-red-600">Menu</h2>
      <div className="space-y-6">
        {menu.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">{item.name}</span>
              <span className="text-red-600 font-bold text-lg">
                £{item.price.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-gray-700">
              <strong>Category:</strong> {item.category} {item.subcategory && `– ${item.subcategory}`}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Calories:</strong> {item.calories} kcal &nbsp; | &nbsp;
              <strong>Protein:</strong> {item.protein}g &nbsp; | &nbsp;
              <strong>Carbs:</strong> {item.carbs}g &nbsp; | &nbsp;
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
            <div className="text-sm italic text-gray-500">{item.description}</div>
            {/* Placeholder for image */}
            {/* {item.image && (
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mt-2" />
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
}
