import React from "react";
import { useReportStore } from "@/store/index.js";
import Select from "react-select";

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const years = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: year, label: year.toString() };
});

const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "home", label: "Home" },
];

const brands = [
  { value: "apple", label: "Apple" },
  { value: "samsung", label: "Samsung" },
  { value: "sony", label: "Sony" },
];

const searchableOptions = [
  { value: "product1", label: "Product 1" },
  { value: "product2", label: "Product 2" },
  { value: "product3", label: "Product 3" },
];

const ReportFilters = () => {
  const filters = useReportStore((state) => state.filters);
  const setFilters = useReportStore((state) => state.setFilters);
  const resetFilters = useReportStore((state) => state.resetFilters);

  const handleChange = (field, value) => setFilters(field, value);

  const handleReset = () => resetFilters();

  const handleSubmit = () => {};

  return (
    <div
      className="space-y-4 p-4 w-md rounded bg-base-100 border border-primary"
      id="report-filters"
    >
      <div className="grid grid-cols-2 gap-2">
        {/* Date Range */}
        <div className="grid grid-cols-2 gap-2 col-span-2">
          <div className="form-control grid">
            <label className="label">From Date</label>
            <input
              type="date"
              className="py-2 px-3 rounded"
              value={filters.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>
          <div className="form-control grid">
            <label className="label">To Date</label>
            <input
              type="date"
              className="py-2 px-3 rounded"
              value={filters.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </div>
        </div>

        {/* Month */}
        <div className="form-control grid">
          <label className="label">Month</label>
          <select
            className="py-2 px-3 rounded"
            value={filters.month}
            onChange={(e) => handleChange("month", e.target.value)}
          >
            <option value="">Select month</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="form-control grid">
          <label className="label">Year</label>
          <select
            className="py-2 px-3 rounded"
            value={filters.year}
            onChange={(e) => handleChange("year", e.target.value)}
          >
            <option value="">Select year</option>
            {years.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="form-control grid">
          <label className="label">Category</label>
          <select
            className="py-2 px-3 rounded"
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div className="form-control grid">
          <label className="label">Brand</label>
          <select
            className="py-2 px-3 rounded"
            value={filters.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
          >
            <option value="">Select brand</option>
            {brands.map((brand) => (
              <option key={brand.value} value={brand.value}>
                {brand.label}
              </option>
            ))}
          </select>
        </div>

        {/* Searchable Dropdown */}
        <div className="form-control col-span-2">
          <label className="label">Search Product</label>
          <Select
            options={searchableOptions}
            value={filters.search}
            onChange={(selected) => handleChange("search", selected)}
            isClearable
          />
        </div>

        <div className="col-span-2 mt-8 flex justify-end">
          <button
            onClick={handleReset}
            className="btn btn-outline btn-primary mr-2"
          >
            Reset
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
