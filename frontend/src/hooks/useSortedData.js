// src/hooks/useSortedData.js
const useSortedData = (data, sortConfig) => {
  if (!sortConfig || !sortConfig.key) return data;

  const sorted = [...data];

  sorted.sort((a, b) => {
    const { key, direction } = sortConfig;
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === undefined || bVal === undefined) return 0;

    // Date comparison
    if (aVal instanceof Date && bVal instanceof Date) {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    // String comparison
    if (typeof aVal === "string" && typeof bVal === "string") {
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    // Number or fallback comparison
    return direction === "asc" ? aVal - bVal : bVal - aVal;
  });

  return sorted;
};

export default useSortedData;
