import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const sidebarStore = (set) => ({
  isSidebarOpen: window.innerWidth > 1024 ? true : false,
  setIsSidebarOpen: (value) => set({ isSidebarOpen: value }),
});

const useSidebarStore = create(
  // devtools(
  persist(sidebarStore, {
    name: "sidebar",
  })
  // )
);

export default useSidebarStore;
