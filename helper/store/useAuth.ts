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
  isApproved: boolean;
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
  checkUserApproval: (user: UserType) => boolean;
}

const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  isApproved: false,

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
      const user = data.user;
      const isApproved = get().checkUserApproval(user);
      set({ user, isLoggedIn: true, loading: false, isApproved });
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
        isApproved: false,
      });
      return false;
    }
  },

  checkLogin: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`${apiEndpoint}/user/checkLogin`, {
        withCredentials: true,
      });
      if (data.isLoggedIn) {
        const user = data.user;
        const isApproved = get().checkUserApproval(user);
        set({ user, isLoggedIn: data.isLoggedIn, error: null, isApproved });
        return true;
      } else {
        set({ user: null, isLoggedIn: false, error: null, isApproved: false });
        return false;
      }
    } catch {
      set({
        user: null,
        isLoggedIn: false,
        error: null,
        loading: false,
        isApproved: false,
      });
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
        set({ user: null, isLoggedIn: false, isApproved: false });
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

  checkUserApproval: (user: UserType) => {
    if (!user) return false;

    // Check if all required fields are filled
    // Excluding notifications, wishlist, partnerId, and profileImage as specified
    return !!(
      user.fullname &&
      user.contact &&
      user.email &&
      user.role &&
      user.aadharCard &&
      user.panCard &&
      user.address
    );
  },
}));

export default useAuth;
