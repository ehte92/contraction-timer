import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SwipeableListItem from "../components/SwipeableListItem";
import hospitalBagStore from "../store/hospitalBagStore";

export const Route = createLazyFileRoute("/hospital-bag")({
  component: HospitalBag,
});

interface Item {
  name: string;
  checked: boolean;
}

interface Items {
  essentials: Item[];
  forBaby: Item[];
  forPartner: Item[];
}

function HospitalBag() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("essentials");
  const [newItemName, setNewItemName] = useState("");

  const { items, toggleItemChecked, addItem, deleteItem } = hospitalBagStore(
    (state) => ({
      items: state.items,
      toggleItemChecked: state.toggleItemChecked,
      addItem: state.addItem,
      deleteItem: state.deleteItem,
    })
  );

  const renderItemsList = (category: keyof Items) => (
    <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {items[category].map((item, index) => (
        <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
          <SwipeableListItem
            key={index}
            onSwipe={() => deleteItem(category, index)} // You can add any other logic here if needed
          >
            <input
              id={item.name}
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItemChecked(category, index)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label
              htmlFor={item.name}
              className={`w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 ${item.checked ? "line-through" : ""}`}
            >
              {item.name}
            </label>
          </SwipeableListItem>
        </li>
      ))}
      <li className="flex justify-between items-center p-3">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="text-sm font-medium text-gray-900 dark:text-gray-300"
          placeholder="Add new item"
        />
        <button
          onClick={() => addItem(category, newItemName)}
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add
        </button>
      </li>
    </ul>
  );

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Hospital Bag</h1>
      {/* Tab buttons */}
      <div className="flex mb-4 rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-2 ${activeTab === "essentials" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"} `}
          onClick={() => setActiveTab("essentials")}
        >
          Essentials
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === "forBaby" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"} `}
          onClick={() => setActiveTab("forBaby")}
        >
          For Baby
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === "forPartner" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"} `}
          onClick={() => setActiveTab("forPartner")}
        >
          For Partner
        </button>
      </div>
      {/* Tab content */}
      <div>{renderItemsList(activeTab as keyof Items)}</div>
    </div>
  );
}
