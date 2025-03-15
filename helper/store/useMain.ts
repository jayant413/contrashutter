// lib/useStore.ts
import { create } from "zustand";

interface MainStoreState {
  isShowSidebar: boolean;
  setIsShowSidebar: (isShowSidebar: boolean) => void;
  onToggleSidebar: () => void;
}

const useMain = create<MainStoreState>((set, get) => ({
  isShowSidebar: false,
  setIsShowSidebar: (isShowSidebar: boolean) => {
    set({ isShowSidebar });
  },
  onToggleSidebar: () => {
    const { isShowSidebar } = get();
    set({
      isShowSidebar: !isShowSidebar,
    });
  },
}));

export default useMain;
