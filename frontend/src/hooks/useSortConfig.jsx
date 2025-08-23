import { useState } from "react";

function useSortConfig(initialKey = "category") {
  const [sortConfig, setSortConfig] = useState({ key: initialKey, direction: "asc" });

  // Toggle sorting direction or switch to new key
  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  // Return sort icon for UI display (you can replace with your own JSX/icons)
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <span className="text-sm ml-1">▲</span>
      ) : (
        <span className="text-sm ml-1">▼</span>
      );
    }
    return <span className="text-sm ml-1 text-gray-400">▲▼</span>;
  };

  return { sortConfig, handleSort, getSortIcon };
}

export default useSortConfig;
