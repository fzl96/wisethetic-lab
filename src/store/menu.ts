import { create } from "zustand";

interface MenuState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useMenuState = create<MenuState>()((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));
