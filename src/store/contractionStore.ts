import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Contraction {
  time: string;
  duration: string;
}

type ContractionStore = {
  contractions: Contraction[];
  addContraction: (contraction: Contraction) => void;
  clearContractions: () => void;
};

const useStore = create<ContractionStore>()(
  persist(
    (set) => ({
      contractions: [],
      addContraction: (contraction) => {
        set((state) => ({
          contractions: [...state.contractions, contraction],
        }));
      },
      clearContractions: () => set({ contractions: [] }),
    }),
    {
      name: "contraction-store",
    }
  )
);

export default useStore;
