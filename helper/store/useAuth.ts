import { create } from "zustand";
import { apiEndpoint } from "../api";
import axios from "axios";
import { toast } from "sonner";
import { isApiError, UserType } from "@/types";

interface AuthState {
  user: UserType | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  checkLogin: () => Promise<boolean>;
  logout: () => Promise<void>; // Changed to Promise<void> for consistency
  addToWishlist: (packageId: string) => Promise<boolean>;
  removeFromWishlist: (packageId: string) => Promise<boolean>;
  readNotification: (notificationId: string) => Promise<boolean>;
  clearNotifications: () => Promise<boolean>;
  addNotification: (
    notification: UserType["notifications"],
    receiverId?: string
  ) => Promise<boolean>;
}

const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,

  login: async (email, password, role) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${apiEndpoint}/auth/login`,
        {
          email,
          password,
          role,
          contact: email,
        },
        {
          withCredentials: true,
        }
      );
      set({ user: data.user, isLoggedIn: true, loading: false });
      toast.success("Login successful");
      return true;
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.response?.data.message);
      }
      set({
        user: null,
        isLoggedIn: false,
        error: "Login failed",
        loading: false,
      });
      return false;
    }
  },

  checkLogin: async () => {
    try {
      const { data } = await axios.get(`${apiEndpoint}/user/checkLogin`, {
        withCredentials: true,
      });
      if (data.isLoggedIn) {
        set({ user: data.user, isLoggedIn: data.isLoggedIn, error: null });
        return true;
      } else {
        set({ user: null, isLoggedIn: false, error: null });
        return false;
      }
    } catch {
      set({ user: null, isLoggedIn: false, error: null });
      return false;
    }
  },

  logout: async () => {
    try {
      const { status } = await axios.get(`${apiEndpoint}/auth/logout`, {
        withCredentials: true,
      });
      if (status === 200) {
        toast.success("Logout successful");
        set({ user: null, isLoggedIn: false });
      }
    } catch {
      toast.error("Logout failed"); // Added error handling for logout
    }
  },

  addToWishlist: async (packageId) => {
    try {
      await axios.post(
        `${apiEndpoint}/user/addToWishlist`,
        {
          packageId,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Package added to wishlist");
      get().checkLogin();
      return true;
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.response?.data.message);
      }
      return false;
    }
  },

  removeFromWishlist: async (packageId) => {
    try {
      await axios.post(
        `${apiEndpoint}/user/removeFromWishlist`,
        {
          packageId,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Package removed from wishlist");
      get().checkLogin();
      return true;
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.response?.data.message);
      }
      return false;
    }
  },

  addNotification: async (
    notification: UserType["notifications"],
    receiverId?: string
  ) => {
    if (receiverId) notification[0].receiverId = receiverId;
    try {
      await axios.post(`${apiEndpoint}/user/addNotification`, notification[0], {
        withCredentials: true,
      });
      return true;
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.response?.data.message);
      }
      return false;
    }
  },

  readNotification: async (notificationId) => {
    if (!notificationId) {
      toast.error("Notification ID is required");
      return false;
    }
    try {
      await axios.get(
        `${apiEndpoint}/user/readNotification/${notificationId}`,
        {
          withCredentials: true,
        }
      );
      get().checkLogin();
      return true;
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.response?.data.message);
      }
      return false;
    }
  },

  clearNotifications: async () => {
    try {
      await axios.get(`${apiEndpoint}/user/clearNotifications`, {
        withCredentials: true,
      });
      toast.success("Notifications cleared");
      get().checkLogin();
      return true;
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.response?.data.message);
      }
      return false;
    }
  },
}));

export default useAuth;
