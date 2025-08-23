import React, { useState } from "react";

const Filters = ({ filters, setFilters, components }) => {
  const [selectedSearch, setSelectedSearch] = useState(
    components.searchFields?.[0]?.key || ""
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e, field) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  return (
    <div className="w-full flex items-end lg:items-start flex-col md:flex-row gap-2">
      <form className="w-full space-y-4 md:max-w-screen-l">
        {/* 🔍 Search Box + Show Button */}
        <div className="flex items-center gap-2 w-full relative flex-grow">
          <input
            type="text"
            placeholder={`Search by ${components.searchFields
              .map((f) => f.label)
              .join(", ")}`}
            className="p-2 text-sm w-full"
            value={filters[selectedSearch] || ""}
            onChange={(e) => handleChange(e, selectedSearch)}
          />
          {/* 🔽 Dropdown for Search Fields (if more than one) */}
          {components.searchFields.length > 1 && (
            <div className="absolute top-0 right-0">
              <select
                className="px-4 py-2 text-sm"
                value={selectedSearch}
                onChange={(e) => setSelectedSearch(e.target.value)}
              >
                {components.searchFields.map((field) => (
                  <option key={field.key} value={field.key}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 🎛️ Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 pt-2">
            {/* Dropdown Filters */}
            {components.dropdown?.map((dropdown, index) => (
              <div key={index}>
                <label className="block text-sm mb-1">{dropdown.name}</label>
                <select
                  className="w-full p-2 text-sm"
                  value={filters[dropdown.field] || ""}
                  onChange={(e) => handleChange(e, dropdown.field)}
                >
                  <option value="">All {dropdown.name}</option>
                  {dropdown.options.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Price Range */}
            {components.maxMin && (
              <>
                <div>
                  <label className="block text-sm mb-1">Min Price</label>
                  <input
                    type="number"
                    placeholder="Min Price"
                    className="w-full p-2 text-sm"
                    value={filters.minPrice || ""}
                    onChange={(e) => handleChange(e, "minPrice")}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Max Price</label>
                  <input
                    type="number"
                    placeholder="Max Price"
                    className="w-full p-2 text-sm"
                    value={filters.maxPrice || ""}
                    onChange={(e) => handleChange(e, "maxPrice")}
                  />
                </div>
              </>
            )}

            {/* Date Range */}
            {components.timeRange && (
              <>
                <div>
                  <label className="block text-sm mb-1">From Date</label>
                  <input
                    type="date"
                    className="w-full p-2 text-sm"
                    value={filters.fromDate || ""}
                    onChange={(e) => handleChange(e, "fromDate")}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">To Date</label>
                  <input
                    type="date"
                    className="w-full p-2 text-sm"
                    value={filters.toDate || ""}
                    onChange={(e) => handleChange(e, "toDate")}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </form>
      <button
        type="button"
        className="px-4 py-2 text-sm cursor-pointer block w-35 font-bold"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? "Hide" : "Show"} Filters
      </button>
    </div>
  );
};

export default Filters;
