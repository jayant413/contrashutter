// lib/useStore.ts
import { PackageType } from "@/types";
import { create } from "zustand";
import { apiEndpoint } from "../api";
import axios from "axios";

interface PackageStoreState {
  activePackage: PackageType | null;
  setActivePackage: (packageInfo: PackageType | null) => void;

  getPackage: (packageId: string) => Promise<void>;
}

const usePackage = create<PackageStoreState>((set) => ({
  activePackage: null,
  setActivePackage: (packageInfo: PackageType | null) => {
    set({
      activePackage: packageInfo,
    });
  },

  getPackage: async (packageId: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}/packages/${packageId}`);
      set({
        activePackage: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  },
}));

export default usePackage;
