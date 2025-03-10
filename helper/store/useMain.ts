// lib/useStore.ts
import { ServiceType } from "@/types";
import { create } from "zustand";
import { apiEndpoint } from "../api";
import axios from "axios";

interface MainStoreState {
  isShowSidebar: boolean;
  onToggleSidebar: () => void;
}

const useMain = create<MainStoreState>((set, get) => ({
  isShowSidebar: true,
  onToggleSidebar: () => {
    const { isShowSidebar } = get();
    set({
      isShowSidebar: !isShowSidebar,
    });
  },
}));

export default useMain;
