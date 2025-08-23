import { create } from "zustand";
import api from "@/services/api.js";
import toast from "react-hot-toast";

const useApiDataStore = create((set) => ({
  error: null,

  fetchData: async (endpoint) => {
    set({ error: null });
    try {
      const response = await api.get(endpoint, { withCredentials: true });

      if (!response || !response.data || !response.data.success) {
        const errorMessage = response?.data?.error || "Failed to fetch data";
        set({ error: errorMessage });
        toast.error(errorMessage);
        return null;
      }

      return response.data.result;
    } catch (error) {
      set({ error: error?.data?.error || "An unexpected error occurred" });
      toast.error(error?.data?.error || "An unexpected error occurred");
      return null;
    }
  },

  downloadFile: async (endpoint) => {
    try {
      const response = await api.get(endpoint, {
        responseType: "arraybuffer",
        withCredentials: true,
      });
      return new Blob([response.data], {
        type: response.headers["content-type"],
      });
    } catch (error) {
      throw new Error("Failed to download file");
    }
  },

  addData: async (endpoint, newData) => {
    set({ error: null });
    try {
      const response = await api.post(endpoint, newData, {
        withCredentials: true,
      });

      if (!response || !response.data || !response.data.success) {
        const errorMessage = response?.data?.error || "Failed to add data";
        set({ error: errorMessage });
        toast.error(errorMessage);
        return null;
      }

      return response.data.result;
    } catch (error) {
      set({
        error: error?.data?.error || "Failed to add data",
      });
      toast.error(error?.data?.error || "Failed to add data");
      return null;
    }
  },

  updateData: async (endpoint, updatedData) => {
    set({ error: null });
    try {
      const response = await api.put(endpoint, updatedData, {
        withCredentials: true,
      });


      if (!response || !response.data || !response.data.success) {
        const errorMessage = response?.data?.error || "Failed to update data";
        set({ error: errorMessage });
        toast.error(errorMessage);
        return null;
      }

      toast.success(response.data.message || "Successfully updated Data");
      return response.data.result;
    } catch (error) {
      set({ error: error?.data?.error || "An unexpected error occurred" });
      toast.error(error?.data?.error || "An unexpected error occurred");
      return null;
    }
  },

  deleteData: async (endpoint) => {
    set({ error: null });
    try {
      const response = await api.delete(endpoint, {
        withCredentials: true,
      });

      if (!response || !response.data || !response.data.success) {
        const errorMessage = response?.data?.error || "Failed to delete";
        set({ error: errorMessage });
        toast.error(errorMessage);
        return null;
      }

      toast.success(response.data.message || "Successfully deleted Data");
      return response.data.result;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      set({ error: error?.response?.data?.error || "Failed to delete" });
    }
  },
}));

export default useApiDataStore;
