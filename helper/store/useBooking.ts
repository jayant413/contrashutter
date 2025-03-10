import { create } from "zustand";
import axios from "axios";
import { BookingType } from "@/types";
import { apiEndpoint } from "../api";

interface BookingState {
  allBookings: BookingType[] | null;
  getAllBookings: () => Promise<void>;
}

const useBooking = create<BookingState>((set) => ({
  allBookings: null,
  getAllBookings: async () => {
    try {
      const res = await axios.get(`${apiEndpoint}/bookings`, {
        withCredentials: true,
      });
      set({
        allBookings: res.data.map((booking: BookingType) => ({
          ...booking,
          email: booking.basic_info.email,
        })),
      });
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  },
}));

export default useBooking;
