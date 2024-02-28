import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Item {
  name: string;
  checked: boolean;
}

interface Items {
  essentials: Item[];
  forBaby: Item[];
  forPartner: Item[];
}

interface StoreState {
  items: Items;
  toggleItemChecked: (category: keyof Items, index: number) => void;
  addItem: (category: keyof Items, itemName: string) => void;
  deleteItem: (category: keyof Items, index: number) => void;
  resetItems: () => void;
}

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

const hospitalBagStore = create<StoreState>()(
  persist(
    (set) => ({
      items: initialItems,
      toggleItemChecked: (category, index) =>
        set((state) => {
          const newItems = { ...state.items };
          newItems[category][index].checked =
            !newItems[category][index].checked;
          return { items: newItems };
        }),
      addItem: (category, itemName) => {
        if (!itemName.trim()) return; // Prevent adding empty items
        set((state) => {
          const newItem = { name: itemName, checked: false };
          const newItems = {
            ...state.items,
            [category]: [...state.items[category], newItem],
          };
          return { items: newItems };
        });
      },
      deleteItem: (category, index) =>
        set((state) => {
          const newItems = { ...state.items };
          newItems[category].splice(index, 1);
          return { items: newItems };
        }),
      resetItems: () => {
        set({
          items: initialItems,
        });
      },
    }),
    {
      name: "hospital-bag-store",
    }
  )
);

export default hospitalBagStore;
