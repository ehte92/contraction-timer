import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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

  const handleCheck = (category: keyof Items, index: number): void => {
    const newItems: Items = { ...items };
    newItems[category][index].checked = !newItems[category][index].checked;
    setItems(newItems);
  };

  const renderItemsList = (category: keyof Items) => (
    <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {items[category].map((item, index) => (
        <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
          <div key={index} className="flex items-center ps-3">
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
          </div>
        </li>
      ))}
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
