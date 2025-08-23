import api from "@/services/api.js";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      loading: false,
      user: {},
      permissions: [],
      notifications: [],
      isLoginLoading: false,

      setIsLoginLoading: (isLoginLoading) => set({ isLoginLoading }),

      login: () => set({ isAuthenticated: true }),

      setPermissions: (permissions) => set({ permissions }),
      setUser: (user) => set({ user }),
      setNotifications: (notifications) => set({ notifications }),

      _clearAuth: () => {
        set({ isAuthenticated: false, loading: false });
        localStorage.clear();
      },

      logout: async () => {
        set({ loading: true });
        try {
          await api.get("/api/users/auth/logout");
          toast.success("Logged out successfully!");
        } catch (error) { console.log(); }
        finally {
          useAuthStore.getState()._clearAuth();
        }
      },
    }),
    {
      name: "auth",
      getStorage: () => localStorage,
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
