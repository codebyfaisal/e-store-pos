import { create } from "zustand";

const initialFilters = {
  startDate: "",
  endDate: "",
  month: "",
  year: "",
  category: "",
  brand: "",
  search: null,
};

const useReportStore = create((set) => ({
  filters: initialFilters,

  setFilters: (field, value) =>
    set((state) => ({
      filters: { ...state.filters, [field]: value },
    })),

  resetFilters: () =>
    set({
      filters: initialFilters,
    }),
}));

export default useReportStore;
