import { create } from "zustand";

export type VoteValue = "like" | "dislike" | "skip";
export type User = "A" | "B";

type AlignState = {
  currentUser: User;
  index: number;

  votes: {
    A: Record<string, VoteValue>;
    B: Record<string, VoteValue>;
  };

  vote: (itemId: string, value: VoteValue) => void;
  next: () => void;
  switchUser: () => void;
  reset: () => void;
};

export const useAlignStore = create<AlignState>((set) => ({
  currentUser: "A",
  index: 0,

  votes: {
    A: {},
    B: {},
  },

  vote: (itemId, value) =>
    set((state) => ({
      votes: {
        ...state.votes,
        [state.currentUser]: {
          ...state.votes[state.currentUser],
          [itemId]: value,
        },
      },
    })),

  next: () =>
    set((state) => ({
      index: state.index + 1,
    })),

  switchUser: () =>
    set((state) => ({
      currentUser: state.currentUser === "A" ? "B" : "A",
      index: 0,
    })),

  reset: () =>
    set(() => ({
      currentUser: "A",
      index: 0,
      votes: { A: {}, B: {} },
    })),
}));