// lib/useStore.ts
import { ServicePartnerType } from "@/types";
import { create } from "zustand";
import { apiEndpoint } from "../api";
import axios from "axios";
import { toast } from "sonner";

type StatusType = "Pending" | "Active" | "Inactive";

interface ServicePartnerStoreState {
  allServicePartners: ServicePartnerType[] | null;
  servicePartner: ServicePartnerType | null;
  activeTab: StatusType;
  filteredServicePartners: {
    pending: ServicePartnerType[];
    active: ServicePartnerType[];
    inactive: ServicePartnerType[];
  };
  setActiveTab: (status: StatusType) => void;
  getAllServicePartners: () => Promise<void>;
  getServicePartnerById: (id: string) => Promise<void>;
  getServicePartnerByPartnerId: (partnerId: string) => Promise<void>;
  updateStatus: (id: string, status: StatusType) => Promise<void>;
  updateServicePartner: (
    id: string,
    data: Partial<ServicePartnerType>
  ) => Promise<void>;
}

const useServicePartner = create<ServicePartnerStoreState>((set, get) => ({
  allServicePartners: null,
  servicePartner: null,
  activeTab: "Active",
  filteredServicePartners: {
    pending: [],
    active: [],
    inactive: [],
  },

  setActiveTab: (status) => set({ activeTab: status }),

  getAllServicePartners: async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/service-partners`);
      const partners = response.data;

      // Filter partners based on their status
      const filtered = {
        pending: partners.filter(
          (p: ServicePartnerType) => p.status === "Pending"
        ),
        active: partners.filter(
          (p: ServicePartnerType) => p.status === "Active"
        ),
        inactive: partners.filter(
          (p: ServicePartnerType) => p.status === "Inactive"
        ),
      };

      set({
        allServicePartners: partners,
        filteredServicePartners: filtered,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch service partners");
    }
  },

  getServicePartnerById: async (id: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}/service-partners/${id}`);
      set({ servicePartner: response.data });
    } catch (error) {
      console.error(error);
      set({ servicePartner: null });
      toast.error("Failed to fetch service partner details");
    }
  },

  getServicePartnerByPartnerId: async (partnerId: string) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}/service-partners/partner/${partnerId}`
      );
      set({ servicePartner: response.data });
    } catch (error) {
      console.error(error);
      set({ servicePartner: null });
      toast.error("Failed to fetch service partner details");
    }
  },

  updateStatus: async (id: string, status: StatusType) => {
    try {
      await get().updateServicePartner(id, { status });
      toast.success("Status updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  },

  updateServicePartner: async (
    id: string,
    data: Partial<ServicePartnerType>
  ) => {
    try {
      const response = await axios.put(
        `${apiEndpoint}/service-partners/${id}`,
        data,
        { withCredentials: true }
      );

      // Update local state
      set((state) => ({
        servicePartner:
          state.servicePartner?._id === id
            ? response.data
            : state.servicePartner,
      }));

      // Refresh the list
      await get().getAllServicePartners();

      return response.data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update service partner");
      throw error;
    }
  },
}));

export default useServicePartner;
