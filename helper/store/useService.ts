// lib/useStore.ts
import { ServiceType } from "@/types";
import { create } from "zustand";
import { apiEndpoint } from "../api";
import axios from "axios";

interface ServiceStoreState {
  activeService: ServiceType | null;
  allServices: ServiceType[] | null;
  setActiveService: (service: ServiceType | null) => void;

  getService: (serviceId: string) => Promise<void>;
  getAllServices: () => Promise<void>;
}

const useService = create<ServiceStoreState>((set) => ({
  activeService: null,
  allServices: null,
  setActiveService: (service: ServiceType | null) => {
    set({
      activeService: service,
    });
  },

  getService: async (serviceId: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}/services/${serviceId}`);
      set({
        activeService: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllServices: async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/services`);
      set({
        allServices: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useService;
