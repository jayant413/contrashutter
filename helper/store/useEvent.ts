import { create } from "zustand";
import { EventType } from "@/types";
import { apiEndpoint } from "../api";
import axios from "axios";

interface EventStore {
  activeEvent: EventType | null;
  setActiveEvent: (event: EventType | null) => void;

  getEvent: (eventId: string) => Promise<void>;
}

const useEvent = create<EventStore>((set) => ({
  activeEvent: null,
  setActiveEvent: (event: EventType | null) => set({ activeEvent: event }),

  getEvent: async (eventId: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}/events/${eventId}`);
      set({ activeEvent: response.data });
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useEvent;
