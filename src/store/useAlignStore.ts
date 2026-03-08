import { create } from "zustand";

type AlignState = {
  index: number;
  next: () => void;
  reset: () => void;
  setIndex: (value: number) => void;
};

export const useAlignStore = create<AlignState>((set) => ({
  index: 0,

  next: () =>
    set((state) => ({
      index: state.index + 1,
    })),

  reset: () =>
    set(() => ({
      index: 0,
    })),

  setIndex: (value) =>
    set(() => ({
      index: value,
    })),
})); 