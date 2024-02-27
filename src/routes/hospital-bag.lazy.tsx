import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SwipeableListItem from "../components/SwipeableListItem";

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

// Predefined lists of items for each category
const initialItems: Items = {
  essentials: [
    { name: "Identification (ID, insurance card)", checked: false },
    {
      name: "Hospital paperwork, birth plan (if you have one)",
      checked: false,
    },
    { name: "Eyeglasses (if you wear them)", checked: false },
    { name: "Phone and charger", checked: false },
    { name: "Snacks and drinks", checked: false },
    { name: "Comfortable clothes and underwear", checked: false },
    {
      name: "Toiletries (toothbrush, toothpaste, hair ties, etc.)",
      checked: false,
    },
  ],
  forBaby: [
    { name: "Approved infant car seat", checked: false },
    { name: "Newborn clothing (onesies, socks, hats)", checked: false },
    { name: "Swaddle blankets", checked: false },
    { name: "Diapers and wipes", checked: false },
    { name: "Baby lotion or cream", checked: false },
  ],
  forPartner: [
    { name: "Change of clothes", checked: false },
    { name: "Snacks and drinks", checked: false },
    { name: "Entertainment (books, magazines, tablet)", checked: false },
    { name: "Phone and charger", checked: false },
    { name: "Cash for vending machines/parking", checked: false },
  ],
};

function HospitalBag() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("essentials");
  const [items, setItems] = useState<Items>(initialItems);
  const [newItemName, setNewItemName] = useState("");

  const handleCheck = (category: keyof Items, index: number): void => {
    const newItems: Items = { ...items };
    newItems[category][index].checked = !newItems[category][index].checked;
    setItems(newItems);
  };

  const addItem = (category: keyof Items, itemName: string): void => {
    if (!itemName.trim()) return; // Prevent adding empty items
    const newItems: Items = { ...items };
    newItems[category].push({ name: itemName, checked: false });
    setItems(newItems);
    setNewItemName(""); // Reset the input field
  };

  const deleteItem = (category: keyof Items, index: number): void => {
    const newItems: Items = { ...items };
    newItems[category].splice(index, 1); // Remove the item at the specified index
    setItems(newItems);
  };

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
              onChange={() => handleCheck(category, index)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label
              htmlFor={item.name}
              className={`w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 ${item.checked ? "line-through" : ""}`}
            >
              {item.name}
            </label>
          </SwipeableListItem>
          {/* <button
            onClick={() => deleteItem(category, index)}
            className="mr-2 text-red-500 hover:text-red-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button> */}
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
