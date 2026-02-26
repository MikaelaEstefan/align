import { create } from "zustand";

export type VoteValue = "like" | "dislike" | "skip";

type AlignState = {
  index: number;
  votes: Record<string, VoteValue>; // itemId -> vote
  vote: (itemId: string, value: VoteValue) => void;
  next: () => void;
  reset: () => void;
};

export const useAlignStore = create<AlignState>((set) => ({
  index: 0,
  votes: {},

  vote: (itemId, value) =>
    set((state) => ({
      votes: { ...state.votes, [itemId]: value },
    })),

  next: () =>
    set((state) => ({
      index: state.index + 1,
    })),

  reset: () =>
    set(() => ({
      index: 0,
      votes: {},
    })),
}));